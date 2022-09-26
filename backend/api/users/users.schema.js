const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required().email({minDomainSegments: 2}),
    password: Joi.string().trim().min(8).max(50).required(),
    avatar: Joi.string().allow(null)
});

module.exports = schema;