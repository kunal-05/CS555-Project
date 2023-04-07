const projects = require("../data/projects");
const resources = require("../data/resources");
// jest.mock('../request');


// The assertion for a promise must be returned.
// async/await can be used.

test("create a resource", async()=>{
    const res = await resources.createResource(
        "Cordless drill",
        100,
        20
    )
    expect(res).toBe("Cordless drill");
})