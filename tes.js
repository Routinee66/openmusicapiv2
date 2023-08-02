const Joi = require('joi');

const Jwt = require('@hapi/jwt');

const schemaValidator = Joi.object({
  name: Joi.string().alphanum().max(6).required(),
  email: Joi.string().email().required(),
});

const data = {
  name: 'udinss',
  email: 'udine@petot.com',
//   id: 'udin@petot.com',
};

const key = {
    key: 'wew',
    algorithm: 'HS512',
};

const key2 = '123oke';

const tes1 = {
  header: { alg: 'HS512', typ: 'JWT' },
  payload: {
    aud: 'urn:audience:test',
    iss: 'urn:issuer:test',
    user: 'some_user_name',
    group: 'hapi_community',
    iat: 1600604562, // Will vary based on time
    exp: 1600618962, // Will vary based on time
  },
  signature: 'yh3ASEIrgNJZn...', // Will vary based on time
};

// const { payloed } = tes1.payload;
// const payluad = tes1.payload;

// console.log(payloed);
// console.log(payluad);

const Ole = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
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
const token = Jwt.token.generate(data, key);
// const token = Ole.generateAccessToken(data, {key});

// console.log({ key });
// console.log(token);

// const artifacts = Jwt.token.decode(token);
// Jwt.token.verifySignature(artifacts, key);
// const { payload } = artifacts.decoded;
// console.log(payload);

const wew = (prin) => {
  console.log(prin);
};

wew({ name: 'udin', age: 23, key2 });
