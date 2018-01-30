var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when user tries to save/remove/etc. constructor-less object (object literal) instead of entity.
 */
var CannotDetermineEntityError = /** @class */ (function (_super) {
    __extends(CannotDetermineEntityError, _super);
    function CannotDetermineEntityError(operation) {
        var _this = _super.call(this) || this;
        _this.name = "CannotDetermineEntityError";
        _this.message = "Cannot " + operation + ", given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotDetermineEntityError;
}(Error));
export { CannotDetermineEntityError };

//# sourceMappingURL=CannotDetermineEntityError.js.map
