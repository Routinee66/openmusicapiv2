const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, activitiesService, tokenManager, validator) {
    this._playlistsService = playlistsService;
    this._activitiessService = activitiesService;
    this._songsService = songsService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name: playlist } = request.payload;
    const { id: ownerId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist(playlist, ownerId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil membuat playlist',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(ownerId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await this._playlistsService.deletePlaylist(playlistId);
    return {
      status: 'success',
      message: 'Berhasil manghapus playlists',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._songsService.verifySong(songId);

    const { id: ownerId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

    const playlistSongId = await this._playlistsService.addPlaylistSong(playlistId, songId);
    await this._activitiessService.addActivities(playlistId, songId, ownerId, 'add');
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu pada playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId, ownerId);
    const songs = await this._playlistsService.getPlaylistSong(playlistId);
    playlist.songs = songs;
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

    await this._playlistsService.deletePlaylistSong(songId);

    await this._activitiessService.addActivities(playlistId, songId, ownerId, 'delete');
    return {
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

    const activities = await this._activitiessService.getActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
