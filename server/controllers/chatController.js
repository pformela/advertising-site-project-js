const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const formatDate = (d) => {
  const date = new Date(d);
  const day = date.getDate();
  const month =
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes} ${day}.${month}`;
};

const changeDate = (date) => {
  const createdDate = new Date(date.toString())
    .toLocaleDateString(
      {},
      {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )
    .replace(",", "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return MONTHS[word];
      }
      return word;
    });

  return createdDate[1] + " " + createdDate[0] + " " + createdDate[2];
};

const postMessage = asyncHandler(async (req, res) => {
  const { message, receiverId, adId, userId, createdAt, chatId } = req.body;

  const messageId = uuidv4();

  const session = driver.session();

  const result = await session
    .run(
      `
      MATCH (sender:User {userId: "${userId}"}), (receiver:User {userId: "${receiverId}"}), (ad:Ad {id: "${adId}"})-[:HAS_PHOTO]->(photo:Photo)
      MERGE (sender)<-[:SENT]-(message:Message {chatId: "${chatId}", id: "${messageId}", message: "${message}", createdAt: "${createdAt}"})-[:RECEIVED]->(receiver)
      MERGE (message)-[:ABOUT]->(ad)
      RETURN message
      `
    )
    .then((result) => {
      session.close();
      res.status(200).json({ message: "OK" });
    })
    .catch((error) => {
      session.close();

      res.status(500).send(error);
    });
});

const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const chats = {};

  const sentMessagesSession = driver.session();
  const sentMessagesResult = await sentMessagesSession
    .run(
      `
      MATCH (user:User {userId: "${userId}"})
      OPTIONAL MATCH (user)<-[:SENT]-(message:Message)-[:RECEIVED]->(receiver:User)
      OPTIONAL MATCH (message)-[:ABOUT]->(ad:Ad)-[:HAS_PHOTO]->(photo:Photo)
      RETURN message, ad, user, receiver, photo
      ORDER BY message.createdAt ASC
      `
    )
    .then(async (result) => {
      sentMessagesSession.close();

      result.records.reduce((acc, record) => {
        const roomId = record.get("message")?.properties?.chatId;
        const message = record.get("message")?.properties;
        const ad = record.get("ad")?.properties;
        const receiver = record.get("receiver")?.properties;
        const receiverId = record.get("receiver")?.properties?.userId;
        const senderId = record.get("user")?.properties?.userId;
        const photo = record.get("photo")?.properties;

        if (!message) {
          return acc;
        }

        if (!chats[roomId]) {
          chats[roomId] = {
            ad: {
              adId: ad.id,
              title: ad.title,
              photoUrl: photo.url,
              price: ad.price.low,
              active: ad.active,
            },
            username: receiver.email.split("@")[0],
            messages: {
              [message.id]: {
                id: message.id,
                message: message.message,
                originalCreatedAt: message.createdAt,
                createdAt: formatDate(message.createdAt),
                type: "sender",
                senderId: senderId,
                receiverId: receiverId,
              },
            },
          };
        } else if (!chats[roomId].messages[message.id]) {
          chats[roomId].messages[message.id] = {
            id: message.id,
            message: message.message,
            originalCreatedAt: message.createdAt,
            createdAt: formatDate(message.createdAt),
            type: "sender",
            senderId: senderId,
            receiverId: receiverId,
          };
        }

        return acc;
      }, {});

      const receiverMessagesSession = driver.session();
      const receiverMessagesResult = await receiverMessagesSession
        .run(
          `
          MATCH (user:User {userId: "${userId}"})
          OPTIONAL MATCH (user)<-[:RECEIVED]-(message:Message)-[:SENT]->(sender:User)
          OPTIONAL MATCH (message)-[:ABOUT]->(ad:Ad)-[:HAS_PHOTO]->(photo:Photo)
          RETURN message, ad, user, sender, photo
          ORDER BY message.createdAt ASC
          `
        )
        .then((result) => {
          receiverMessagesSession.close();

          const finalChats = result.records.reduce((acc, record) => {
            const roomId = record.get("message")?.properties?.chatId;
            const message = record.get("message")?.properties;
            const ad = record.get("ad")?.properties;
            const sender = record.get("sender")?.properties;
            const receiver = record.get("user")?.properties;
            const receiverId = record.get("user")?.properties?.userId;
            const senderId = record.get("sender")?.properties?.userId;
            const photo = record.get("photo")?.properties;

            if (!message) {
              return acc;
            }

            if (!chats[roomId]) {
              chats[roomId] = {
                ad: {
                  adId: ad.id,
                  title: ad.title,
                  photoUrl: photo.url,
                  price: ad.price.low,
                  active: ad.active,
                },
                username: receiver.email.split("@")[0],
                messages: {
                  [message.id]: {
                    id: message.id,
                    message: message.message,
                    originalCreatedAt: message.createdAt,
                    createdAt: formatDate(message.createdAt),
                    type: "receiver",
                    receiverId: receiverId,
                    senderId: senderId,
                  },
                },
              };
            } else if (!chats[roomId].messages[message.id]) {
              chats[roomId].messages[message.id] = {
                id: message.id,
                message: message.message,
                originalCreatedAt: message.createdAt,
                createdAt: formatDate(message.createdAt),
                type: "receiver",
                receiverId: receiverId,
                senderId: senderId,
              };
            }
          }, {});

          Object.keys(chats).forEach((key) => {
            chats[key].messages = Object.values(chats[key].messages);
            chats[key].recipient = chats[key].messages[0].receiverId;
          });

          Object.keys(chats).forEach((key) => {
            chats[key].messages.sort((a, b) => {
              return (
                new Date(b.originalCreatedAt) - new Date(a.originalCreatedAt)
              );
            });
          });

          const sortedChatsKeys = Object.keys(chats).sort((a, b) => {
            return (
              new Date(chats[b].messages[0].originalCreatedAt) -
              new Date(chats[a].messages[0].originalCreatedAt)
            );
          });

          const sortedChats = sortedChatsKeys.reduce((acc, key) => {
            acc[key] = chats[key];

            return acc;
          }, {});

          res.status(200).json(sortedChats);
        })
        .catch((error) => {
          receiverMessagesSession.close();
          console.log(error);

          res.status(404).send(error);
        });

      return chats;
    })
    .catch((error) => {
      sentMessagesSession.close();
      console.log(error);

      res.status(404).send(error);
    });
});

const checkIfReceiverAndAdExist = asyncHandler(async (req, res) => {
  const { receiverId, adId } = req.body;

  const session = driver.session();

  const result = await session

    .run(
      `MATCH (receiver:User {userId: "${receiverId}"})
      MATCH (user)-[:POSTED]->(ad:Ad {id: "${adId}"})-[:HAS_PHOTO]->(photo:Photo)
      RETURN receiver, ad, photo, user
      `
    )
    .then((result) => {
      session.close();

      if (result.records.length === 0) {
        res.status(404).json({
          message: "Odbiorca, bądź ogłoszenie nie zostało odnalezione",
        });
      } else {
        const finalObj = {
          receiverId: result.records[0].get("receiver").properties.userId,
          username: result.records[0]
            .get("user")
            .properties.email.split("@")[0],
          adId: result.records[0].get("ad").properties.id,
          title: result.records[0].get("ad").properties.title,
          price: result.records[0].get("ad").properties.price.low,
          photoUrl: result.records[0].get("photo").properties.url,
          active: result.records[0].get("ad").properties.active,
        };
        res.status(200).json(finalObj);
      }
    })
    .catch((error) => {
      session.close();
      res.status(500).json(error);
    });
});

module.exports = {
  postMessage,
  getMessages,
  checkIfReceiverAndAdExist,
};
