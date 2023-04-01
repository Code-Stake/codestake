import React from "react";
import { app } from "../firebase";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";

// get firebase users

export const Dashboard = () => {
  const db = getFirestore(app);
  const userRef = collection(db, "users");

  getDocs(userRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().firstName} ${doc.data().lastName}`);
    });
  });

  // updateDoc(userDoc, {
  //   newProperty: "new value"
  // })

  // @ts-ignore
  // const userRef = app.firestore().collection("users");
  return (
    <div>
      <h1>Dashboard</h1>

      <button>Find Match</button>

      <div>
        <button>Elo 1</button>
        <button>Elo 2</button>
        <button>Elo 3</button>
        <button>Elo 4</button>
      </div>

      <div>UserRef</div>
    </div>
  );
};
