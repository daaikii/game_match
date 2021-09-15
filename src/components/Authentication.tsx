import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../firebase";
import router from "next/router";
import { selectUser, signUpUserProfile } from "../slice/userSlice";
import Layout from "./Layout";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit } = useForm();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  //サインイン関数---------------
  const authSignIn = async (e) => {
    await auth
      .signInWithEmailAndPassword(e.email, e.password)
      .catch((error) => {
        alert(error);
      });
  };
  //-------------------------------

  //サインアップ関数---------------
  const authSignUp = async (e) => {
    const docRef = db.collection("status").doc(e.displayName);
    const doc = await docRef.get();
    if (doc.exists) {
      alert(
        "このdisplayNameは既に登録済みです。別のdisplayNameをお試しください"
      );
      return;
    }
    await auth
      .createUserWithEmailAndPassword(e.email, e.password)
      .then((authUser) =>
        authUser.user?.updateProfile({
          displayName: e.displayName,
        })
      )
      .catch((error) => alert(error));
    dispatch(
      signUpUserProfile({
        displayName: e.displayName,
      })
    );
    docRef.set({ status: "status" }).catch((error) => alert(error));
  };
  //-----------------------------

  return (
    <>
      <Layout title="home">
        {openModal ? (
          <>
            {user && (
              <div className="auth">
                <form
                  className="auth-form"
                  onSubmit={
                    isLogin
                      ? handleSubmit(authSignIn)
                      : handleSubmit(authSignUp)
                  }
                >
                  {isLogin ? (
                    <div>
                      <h2>E-MAIL</h2>
                      <input {...register("email")} />
                      <h2>PASSWORD</h2>
                      <input type="password" {...register("password")} />
                    </div>
                  ) : (
                    <div>
                      <h2>DISPLAYNAME</h2>
                      <input {...register("displayName")} />
                      <h2>EMAIL</h2>
                      <input {...register("email")} />
                      <h2>PASSWORD</h2>
                      <input type="password" {...register("password")} />
                    </div>
                  )}
                  <button className="auth-button">
                    {isLogin ? "Login" : "Signup"}
                  </button>
                </form>
                {isLogin ? (
                  <div className="auth-link" onClick={() => setIsLogin(false)}>
                    アカウント作成へ
                  </div>
                ) : (
                  <div className="auth-link" onClick={() => setIsLogin(true)}>
                    アカウントをお持ちの方
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="home">
            <div>
              <h1>welcom to gamematch</h1>
              <p>このアプリは、ゲーム用のマッチングアプリです。</p>
              <p>
                マッチングは、ランダム参加と選択して参加する方法があります。
              </p>
              <p>
                また、カテゴリーを分け、E-SPORTSカテゴリーを選択すると、同じランクやレベル帯にマッチングしてくれます。
              </p>
            </div>
            <div>
              <img src="../../image/" alt="ホーム画面" />
              <h2>ホーム画面</h2>
              <p></p>
            </div>
            <div>
              <img src="../../image/" alt="ルーム画面" />
              <h2>ルーム画面</h2>
              <p></p>
            </div>
            <div>
              <img src="../../image/" alt="募集画面" />
              <h2>募集画面</h2>
              <p></p>
            </div>
            <div>
              <img src="../../image/" alt="ゲーム情報設定画面" />
              <h2>ゲーム情報設定画面</h2>
              <p></p>
            </div>
            <div>
              <img src="../../image/" alt="ユーザー設定画面" />
              <h2>ユーザー設定画面</h2>
              <p></p>
            </div>
            <div className="auth-link" onClick={() => setOpenModal(true)}>
              ログイン
            </div>
          </div>
        )}
      </Layout>
      <footer className="fotter">
        <div className="fotter-wrapper"></div>
      </footer>
    </>
  );
};

export default Authentication;
