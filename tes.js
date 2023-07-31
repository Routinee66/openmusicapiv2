const Joi = require('joi');

const schemaValidator = Joi.object({
  name: Joi.string().alphanum().max(6).required(),
  email: Joi.string().email().required(),
});

const data = {
  name: 'udinss',
  email: 'udin@petot.com',
};

const Ole = {
  validateSongPayload: (payload) => {
    const result = schemaValidator.validate(payload);

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log('Berhasil');
    }
  },
};

Ole.validateSongPayload(data);
