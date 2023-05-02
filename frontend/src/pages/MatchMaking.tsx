import {ref, set} from "firebase/database";
import {db} from "../firebase";

export const MatchMaking = () => {
  const writeUserData = (userId: string, firstName: string, elo: number) => {
    console.log("writeUserData3");
    const refrence = ref(db, "matchMakingQueue/" + userId);
    set(refrence, {
      username: firstName,
      elo: elo,
    });
  };

  return (
    <div className=" w-full h-screen flex flex-col items-center justify-center">
      <h1>MatchMaking</h1>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => writeUserData("4", "test", 100)}
        >
          test
        </button>
      </div>
    </div>
  );
};
