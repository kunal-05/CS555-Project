const mongoCollections = require("../config/mongoCollections")
const users = require("../data/users")
const userColl = mongoCollections.users
// jest.mock('../request');

test("Create a user", async() => {
    const user = await users.createUser(
        "Mansi",
        "Mistry",
        "mistry@gmail.com",
        "Test@123",
        "5513357225",
        "45 Wall Street, NJ 07307",
        "customer"
    )
    const userCollection = await userColl()
    const search = await userCollection.findOne({firstName: "Mansi"})
    expect(user).toStrictEqual(search)
})