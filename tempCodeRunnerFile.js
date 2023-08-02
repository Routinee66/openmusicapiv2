= {
//   generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
//   generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
//   validateSongPayload: (payload) => {
//     const result = schemaValidator.validate(payload);

//     if (result.error) {
//       console.log(result.error.message);
//     } else {
//       console.log('Berhasil');
//     }
//   },
// };

// Ole.validateSongPayload(data);
// const token = Jwt.token.generate(data, process.env.ACCESS_TOKEN_KEY);
// // const token = Ole.generateAccessToken(data, {key});

// // console.log({ key });
// console.log(token);