const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(playlist, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, playlist, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylists(ownerId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists
            JOIN users
            ON playlists.owner = users.id 
            WHERE users.id = $1`,
      values: [ownerId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists
      JOIN users
      ON playlists.owner = users.id 
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    // this.clearPlaylistSongs(playlistId);
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus playlist');
    }
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan playlist song');
    }
    return result.rows[0].id;
  }

  async getPlaylistSong(playlistId) {
    const query = {
      text: `SELECT songs.id, 
      songs.title, 
      songs.performer 
        FROM playlist_songs
        JOIN songs
        ON playlist_songs.song_id = songs.id 
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSong(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus playlist song');
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    await this.verifyPlaylist(playlistId);

    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const { owner } = result.rows[0];
    if (owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki akses');
    }
  }

  async verifyPlaylist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async clearPlaylistSongs(playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistsService;
