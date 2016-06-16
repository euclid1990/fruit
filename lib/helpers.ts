/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @return obj3 a new object based on obj1 and obj2
 */
export function mergeOptions(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

/**
 * Check string is null or white space
 * @param str
 * @return boolean
 */
export function isNullOrWhiteSpace(str) {
    if (typeof str == 'undefined') {
        return true;
    }
    return str === null || str.match(/^ *$/) !== null;
}

/**
 * Random an element of array
 * @param arr
 * @return element
 */
export function randomArray(arr) {
    if (arr instanceof Array) {
        let index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
    return arr;
}