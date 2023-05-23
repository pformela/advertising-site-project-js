const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcrypt");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const changeUserData = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, city, userId } = req.body;

  if (!firstName || !lastName || !phone || !city || !userId) {
    res.status(400).send("Missing data");
  }

  const changeUserDataSession = driver.session();
  const changeUserDataResult = await changeUserDataSession
    .run(
      `
      MATCH (u:User {userId: "${userId}"})
      SET u.firstName = "${firstName}", u.lastName = "${lastName}", u.phone = "${phone}", u.city = "${city}"
      RETURN u
      `
    )
    .then((result) => {
      changeUserDataSession.close();
      const user = result.records[0].get("u").properties;
      res.json({
        email: user.email,
        phone: user.phone,
        userId: user.userId,
        city: user.city,
        firstName: user.firstName,
        lastName: user.lastName,
        message: "Zaktualizowano dane użytkownika.",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const changeUserEmail = asyncHandler(async (req, res) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    res.status(400).send("Missing data");
    return;
  }

  const checkEmailSession = driver.session();
  const checkEmailResult = await checkEmailSession
    .run(
      `
      MATCH (u:User {email: "${email}"})
      RETURN u
      `
    )
    .then((result) => {
      checkEmailSession.close();
      if (result.records.length > 0) {
        res.status(400).send("Email already exists");
        return;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const changeUserEmailSession = driver.session();
  const changeUserEmailResult = await changeUserEmailSession
    .run(
      `
      MATCH (u:User {userId: "${userId}"})
      SET u.email = "${email}"
      RETURN u
      `
    )
    .then((result) => {
      changeUserEmailSession.close();
      const user = result.records[0].get("u").properties;
      res.json({
        email: user.email,
        phone: user.phone,
        userId: user.userId,
        city: user.city,
        firstName: user.firstName,
        lastName: user.lastName,
        message: "Zaktualizowano adres email.",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { password, userId } = req.body;

  if (!password || !userId) {
    res.status(400).send("Missing data");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const changeUserPasswordSession = driver.session();
  const changeUserPasswordResult = await changeUserPasswordSession
    .run(
      `
      MATCH (u:User {userId: "${userId}"})
      SET u.hashedPassword = "${hashedPassword}"
      RETURN u
      `
    )
    .then((result) => {
      changeUserPasswordSession.close();
      const user = result.records[0].get("u").properties;
      res.json({
        email: user.email,
        phone: user.phone,
        userId: user.userId,
        city: user.city,
        firstName: user.firstName,
        lastName: user.lastName,
        message: "Zaktualizowano hasło.",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  console.log(userId);

  if (!userId) {
    res.status(400).send("Missing data");
  }

  const deleteUserSession = driver.session();
  const deleteUserResult = await deleteUserSession
    .run(
      `
      MATCH (u:User {userId: "${userId}"})
      OPTIONAL MATCH (u)-[:POSTED]->(ad:Ad)-[:HAS_PHOTO]->(p)
      DETACH DELETE u, ad, p
      `
    )
    .then((result) => {
      deleteUserSession.close();

      console.log(result.summary.query.text);

      res.json({
        message: "Usunięto użytkownika",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = {
  changeUserData,
  changeUserEmail,
  changeUserPassword,
  deleteUser,
};
