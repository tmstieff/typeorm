import "reflect-metadata";
import {expect} from "chai";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src/connection/Connection";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";

describe("decorators > relation-id > one-to-one", () => {
    
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load ids when loadRelationIdAndMap used on owner side", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "airplanes";
        await connection.manager.save(category2);

        const categoryByName1 = new Category();
        categoryByName1.name = "BMW";
        await connection.manager.save(categoryByName1);

        const categoryByName2 = new Category();
        categoryByName2.name = "Boeing";
        await connection.manager.save(categoryByName2);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.category = category1;
        post1.categoryByName = categoryByName1;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "about Boeing";
        post2.category = category2;
        post2.categoryByName = categoryByName2;
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .addOrderBy("post.id")
            .getMany();

        expect(loadedPosts![0].categoryId).to.not.be.empty;
        expect(loadedPosts![0].categoryId).to.be.equal(1);
        expect(loadedPosts![0].categoryName).to.not.be.empty;
        expect(loadedPosts![0].categoryName).to.be.equal("BMW");
        expect(loadedPosts![1].categoryId).to.not.be.empty;
        expect(loadedPosts![1].categoryId).to.be.equal(2);
        expect(loadedPosts![1].categoryName).to.not.be.empty;
        expect(loadedPosts![1].categoryName).to.be.equal("Boeing");

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categoryId).to.not.be.empty;
        expect(loadedPost!.categoryId).to.be.equal(1);
        expect(loadedPost!.categoryName).to.not.be.empty;
        expect(loadedPost!.categoryName).to.be.equal("BMW");
    })));

    it("should load id when loadRelationIdAndMap used on inverse side", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "airplanes";
        await connection.manager.save(category2);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.category2 = category1;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "about Boeing";
        post2.category2 = category2;
        await connection.manager.save(post2);

        let loadedCategories = await connection.manager
            .createQueryBuilder(Category, "category")
            .addOrderBy("category.id")
            .getMany();

        expect(loadedCategories![0].postId).to.not.be.empty;
        expect(loadedCategories![0].postId).to.be.equal(1);
        expect(loadedCategories![1].postId).to.not.be.empty;
        expect(loadedCategories![1].postId).to.be.equal(2);

        let loadedCategory = await connection.manager
            .createQueryBuilder(Category, "category")
            .where("category.id = :id", { id: 1 })
            .getOne();

        expect(loadedCategory!.postId).to.not.be.empty;
        expect(loadedCategory!.postId).to.be.equal(1);
    })));

});