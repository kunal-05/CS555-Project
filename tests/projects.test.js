
const resources = require("../data/resources");
const comments = require("../data/comments");
const request = require('supertest');
const { ObjectId } = require('mongodb');
const { createComment } = require('../data/comments');
const projects = require('../data/projects');
const userData = require('../data/users');
const validation = require('../helper');
//const projects = require("../routes/projects");

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



describe('createComment', () => {
  const mockProjectId = new ObjectId();
  const mockUserId = 'user123';
  const mockCommentText = 'This is a comment';


  beforeEach(() => {
    
    jest.spyOn(projects, 'getProjectById').mockResolvedValue({ _id: mockProjectId });
   // jest.replaceProperty(projects, 'findOne', jest.fn().mockResolvedValue({ _id: mockProjectId }));
    jest.spyOn(userData, 'getUserById').mockResolvedValue({
      firstName: 'Hester',
      lastName: 'Li'
    });
    jest.spyOn(validation, 'validId').mockReturnValue(true);
    jest.spyOn(validation, 'validString').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test case 1: valid input returns project with new comment
  // it('should return the project with the new comment when given valid input', async () => {
  //   const expectedComment = {
  //     _id: expect.any(ObjectId),
  //     userId: 'John Doe',
  //     commentText: mockCommentText
  //   };
  //   const expectedProject = {
  //     _id: mockProjectId.toString(),
  //     comments: [expectedComment]
  //   };

  //   const actualProject = await createComment(mockProjectId.toString(), mockUserId, mockCommentText);

  //   expect(actualProject).toEqual(expectedProject);
  // });

 // Test case 2: invalid project id throws error
  it('should throw an error when given an invalid project id', async () => {
    jest.spyOn(validation, 'validId').mockReturnValue(false);

    try {
      const res = await createComment('123', mockUserId, mockCommentText)
    } catch (error) {
      expect(error).toBe('projectId must be given as a string');
    }
    
  });

  // Test case 3: invalid user id throws error
  test('should throw an error when given an invalid user id', async () => {
    jest.spyOn(validation, 'validString').mockReturnValue(false);

    try {
      const result = await createComment(mockProjectId.toString(), null, mockCommentText)
    } catch (error) {
      expect(error).toBe('userId must be given as a string');
    }
    
  });



  // Test case 4: non-existent project id throws error
  it('should throw an error when the project does not exist', async () => {
    jest.spyOn(projects, 'getProjectById').mockResolvedValue(null);

    try {
      const res = await createComment(mockProjectId.toString(), mockUserId, mockCommentText)
    } catch (error) {
      expect(error).toBe('Project to which comment added doesnt exist'); 
    }
  });
});


