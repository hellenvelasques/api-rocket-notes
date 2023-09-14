const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");

const AppError = require("../utils/AppError");


describe("UserCreateService", () => {
  let userRepositoryInMemory = null;
  let userCreateService = null;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userCreateService = new UserCreateService(userRepositoryInMemory);
  });

  it("user should be create", async () => {
    const user = {
      name: "Spec Test",
      email: "spectest@email.com",
      password: "123",
    };
  
    const userCreated = await userCreateService.execute(user);
    expect(userCreated).toHaveProperty("id");
  });

  it("user should not be create with same email", async () => {
    const user1 = {
      name: "Spec Test 1",
      email: "spectest@email.com",
      password: "123",
    };

    const user2 = {
      name: "Spec Test 2",
      email: "spectest@email.com",
      password: "123",
    };

    await userCreateService.execute(user1);
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está sendo utilizado."));
  });
});