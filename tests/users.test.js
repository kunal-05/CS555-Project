const users = require("../data/users")
// jest.mock('../request');

test("Crest a user", async() => {
    const user = await users.createUser(
        "Kunal",
        "Mandalya",
        "kmandalya@gmail.com",
        "Test@123",
        "5512478515",
        "45 Wall Street, NJ 07307",
        "customer"
    )
    expect(user).toBe("Kunal")
})
