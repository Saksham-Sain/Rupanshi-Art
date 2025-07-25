const Joi = require("joi");

module.exports.artworkSchema = Joi.object({
  artwork: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    size: Joi.string().required()
    // image validation removed
  }).required()
});
