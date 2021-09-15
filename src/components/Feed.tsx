import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Authentication from "./Authentication";
import { selectUser } from "../slice/userSlice";
import { login, logout } from "../slice/userSlice";
import { setStatus } from "../slice/statusSlice";
import { auth, db } from "../firebase";
const Feed = React.memo(({ children }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  //ログイン認証--------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            displayName: authUser.displayName,
            photoUrl: authUser.photoURL,
          })
        );
        const docRef = db.collection("status")?.doc(`${authUser.displayName}`);
        const doc = await docRef.get();
        if (doc.exists) {
          dispatch(
            setStatus({
              LoL: doc.data().status.LoL,
              Valorant: doc.data().status.Valorant,
              Apex: doc.data().status.Apex,
              Fortnite: doc.data().status.Fortnite,
              Game: doc.data().status.Game,
            })
          );
        }
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, []);
  //-------------------------------

  return <> {user.uid ? <>{children}</> : <Authentication />}</>;
});

export default Feed;
