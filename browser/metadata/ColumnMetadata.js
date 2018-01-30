import { OrmUtils } from "../util/OrmUtils";
import { MongoDriver } from "../driver/mongodb/MongoDriver";
import { PromiseUtils } from "../util/PromiseUtils";
/**
 * This metadata contains all information about entity's column.
 */
var ColumnMetadata = /** @class */ (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function ColumnMetadata(options) {
        /**
         * Type's length in the database.
         */
        this.length = "";
        /**
         * Indicates if this column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if this column is generated (auto increment or generated other way).
         */
        this.isGenerated = false;
        /**
         * Indicates if column value in the database should be unique or not.
         */
        this.isUnique = false;
        /**
         * Indicates if column can contain nulls or not.
         */
        this.isNullable = false;
        /**
         * Indicates if column is selected by query builder or not.
         */
        this.isSelect = true;
        /**
         * Indicates if column is protected from updates or not.
         */
        this.isReadonly = false;
        /**
         * Column comment.
         * This feature is not supported by all databases.
         */
        this.comment = "";
        /**
         * Indicates if this column is an array.
         */
        this.isArray = false;
        /**
         * Indicates if column is virtual. Virtual columns are not mapped to the entity.
         */
        this.isVirtual = false;
        /**
         * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
         */
        this.isDiscriminator = false;
        /**
         * Indicates if column is tree-level column. Tree-level columns are used in closure entities.
         */
        this.isTreeLevel = false;
        /**
         * Indicates if this column contains an entity creation date.
         */
        this.isCreateDate = false;
        /**
         * Indicates if this column contains an entity update date.
         */
        this.isUpdateDate = false;
        /**
         * Indicates if this column contains an entity version.
         */
        this.isVersion = false;
        /**
         * Indicates if this column contains an object id.
         */
        this.isObjectId = false;
        /**
         * Indicates if this column is nested set's left column.
         * Used only in tree entities with nested-set type.
         */
        this.isNestedSetLeft = false;
        /**
         * Indicates if this column is nested set's right column.
         * Used only in tree entities with nested-set type.
         */
        this.isNestedSetRight = false;
        /**
         * Indicates if this column is materialized path's path column.
         * Used only in tree entities with materialized path type.
         */
        this.isMaterializedPath = false;
        this.entityMetadata = options.entityMetadata;
        this.embeddedMetadata = options.embeddedMetadata;
        this.referencedColumn = options.referencedColumn;
        if (options.args.target)
            this.target = options.args.target;
        if (options.args.propertyName)
            this.propertyName = options.args.propertyName;
        if (options.args.options.name)
            this.givenDatabaseName = options.args.options.name;
        if (options.args.options.type)
            this.type = options.args.options.type;
        if (options.args.options.length)
            this.length = options.args.options.length ? options.args.options.length.toString() : "";
        if (options.args.options.charset)
            this.charset = options.args.options.charset;
        if (options.args.options.collation)
            this.collation = options.args.options.collation;
        if (options.args.options.primary)
            this.isPrimary = options.args.options.primary;
        if (options.args.options.unique)
            this.isUnique = options.args.options.unique;
        if (options.args.options.default === null)
            this.isNullable = true;
        if (options.args.options.nullable !== undefined)
            this.isNullable = options.args.options.nullable;
        if (options.args.options.select !== undefined)
            this.isSelect = options.args.options.select;
        if (options.args.options.readonly !== undefined)
            this.isReadonly = options.args.options.readonly;
        if (options.args.options.comment)
            this.comment = options.args.options.comment;
        if (options.args.options.default !== undefined)
            this.default = options.args.options.default;
        if (options.args.options.scale)
            this.scale = options.args.options.scale;
        if (options.args.options.precision)
            this.precision = options.args.options.precision;
        if (options.args.options.enum) {
            if (options.args.options.enum instanceof Object) {
                this.enum = Object.keys(options.args.options.enum).map(function (key) {
                    return options.args.options.enum[key];
                });
            }
            else {
                this.enum = options.args.options.enum;
            }
        }
        if (options.args.options.array)
            this.isArray = options.args.options.array;
        if (options.args.mode) {
            this.isVirtual = options.args.mode === "virtual";
            this.isTreeLevel = options.args.mode === "treeLevel";
            this.isCreateDate = options.args.mode === "createDate";
            this.isUpdateDate = options.args.mode === "updateDate";
            this.isVersion = options.args.mode === "version";
            this.isObjectId = options.args.mode === "objectId";
        }
        if (options.args.options.transformer)
            this.transformer = options.args.options.transformer;
        if (this.isTreeLevel)
            this.type = options.connection.driver.mappedDataTypes.treeLevel;
        if (this.isCreateDate) {
            this.type = options.connection.driver.mappedDataTypes.createDate;
            if (!this.default)
                this.default = function () { return options.connection.driver.mappedDataTypes.createDateDefault; };
            if (!this.precision && options.connection.driver.mappedDataTypes.createDatePrecision)
                this.precision = options.connection.driver.mappedDataTypes.createDatePrecision;
        }
        if (this.isUpdateDate) {
            this.type = options.connection.driver.mappedDataTypes.updateDate;
            if (!this.default)
                this.default = function () { return options.connection.driver.mappedDataTypes.updateDateDefault; };
            if (!this.precision && options.connection.driver.mappedDataTypes.updateDatePrecision)
                this.precision = options.connection.driver.mappedDataTypes.updateDatePrecision;
        }
        if (this.isVersion)
            this.type = options.connection.driver.mappedDataTypes.version;
        if (options.closureType)
            this.closureType = options.closureType;
        if (options.nestedSetLeft)
            this.isNestedSetLeft = options.nestedSetLeft;
        if (options.nestedSetRight)
            this.isNestedSetRight = options.nestedSetRight;
        if (options.materializedPath)
            this.isMaterializedPath = options.materializedPath;
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Creates entity id map from the given entity ids array.
     */
    ColumnMetadata.prototype.createValueMap = function (value, useDatabaseName) {
        var _this = this;
        if (useDatabaseName === void 0) { useDatabaseName = false; }
        // extract column value from embeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object and return it in a
            // { data: { information: { counters: { id: ... } } } } format
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // now need to access post[data][information][counters] to get column value from the counters
            // and on each step we need to create complex literal object, e.g. first { data },
            // then { data: { information } }, then { data: { information: { counters } } },
            // then { data: { information: { counters: [this.propertyName]: entity[data][information][counters][this.propertyName] } } }
            // this recursive function helps doing that
            var extractEmbeddedColumnValue_1 = function (propertyNames, map) {
                var propertyName = propertyNames.shift();
                if (propertyName) {
                    map[propertyName] = {};
                    extractEmbeddedColumnValue_1(propertyNames, map[propertyName]);
                    return map;
                }
                // this is bugfix for #720 when increment number is bigint we need to make sure its a string
                if (_this.generationStrategy === "increment" && _this.type === "bigint")
                    value = String(value);
                map[useDatabaseName ? _this.databaseName : _this.propertyName] = value;
                return map;
            };
            return extractEmbeddedColumnValue_1(propertyNames, {});
        }
        else {
            // this is bugfix for #720 when increment number is bigint we need to make sure its a string
            if (this.generationStrategy === "increment" && this.type === "bigint")
                value = String(value);
            return _a = {}, _a[useDatabaseName ? this.databaseName : this.propertyName] = value, _a;
        }
        var _a;
    };
    /**
     * Extracts column value and returns its column name with this value in a literal object.
     * If column is in embedded (or recursive embedded) it returns complex literal object.
     *
     * Examples what this method can return depend if this column is in embeds.
     * { id: 1 } or { title: "hello" }, { counters: { code: 1 } }, { data: { information: { counters: { code: 1 } } } }
     */
    ColumnMetadata.prototype.getEntityValueMap = function (entity) {
        var _this = this;
        // extract column value from embeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object and return it in a
            // { data: { information: { counters: { id: ... } } } } format
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // now need to access post[data][information][counters] to get column value from the counters
            // and on each step we need to create complex literal object, e.g. first { data },
            // then { data: { information } }, then { data: { information: { counters } } },
            // then { data: { information: { counters: [this.propertyName]: entity[data][information][counters][this.propertyName] } } }
            // this recursive function helps doing that
            var extractEmbeddedColumnValue_2 = function (propertyNames, value, map) {
                var propertyName = propertyNames.shift();
                if (value === undefined)
                    return map;
                if (propertyName) {
                    var submap = {};
                    extractEmbeddedColumnValue_2(propertyNames, value[propertyName], submap);
                    if (Object.keys(submap).length > 0) {
                        map[propertyName] = submap;
                    }
                    return map;
                }
                if (value[_this.propertyName] !== undefined)
                    map[_this.propertyName] = value[_this.propertyName];
                return map;
            };
            var map = {};
            extractEmbeddedColumnValue_2(propertyNames, entity, map);
            return Object.keys(map).length > 0 ? map : undefined;
        }
        else {
            if (this.relationMetadata && entity[this.propertyName] && entity[this.propertyName] instanceof Object) {
                var map = this.relationMetadata.joinColumns.reduce(function (map, joinColumn) {
                    var value = joinColumn.referencedColumn.getEntityValueMap(entity[_this.propertyName]);
                    if (value === undefined)
                        return map;
                    return OrmUtils.mergeDeep(map, value);
                }, {});
                if (Object.keys(map).length > 0)
                    return _a = {}, _a[this.propertyName] = map, _a;
                return undefined;
            }
            else {
                if (entity[this.propertyName] !== undefined)
                    return _b = {}, _b[this.propertyName] = entity[this.propertyName], _b;
                return undefined;
            }
        }
        var _a, _b;
    };
    /**
     * Extracts column value from the given entity.
     * If column is in embedded (or recursive embedded) it extracts its value from there.
     */
    ColumnMetadata.prototype.getEntityValue = function (entity) {
        // if (entity === undefined || entity === null) return undefined; // uncomment if needed
        // extract column value from embeddeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // next we need to access post[data][information][counters][this.propertyName] to get column value from the counters
            // this recursive function takes array of generated property names and gets the post[data][information][counters] embed
            var extractEmbeddedColumnValue_3 = function (propertyNames, value) {
                var propertyName = propertyNames.shift();
                return propertyName && value ? extractEmbeddedColumnValue_3(propertyNames, value[propertyName]) : value;
            };
            // once we get nested embed object we get its column, e.g. post[data][information][counters][this.propertyName]
            var embeddedObject = extractEmbeddedColumnValue_3(propertyNames, entity);
            if (embeddedObject) {
                if (this.relationMetadata && this.referencedColumn) {
                    var relatedEntity = this.relationMetadata.getEntityValue(embeddedObject);
                    if (relatedEntity && relatedEntity instanceof Object) {
                        return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(relatedEntity));
                    }
                    else if (embeddedObject[this.propertyName] && embeddedObject[this.propertyName] instanceof Object) {
                        return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(embeddedObject[this.propertyName]));
                    }
                }
                else if (this.referencedColumn) {
                    return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(embeddedObject[this.propertyName]));
                }
                return PromiseUtils.extractValue(embeddedObject[this.propertyName]);
            }
            return undefined;
        }
        else {
            if (this.relationMetadata && this.referencedColumn) {
                var relatedEntity = this.relationMetadata.getEntityValue(entity);
                if (relatedEntity && relatedEntity instanceof Object && !(relatedEntity instanceof Function)) {
                    return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(relatedEntity));
                }
                else if (entity[this.propertyName] && entity[this.propertyName] instanceof Object && !(entity[this.propertyName] instanceof Function)) {
                    return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(entity[this.propertyName]));
                }
            }
            else if (this.referencedColumn) {
                return this.referencedColumn.getEntityValue(PromiseUtils.extractValue(entity[this.propertyName]));
            }
            return entity[this.propertyName];
        }
    };
    /**
     * Sets given entity's column value.
     * Using of this method helps to set entity relation's value of the lazy and non-lazy relations.
     */
    ColumnMetadata.prototype.setEntityValue = function (entity, value) {
        var _this = this;
        if (this.embeddedMetadata) {
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var extractEmbeddedColumnValue_4 = function (embeddedMetadatas, map) {
                // if (!object[embeddedMetadata.propertyName])
                //     object[embeddedMetadata.propertyName] = embeddedMetadata.create();
                var embeddedMetadata = embeddedMetadatas.shift();
                if (embeddedMetadata) {
                    if (!map[embeddedMetadata.propertyName])
                        map[embeddedMetadata.propertyName] = embeddedMetadata.create();
                    extractEmbeddedColumnValue_4(embeddedMetadatas, map[embeddedMetadata.propertyName]);
                    return map;
                }
                map[_this.propertyName] = value;
                return map;
            };
            return extractEmbeddedColumnValue_4(this.embeddedMetadata.embeddedMetadataTree.slice(), entity);
        }
        else {
            entity[this.propertyName] = value;
        }
    };
    // ---------------------------------------------------------------------
    // Builder Methods
    // ---------------------------------------------------------------------
    ColumnMetadata.prototype.build = function (connection) {
        this.propertyPath = this.buildPropertyPath();
        this.databaseName = this.buildDatabaseName(connection);
        this.databasePath = this.buildDatabasePath();
        this.databaseNameWithoutPrefixes = connection.namingStrategy.columnName(this.propertyName, this.givenDatabaseName, []);
        return this;
    };
    ColumnMetadata.prototype.buildPropertyPath = function () {
        var path = "";
        if (this.embeddedMetadata && this.embeddedMetadata.parentPropertyNames.length)
            path = this.embeddedMetadata.parentPropertyNames.join(".") + ".";
        path += this.propertyName;
        // we add reference column to property path only if this column is virtual
        // because if its not virtual it means user defined a real column for this relation
        // also we don't do it if column is inside a junction table
        if (!this.entityMetadata.isJunction && this.isVirtual && this.referencedColumn && this.referencedColumn.propertyName !== this.propertyName)
            path += "." + this.referencedColumn.propertyName;
        return path;
    };
    ColumnMetadata.prototype.buildDatabasePath = function () {
        var path = "";
        if (this.embeddedMetadata && this.embeddedMetadata.parentPropertyNames.length)
            path = this.embeddedMetadata.parentPropertyNames.join(".") + ".";
        path += this.databaseName;
        // we add reference column to property path only if this column is virtual
        // because if its not virtual it means user defined a real column for this relation
        // also we don't do it if column is inside a junction table
        if (!this.entityMetadata.isJunction && this.isVirtual && this.referencedColumn && this.referencedColumn.databaseName !== this.databaseName)
            path += "." + this.referencedColumn.databaseName;
        return path;
    };
    ColumnMetadata.prototype.buildDatabaseName = function (connection) {
        var propertyNames = this.embeddedMetadata ? this.embeddedMetadata.parentPrefixes : [];
        if (connection.driver instanceof MongoDriver)
            propertyNames = [];
        return connection.namingStrategy.columnName(this.propertyName, this.givenDatabaseName, propertyNames);
    };
    return ColumnMetadata;
}());
export { ColumnMetadata };

//# sourceMappingURL=ColumnMetadata.js.map
