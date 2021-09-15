import React from "react";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from "next/router";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { selectUser } from "../slice/userSlice";
import { selectStatus, setStatus } from "../slice/statusSlice";

const setting: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);
  const status = useSelector(selectStatus);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    Object.keys(status)?.map((title) => {
      if (status[`${title}`]?.id) {
        setValue(`${title}Id`, status[`${title}`].id);
        setValue(`${title}Platform`, status[`${title}`].platform);
      }
    });
    setValue("displayName", userData.displayName);
  }, []);
  const statusSubmit = (e) => {
    const status = {
      LoL: { platform: e.LoLPlatform, id: e.LoLId },
      Valorant: { platform: e.ValorantPlatform, id: e.ValorantId },
      Apex: { platform: e.ApexPlatform, id: e.ApexId },
      Fortnite: { platform: e.FortnitePlatform, id: e.FortniteId },
      Game: { platform: e.GamePlatform, id: e.GameId },
    };
    dispatch(setStatus(status));
    const docRef = db.collection("status").doc(`${userData.displayName}`);
    docRef.set({
      status,
    });
    router.push("/home");
  };
  return (
    <Layout title="setting">
      <div className="setting">
        <div className="setting-wrapper">
          <form className="setting-form" onSubmit={handleSubmit(statusSubmit)}>
            <h3 className="setting-title">LeagueofLegends</h3>
            <div className="setting-subtitle">
              <p className="setting-subtitle-child">platform</p>
              <p className="setting-subtitle-child">PlayerName</p>
            </div>
            <div className="setting-post">
              <select
                className="setting-post-child"
                {...register("LoLPlatform")}
              >
                <option value="">PlatForm</option>
                <option value="pc">PC</option>
                <option value="mobile">mobile</option>
              </select>
              <input className="setting-input" {...register("LoLId")} />
            </div>
            <h3 className="setting-title">Valorant</h3>
            <p className="setting-subtitle-child">PlayerName</p>

            <div className="setting-post">
              <input
                className="setting-input__none"
                value="PC"
                {...register("ValorantPlatform")}
              />
              <input className="setting-input" {...register("ValorantId")} />
            </div>
            <h3 className="setting-title">ApexLegends</h3>
            <div className="setting-subtitle">
              <p className="setting-subtitle-child">platform</p>
              <p className="setting-subtitle-child">PlayerName</p>
            </div>
            <div className="setting-post">
              <select
                className="setting-post-child"
                {...register("ApexPlatform")}
              >
                <option value="">PlatForm</option>
                <option value="pc">PC</option>
                <option value="mobile">mobile</option>
                <option value="playstation">PlayStation</option>
                <option value="xbox">XBOX</option>
                <option value="switch">Switch</option>
              </select>
              <input className="setting-input" {...register("ApexId")} />
            </div>
            <h3 className="setting-title">Fortnite</h3>
            <div className="setting-subtitle">
              <p className="setting-subtitle-child">platform</p>
              <p className="setting-subtitle-child">PlayerName</p>
            </div>
            <div className="setting-post">
              <select
                className="setting-post-child"
                {...register("FortnitePlatform")}
              >
                <option value="">PlatForm</option>
                <option value="pc">PC</option>
                <option value="mobile">mobile</option>
                <option value="playStation">PlayStation</option>
                <option value="xbox">XBOX</option>
                <option value="switch">Switch</option>
              </select>
              <input className="setting-input" {...register("FortniteId")} />
            </div>
            <h3 className="setting-title">Game</h3>
            <div className="setting-subtitle">
              <p className="setting-subtitle-child">platform</p>
              <p className="setting-subtitle-child">PlayerName</p>
            </div>
            <div className="setting-post">
              <select
                className="setting-post-child"
                {...register("GamePlatform")}
              >
                <option value="">PlatForm</option>
                <option value="pc">PC</option>
                <option value="mobile">mobile</option>
                <option value="playStation">PlayStation</option>
                <option value="xbox">XBOX</option>
                <option value="switch">Switch</option>
              </select>
              <input className="setting-input" {...register("GameId")} />
            </div>
            <button className="setting-button">登録</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default setting;
