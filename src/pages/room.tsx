import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectRoom } from "../slice/roomSlice";
import { selectStatus } from "../slice/statusSlice";
import router from "next/router";
import { db } from "../firebase";
import { exit } from "../slice/roomSlice";

const room = () => {
  const roomData = useSelector(selectRoom);
  const statusData = useSelector(selectStatus);
  const [data, setData] = useState({ members: [], platform: "", id: [] });
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = db
      .collection(roomData.categorie)
      .doc(roomData.roomId)
      .onSnapshot((doc) => {
        switch (roomData.categorie) {
          case "esports": {
            console.log(roomData.categorie);
            const member = [];
            const idArr = [];
            doc.data().member.map((id) => {
              member.push({
                [id]: {
                  rank: doc.data()[id].rank,
                  level: doc.data()[id].level,
                  mode: doc.data()[id].mode,
                },
              });
              idArr.push(id);
            });
            setData({
              members: member,
              platform: doc.data().platform,
              id: idArr,
            });
            break;
          }
          default: {
            const member = [];
            const idArr = [];
            doc.data().member.map((id) => {
              member.push({
                [id]: {
                  mode: doc.data()[id].mode,
                },
              });
              idArr.push(id);
            });
            setData({
              members: member,
              platform: doc.data().platform,
              id: idArr,
            });
            break;
          }
        }
      });
    return () => {
      unSub();
      exitDelete();
      dispatch(exit());
    };
  }, []);

  const exitDelete = async () => {
    const res = data.members.filter(function (a) {
      if (roomData.categorie !== "esports") {
        return a !== statusData.Game.id;
      } else {
        return a !== statusData[roomData.title].id;
      }
    });
    const docRef = db.collection(roomData.categorie).doc(roomData.roomId);
    await docRef.set({ member: res }, { merge: true });
    await docRef.get().then((doc) => {
      console.log(doc.data().member.length);
      console.log(doc.data().member);
      if (doc.data().member) {
        db.collection(roomData.categorie).doc(roomData.roomId).delete();
      }
    });
  };

  const roomDelete = () => {
    db.collection(roomData.categorie).doc(roomData.roomId).delete();
    router.push("/");
  };
  const roomExit = () => router.push("/");
  return (
    <div className="room">
      <h1 className="room-title">{roomData.title}</h1>
      <p className="room-roomId">ROOMID:{roomData.roomId}</p>
      <p className="room-playform">PLATFORM:{data.platform}</p>
      {data.members.map((datum, index) => {
        return (
          <div className="room-list" key={index}>
            <p className="room-list-item">{data.id[index]}</p>
            <p className="room-list-item">{datum[data.id[index]].level}</p>
            <p className="room-list-item">{datum[data.id[index]].rank}</p>
            <p className="room-list-item">{datum[data.id[index]].mode}</p>
          </div>
        );
      })}
      {roomData.host ? (
        <div onClick={roomDelete}>解散する</div>
      ) : (
        <div onClick={roomExit}>退出する</div>
      )}
    </div>
  );
};

export default room;
