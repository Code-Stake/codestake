import { createContext, useEffect } from "react";
import { useContext } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

const UserContext = createContext({});

// @ts-ignore
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then((result) => {
        // @ts-ignore

        setUser(result.user);
        console.log("google", result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user", user);
      // @ts-ignore
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        signUpWithGoogle,
        user,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
