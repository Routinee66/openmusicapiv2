require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Albums
const albums = require('./api/albums');
const AlbumsServices = require('./service/postgres/albums/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsServices = require('./service/postgres/songs/SongsService');
const SongsValidator = require('./validator/songs');

// Songs
const users = require('./api/users');
const UsersServices = require('./service/postgres/users/UsersService');
const UsersValidator = require('./validator/users');

// Error handling
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsServices = new AlbumsServices();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsServices,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
