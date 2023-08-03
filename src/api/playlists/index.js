const routes = require('./routes');

const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistsService, songsService, tokenManager, validator,
    },
  ) => {
    const playlistHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      tokenManager,
      validator,
    );

    server.route(routes(playlistHandler));
  },
};
