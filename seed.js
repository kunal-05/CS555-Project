const dbConnection = require("./config/mongoConnection");
const users = require("./data/users");
const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    //CREATE Ground staff 1 to staff 6
    const ground_staff1 = await users.createUser(
        "Jon",
        "Doe",
        "johndoe@org.com",
        "Test@123",
        "5512478555",
        "440 Elm Street, NJ 07307",
        "employee"
    )
    const ground_staff2 = await users.createUser(
        "John",
        "Snow",
        "johnsnow@org.com",
        "Test@123",
        "5512478515",
        "45 Wall Street, NJ 07307",
        "employee"
    )
    const ground_staff3 = await users.createUser(
        "Kate",
        "Baldwin",
        "katebaldwin@org.com",
        "Test@123",
        "5012478555",
        "345 Prince St, NJ 07307",
        "employee"
    )
    const ground_staff4 = await users.createUser(
        "Michaela",
        "Stone",
        "mstone@org.com",
        "Test@123",
        "4452018543",
        "123 Bronze Ave, NJ 07307",
        "employee"
    )
    const ground_staff5 = await users.createUser(
        "Fig",
        "Styles",
        "figstyles@org.com",
        "Test@123",
        "1512478275",
        "67 Mary Street, NJ 07307",
        "employee"
    )
    const ground_staff6 = await users.createUser(
        "Kyle",
        "Dunphy",
        "kyled@org.com",
        "Test@123",
        "4312095433",
        "9 Congress Ave, NJ 07307",
        "employee"
    )

    //CREATE customers 1 to 4
    const customer_1 = await users.createUser(
        "Divya",
        "Kamath",
        "dkamath@gmail.com",
        "Test@123",
        "5512478555",
        "440 Elm Street, NJ 07307",
        "customer"
    )
    const customer_2 = await users.createUser(
        "Kunal",
        "Mandalya",
        "kmandalya@gmail.com",
        "Test@123",
        "5512478515",
        "45 Wall Street, NJ 07307",
        "customer"
    )
    const customer_3 = await users.createUser(
        "Saumya",
        "Verma",
        "saumyav@gmail.com",
        "Test@123",
        "5012478555",
        "345 Prince St, NJ 07307",
        "customer"
    )
    const customer_4 = await users.createUser(
        "Ben",
        "Stone",
        "benstone@gmail.com",
        "Test@123",
        "4452018543",
        "123 Bronze Ave, NJ 07307",
        "customer"
    )
    //Add manager
    const manager = await users.createUser(
        "Hester",
        "Li",
        "hester.li@gmail.com",
        "Test@123",
        "5012456543",
        "123 Bronze Ave, NJ 07307",
        "admin"
    )

    //Create resource table

    console.log("Done seeding....");
    await dbConnection.closeConnection();
  };
  
  main().catch((error) => {
    console.log(error);
  });