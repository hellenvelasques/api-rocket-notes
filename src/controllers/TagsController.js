const knex = require('../database/knex');

class TagsController {
  async index(request, respose) {
    const user_id = request.user.id;

    const tags = await knex("tags")
    .where({ user_id })

    return respose.json(tags);
  }

}

module.exports = TagsController;