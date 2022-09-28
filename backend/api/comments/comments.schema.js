const Joi = require('joi');

const schema = Joi.object({
    body: Joi.string().required().messages({'string.empty': 'No empty comments allowed.'}),
    postId: Joi.number()
});

module.exports = schema;