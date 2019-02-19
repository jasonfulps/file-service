const config = require('../config');
const messages = require('./messages');
const logger = require('../lib/logger');

/**
 * A simple home grown localization util.
 * @param key
 * @param values
 * @returns {*}
 */
module.exports = function (key, values={}) {

    if (messages[key]){
        let str = messages[key];
        if(Object.keys(values).length) {
            str = setStringValues(str, values)
        }
        return str;
    } else {
        logger.error("Missing localization: " + key);
        return key;
    }
};

function setStringValues(str="", values) {
    Object.keys(values).forEach(key => {
        let searchString = "{{"+key+"}}";
        str = str.replace(new RegExp(searchString, "g"),values[key])
    });
    return str;
}