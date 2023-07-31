const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.UserPayloadValidate(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.postUser(username, password, fullname);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan user baru',
      data: { userId },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
