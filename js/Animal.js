/**
 * Namespace for testing purposes
 * @namespace
 */
var namespace = {};


/**
 * Animal class
 * @class
 */
namespace.Animal = function()
{
    this.foo = 10;
    this.bar = "string";
};


/**
 * Public method example
 */
namespace.Animal.prototype.publicMethod = function()
{
    this._privateMethod();
};


/**
 * Private method example
 * @private
 */
namespace.Animal.prototype._privateMethod = function()
{
    // this methond is not in the output :(
};

/** Point class. */
class Point {
    /**
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        // ...
    }
}
/**
 * This is the __module__ description for the `YUIDoc` module.
 *
 *     var options = {
 *         paths: [ './lib' ],
 *         outdir: './out'
 *     };
 *
 *     var Y = require('yuidoc');
 *     var json = (new Y.YUIDoc(options)).run();
 *
 * @class YUIDoc
 * @main yuidoc
 */

