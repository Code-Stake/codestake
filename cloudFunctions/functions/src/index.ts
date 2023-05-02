import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as uuid from "uuid";

admin.initializeApp(functions.config().firebase);

const db = admin.database();

export const onNewEntry = functions.database
  .ref("/matchMakingQueue/{userId}")
  .onCreate(async (snapshot, context) => {
    console.log("Function Started");
    const queue = (await db.ref("/matchMakingQueue").once("value")).val();
    console.log("queue", queue);
    const userIds = Object.keys(queue);
    console.log("userIds", userIds);
    if (userIds.length >= 2) {
      const oldestUsers = userIds.slice(0, 2);
      const gameId = uuid.v4();
      for (const userId of oldestUsers) {
        const user = queue[userId];
        const newUser = {
          ...user,
          gameSessionId: gameId,
        };
        await db.ref(`/gameSessions/${userId}/`).set(newUser);
        await db.ref(`/matchMakingQueue/${userId}`).remove();
      }
    }
  });
