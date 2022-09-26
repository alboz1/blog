const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().min(5).required(),
    body: Joi.string().allow(''),
    img_header: Joi.string().allow(null),
    tags: Joi.array().items(Joi.string())
});

module.exports = schema;