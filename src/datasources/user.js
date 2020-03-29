const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async addFavorite({ keyword }) {
    const userId = this.context.user.id;
    const res = await this.store.favorites.findOrCreate({
      where: { userId, keyword },
    });
    return res && res.length ? res[0].get() : false;
  }
  
  async removeFavorite({ keyword }) {
    const userId = this.context.user.id;
    return !!this.store.favorites.destroy({ where: { userId, keyword } });
  }

  async getFavoritesByUser() {
    const userId = this.context.user.id;
    const found = await this.store.favorites.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.keyword).filter(l => !!l)
      : [];
  }

  async isAddedOnVocab({ keyword }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.favorites.findAll({
      where: { userId, keyword },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
