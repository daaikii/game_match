import React, { useState } from "react";
import Layout from "../components/Layout";
import router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStatus,
  selectCondition,
  setCondition,
} from "../slice/statusSlice";
import { join } from "../slice/roomSlice";
import { db } from "../firebase";
import { useForm } from "react-hook-form";
import { getStatus } from "../gameapi";

export const titleData = { LoL: 5, Valorant: 5, Apex: 3, Fortnite: 4 };

const home: React.FC = () => {
  const [random, setRandom] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [title, setTitle] = useState("");
  const statusData = useSelector(selectStatus);
  const conditionData = useSelector(selectCondition);
  const [data, setData] = useState([
    {
      roomId: "",
      title: "",
      hostPhotoUrl: "",
      hostName: "",
      member: [""],
      roomState: false,
      condition: "",
    },
  ]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const selectCategorie = (categorie: string) => {
    setCategorie(categorie);
    setValue("title", "");
    setTitle("");
    db.collection(categorie)
      .get()
      .then((doc) => {
        let pushForData = [];
        doc.docs.map((doc) => {
          if (
            doc.data().limits > doc.data().member.length ||
            doc.data().limits == ""
          ) {
            switch (categorie) {
              case "esports": {
                if (titleData[doc.data().title] > doc.data().member.length) {
                  console.log(titleData[doc.data().title]);
                  if (conditionData) {
                    if (conditionData === doc.data().condition) {
                      pushForData.push({
                        roomId: doc.id,
                        title: doc.data().title,
                        hostPhotoUrl: doc.data().hostPhotoUrl,
                        hostName: doc.data().hostName,
                        member: doc.data().member,
                        roomState:
                          titleData[doc.data().title] >
                          doc.data().member.lengeht, //通常のmatchの際の表示・非表示に使用
                        condition: doc.data().condition,
                      });
                    }
                  } else {
                    pushForData.push({
                      roomId: doc.id,
                      title: doc.data().title,
                      hostPhotoUrl: doc.data().hostPhotoUrl,
                      hostName: doc.data().hostName,
                      member: doc.data().member,
                      roomState:
                        titleData[doc.data().title] > doc.data().member.lengeht, //通常のmatchの際の表示・非表示に使用
                      condition: doc.data().condition,
                    });
                  }
                }
                break;
              }
              default: {
                console.log(categorie);
                if (conditionData) {
                  if (conditionData === doc.data().condition) {
                    pushForData.push({
                      roomId: doc.id,
                      title: doc.data().title,
                      hostPhotoUrl: doc.data().hostPhotoUrl,
                      hostName: doc.data().hostName,
                      member: doc.data().member,
                      roomState:
                        titleData[doc.data().title] > doc.data().member.lengeht, //通常のmatchの際の表示・非表示に使用
                      condition: doc.data().condition,
                    });
                  }
                } else {
                  pushForData.push({
                    roomId: doc.id,
                    title: doc.data().title,
                    hostPhotoUrl: doc.data().hostPhotoUrl,
                    hostName: doc.data().hostName,
                    member: doc.data().member,
                    roomState:
                      titleData[doc.data().title] > doc.data().member.lengeht, //通常のmatchの際の表示・非表示に使用
                    condition: doc.data().condition,
                  });
                }
                break;
              }
            }
          }
        });
        setData(pushForData);
        router.push("/home");
      });
  };

  const handleSort = (e) => {
    dispatch(setCondition(e.condition));
    router.push("/home");
  };

  //ランダム参加--------------------------------------------
  const onSubmit = async (e) => {
    if (title) {
      const roomIdArray = data.map((datum) => {
        return datum.roomId;
      });
      const randomId =
        roomIdArray[Math.floor(Math.random() * roomIdArray.length)];
      const doc = db.collection(categorie).doc(randomId);
      const getRef = await doc.get();
      if (getRef.exists) {
        switch (categorie) {
          case "esports": {
            console.log(categorie);
            if (statusData[title].id && statusData[title].platform) {
              //選択したタイトルのステータスの確認
              if (getRef.data().member.length >= titleData[title]) {
                //メンバー数と選択したタイトルの最大人数を比較
                router.push("/home");
                return;
              } else {
                const response = await getStatus(
                  title,
                  statusData[title].platform,
                  statusData[title].id
                );
                if (!getRef.data().member.includes(statusData[title].id)) {
                  doc.set(
                    {
                      member: [...getRef.data().member, statusData[title].id],
                      [statusData[title].id]: {
                        mode: "random",
                        level: response.level,
                        rank: response.rank,
                      },
                    },
                    { merge: true }
                  );
                }
                dispatch(
                  join({
                    categorie: categorie,
                    title: title,
                    roomId: randomId,
                    host: false,
                  })
                );
                router.push("/room");
              }
            } else {
              alert("ゲームアカウントを設定してください");
              router.push("/setting");
            }
            break;
          }
          default: {
            console.log(categorie);
            if (statusData.Game.id && statusData.Game.platform) {
              //選択したタイトルのステータスの確認
              if (!getRef.data().member.includes(statusData.Game.id)) {
                doc.set(
                  {
                    member: [...getRef.data().member, statusData.Game.id],
                    [statusData.Game.id]: {
                      mode: "random",
                    },
                  },
                  { merge: true }
                );
                dispatch(
                  join({
                    categorie: categorie,
                    title: title,
                    roomId: randomId,
                    host: false,
                  })
                );
                router.push("/room");
              }
            } else {
              alert("プレイするゲームアカウントを設定してください");
              router.push("/user");
            }
            break;
          }
        }
      }
    } else {
      alert("タイトルを選択してください");
    }
  };
  //-------------------------------------------------------------------------------------

  // 普通のマッチングの場合----------------------------------------------------------------
  const handleClick = async (roomId, title) => {
    const doc = db.collection(categorie).doc(roomId);
    const getRef = await doc.get();
    if (getRef.exists) {
      switch (categorie) {
        case "esports": {
          if (statusData[title].id && statusData[title].platform) {
            //選択したタイトルのステータスの確認
            if (getRef.data().member.length >= titleData[title]) {
              //メンバー数と選択したタイトルの最大人数を比較
              router.push("/home");
              return;
            } else {
              const response = await getStatus(
                title,
                statusData[title].platform,
                statusData[title].id
              );
              doc.set(
                {
                  member: [...getRef.data().member, statusData[title].id],
                  [statusData[title].id]: {
                    mode: "select",
                    level: response.level,
                    rank: response.rank,
                  },
                },
                { merge: true }
              );
              dispatch(
                join({
                  categorie: categorie,
                  title: title,
                  roomId: roomId,
                  host: false,
                })
              );
              router.push("/room");
            }
          } else {
            alert("ゲームアカウントを設定してください");
            router.push("/setting");
          }
          break;
        }
        default: {
          if (statusData.Game.id && statusData.Game.platform) {
            //選択したタイトルのステータスの確認
            doc.set(
              {
                member: [...getRef.data().member, statusData.Game.id],
                [statusData.Game.id]: {
                  mode: "select",
                },
              },
              { merge: true }
            );
            dispatch(
              join({
                categorie: categorie,
                title: title,
                roomId: roomId,
                host: false,
              })
            );
            router.push("/room");
          } else {
            alert("プレイするゲームアカウントを設定してください");
            router.push("/user");
          }
        }
      }
    } else {
      alert("タイトルを選択してください");
    }
  };
  //----------------------------------------------------------------------------------------

  return (
    <Layout title="home">
      <div className="home-categorie">
        <button
          className={`home-categorie-item ${
            categorie == "esports" ? "home-set" : "home-empty"
          }`}
          onClick={() => selectCategorie("esports")}
        >
          E-SPORTS
        </button>
        <button
          className={`home-categorie-item ${
            categorie == "others" ? "home-set" : "home-empty"
          }`}
          onClick={() => selectCategorie("others")}
        >
          OTHERS
        </button>
      </div>
      <div className={random ? "home-random" : "home-select"}>
        <button
          className="home-mode-button"
          onClick={() => {
            setRandom(!random);
            setTitle("");
          }}
        >
          {random ? "RANDOM" : "SELECT"}
        </button>
        <div className="home-condition">
          <form onSubmit={handleSubmit(handleSort)}>
            <select
              className="home-condition-input"
              name="condition"
              {...register("condition")}
            >
              <option value=""></option>
              <option value="ランク上げ">ランク上げ</option>
              <option value="気軽に">気軽に</option>
              <option value="エンジョイ">エンジョイ</option>
              <option value="ゲーム内ランクが同じ">ゲーム内ランクが同じ</option>
              <option value="ゲーム内レベルが同じ">ゲーム内レベルが同じ</option>
            </select>
            <button className="home-condition-button">条件を絞る</button>
          </form>
          <p>{conditionData}</p>
        </div>
        {random ? (
          <div className={`home-circle home-${title}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {categorie == "esports" ? (
                <ul className={"home-title"}>
                  <li
                    className={title === "Valorant" ? "home-set" : "home-empty"}
                    onClick={() => setTitle("Valorant")}
                  >
                    Valorant
                  </li>
                  <li
                    className={title === "LoL" ? "home-set" : "home-empty"}
                    onClick={() => setTitle("LoL")}
                  >
                    LoL
                  </li>
                  <li
                    className={title === "Apex" ? "home-set" : "home-empty"}
                    onClick={() => setTitle("Apex")}
                  >
                    Apex
                  </li>
                  <li
                    className={title === "Fortnite" ? "home-set" : "home-empty"}
                    onClick={() => setTitle("Fortnite")}
                  >
                    Fortnite
                  </li>
                </ul>
              ) : (
                <>
                  {categorie && (
                    <select
                      className={`home-title ${
                        title ? "home-set" : "home-empty"
                      }`}
                    >
                      <option>TITLE</option>
                      {data.map((datum, index) => {
                        return (
                          <option
                            key={index}
                            onClick={() => setTitle(datum.title)}
                          >
                            {datum?.title}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </>
              )}
              <button className="home-join">
                <h3>START</h3>
              </button>
            </form>
          </div>
        ) : (
          <div className="home-list-wrapper">
            {data.map((data, index) => {
              if (data.roomId) {
                return (
                  <div
                    className="home-list"
                    key={index}
                    onClick={() => handleClick(data.roomId, data.title)}
                  >
                    <div className={data.title} />
                    <p className="home-select-title">{data.title}</p>
                    <p className="home-select-hostName">{data.hostName}</p>
                    <p className="home-select-condition">{data.condition}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default home;
