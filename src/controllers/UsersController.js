const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body;

    const database = await sqliteConection();
    const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (checkUserExist) {
      throw new AppError("Este e-mail já está sendo utilizado.");
    };

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;
    
    const database = await sqliteConection();
    const user = await database.get(
      "SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
      throw new AppError("Usuário não encontrado!")
    }

    const userWithUpdatedEmail = await database.get (
      "SELECT * FROM users WHERE email = (?)", [email])

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já esta em uso!")
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldPassword) {
      throw new AppError("Você precisa digitar a senha antiga para definir a nova senha.");
    };

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.")
      };

      user.password = await hash(password, 8);
    };

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );
    
    return response.json("Usuário atualizado com sucesso!");
  }
};

module.exports = UsersController;