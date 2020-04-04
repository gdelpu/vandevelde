'use strict';

const Joi = require('@hapi/joi');
const Path = require('path');
const Fs = require('fs');

const OPTION_ITEM_SCHEMA = Joi.object({
    name: Joi.string(),
    module: Joi.alternatives().try(Joi.string(), Joi.object(), Joi.function()).required(),
    options: Joi.alternatives().try(Joi.object(), Joi.string()),
    decorate: Joi.array().items(Joi.string().valid('server', 'request', 'handler', 'response', 'toolkit')).required()
});

const OPTIONS_SCHEMA = Joi.alternatives().try(
    OPTION_ITEM_SCHEMA,
    Joi.array().items(OPTION_ITEM_SCHEMA));
//.valid(['server', 'request', 'handler', 'response', 'toolkit'])

exports.plugin = {
    pkg: require('../package.json'),
    multiple: true,
    register: function (server, options) {

        options = Array.isArray(options) ? options : [options]; //Convert options as an array of "option"
        Joi.assert(options, OPTIONS_SCHEMA, { abortEarly: true });

        for (const option of options) {

            if (typeof option.module === 'string') {
                // option.module is either a local path or a module name
                if (option.module.startsWith('.') || option.module.startsWith('/')) {

                    // If it is a relative path
                    if (!Fs.existsSync(option.module)) {
                        option.module = Path.join(process.mainModule.path, option.module);
                    }
                }

                //require the module
                option.module = require(option.module);
            }

            let myModule = null;
            switch (typeof option.module) {
                case 'object':

                    myModule = option.module;
                    break;
                case 'function':

                    myModule = option.options ? option.module(option.options) : option.module();
                    break;
            }

            for (const type of option.decorate) {
                if (option.name) {
                    server.decorate(type, option.name, myModule);
                } else {

                    for (const entry of Object.entries(myModule)) {
                        server.decorate(type, entry[0], entry[1]);
                    }
                }
            }
        }
    }
};
