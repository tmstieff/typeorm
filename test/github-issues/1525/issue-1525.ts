import "reflect-metadata";
import { expect } from "chai";

import { Connection } from "../../../src/connection/Connection";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { User } from "./entity/user";

describe("github issues > #1525 Incorrect behavior with timestamp columns and custom type transformers", () => {

    let connections: Connection[] = [];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["websql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should to create a query using a boolean conditional that returns result", () => Promise.all(connections.map(async connection => {
        
        const user = new User();
        user.name = "Timber";
        user.created_date = '2017-02-03';
        await user.save();

        let loadeduser = await User.findOne({ created_date: '2017-02-03'});

        expect(loadeduser).not.to.be.undefined;
        
    })));
});
