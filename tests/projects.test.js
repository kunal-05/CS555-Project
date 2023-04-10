const projects = require("../data/projects");
const resources = require("../data/resources");
// jest.mock('../request');

// The assertion for a promise must be returned.
// async/await can be used.

test("create a resource", async () => {
  const res = await resources.createResource("Cordless drill", 100, 20);
  expect(res).toBe("Cordless drill");
});

test("create project", async () => {
  const res = await projects.createProject(
    "Procure Items",
    "Paterson st,Jersey City, NJ 07307",
    "100",
    "9000000",
    "Mr Bob",
    "10/10/23",
    "10/11/23",
    "Kate",
    "64304946d0bb9b7731465252",
    "Maps"
  );
  expect(res).toBe("Procure Items");
});
