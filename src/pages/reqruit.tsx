import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../slice/userSlice";
import { selectStatus } from "../slice/statusSlice";
import { useForm } from "react-hook-form";
import router from "next/router";
import { db } from "../firebase";
import { reqruit } from "../slice/roomSlice";
import Layout from "../components/Layout";
import { getStatus } from "../gameapi";

const Reqruit = () => {
  const [data, setData] = useState([]);
  const [categorie, setCategorie] = useState("");
  const userData = useSelector(selectUser);
  const statusData = useSelector(selectStatus);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    switch (categorie) {
      case "esports": {
        if (statusData[e.title].id && statusData[e.title].platform) {
          const response = await getStatus(
            e.title,
            statusData[e.title].platform,
            statusData[e.title].id
          );
          db.collection(categorie)
            .add({
              title: e.title, //検索の際のカテゴリー絞り込み用
              hostPhotoUrl: userData.photoUrl, //homeのroom一覧用
              hostName: userData.displayName, //homeのroom一覧用
              member: [statusData[e.title].id], //人数制限や、room内でのメンバー確認用(ゲームIDを入れるため事前に取っておくこと)
              limits: e.limits, //制限人数を入れる場合
              condition: e.condition, //roomの条件を絞る時に使用
              platform: statusData[e.title].platform, //room内で確認のために使用
              [statusData[e.title].id]: {
                mode: "host",
                level: response.level,
                rank: response.rank,
              },
            })
            .then((docRef) => {
              dispatch(
                reqruit({
                  categorie: categorie,
                  title: e.title,
                  roomId: docRef.id,
                })
              );
              router.push("/room");
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          alert("ゲームアカウントを設定してください");
          router.push("/setting");
        }
        break;
      }
      default: {
        if (statusData.Game.id && statusData.Game.platform) {
          db.collection(categorie)
            .add({
              title: e.title, //検索の際のカテゴリー絞り込み用
              hostPhotoUrl: userData.photoUrl, //homeのroom一覧用
              hostName: userData.displayName, //homeのroom一覧用
              member: [statusData.Game.id], //人数制限や、room内でのメンバー確認用(ゲームIDを入れるため事前に取っておくこと)
              limits: e.limits, //制限人数を入れる場合
              condition: e.condition, //roomの条件を絞る時に使用
              platform: statusData.Game.platform, //room内で確認のために使用
              [statusData.Game.id]: {
                mode: "host",
              },
            })
            .then((docRef) => {
              dispatch(
                reqruit({
                  categorie: categorie,
                  title: e.title,
                  roomId: docRef.id,
                })
              );
              router.push("/room");
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          alert("プレイするゲームアカウントを設定してください");
          router.push("/setting");
        }
        break;
      }
    }
  };

  const handleClick = async (categorie) => {
    setCategorie(categorie);
    const titles: string[] = await db
      .collection(categorie)
      .get()
      .then((doc) =>
        doc.docs.map((doc) => {
          return doc.data().title;
        })
      );
    await titles.filter((x, i, self) => {
      return self.indexOf(x) === i;
    });
    setData(titles);
  };

  return (
    <Layout title="reqruit">
      <div className="reqruit">
        <div className="reqruit-wrapper">
          {categorie ? (
            <>
              <h2>{categorie == "esports" ? "E-SPORTS" : "OTHERS"}</h2>
              <div className="reqruit-categorie">
                <button onClick={() => handleClick("esports")}>E-SPORTS</button>
                <button onClick={() => handleClick("others")}>OTHERS</button>
              </div>
              <form className="reqruit-form" onSubmit={handleSubmit(onSubmit)}>
                <h5>Title</h5>
                {categorie == "esports" ? (
                  <select {...register("title")}>
                    <option value="">タイトル</option>
                    <option value="LoL">LoL</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Apex">Apex</option>
                    <option value="Fortnite">Fortnite</option>
                  </select>
                ) : (
                  <>
                    <select onChange={(e) => setValue("title", e.target.value)}>
                      <option>既存タイトルから選ぶ</option>
                      {data.map((title, index) => {
                        return (
                          <option key={index} value={title}>
                            {title}
                          </option>
                        );
                      })}
                    </select>
                    <input {...register("title", { required: true })} />
                  </>
                )}
                <h5>Condition</h5>
                <select name="condition" {...register("condition")}>
                  <option value="">どんなチームを組みますか？</option>
                  <option value="ランク上げ">ランク上げ</option>
                  <option value="気軽に">気軽に</option>
                  <option value="エンジョイ">エンジョイ</option>
                  <option value="ゲーム内ランクが同じ">
                    ゲーム内ランクが同じ
                  </option>
                  <option value="ゲーム内レベルが同じ">
                    ゲーム内レベルが同じ
                  </option>
                </select>
                <h5>Limits</h5>
                <select name="limits" {...register("limits")}>
                  <option value="">参加人数</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
                <button className="reqruit-submit">募集</button>
              </form>
            </>
          ) : (
            <>
              <h4>カテゴリーを選択してください</h4>
              <div className="reqruit-categorie">
                <button onClick={() => handleClick("esports")}>E-SPORTS</button>
                <button onClick={() => handleClick("others")}>OTHERS</button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reqruit;
