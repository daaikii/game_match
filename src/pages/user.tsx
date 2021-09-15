import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { storage, auth } from "../firebase";
import { selectUser, updateUserProfile } from "../slice/userSlice";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { Box, Modal } from "@material-ui/core";
import router from "next/router";

const user = () => {
  const userData = useSelector(selectUser);
  const [photo, setPhoto] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const photoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPhoto(e.target.files![0]);
      e.target.value = "";
    }
  };

  const userSubmit = async (e) => {
    const authUser = auth.currentUser;
    let url = "";
    if (photo) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + photo.name;
      await storage.ref(`avatars/${fileName}`).put(photo);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await authUser.updateProfile({
      displayName: e.displayName,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: e.displayName,
        photoUrl: url,
      })
    );
    router.push("/home");
  };

  const sendReset = async (e) => {
    await auth
      .sendPasswordResetEmail(e.resetEmail)
      .then(() => {
        setOpenModal(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => setValue("displayName", userData.displayName));

  return (
    <Layout title="home">
      <div className="user">
        <div className="user-wrapper">
          <h1 className="user-top">UserSetting</h1>
          <Box textAlign="center">
            <button
              className={`user-button-${
                photo ? "includeed" : "empty"
              } user-margin-bottom__20px`}
            >
              <label className="user-button-label">
                userIcon
                <AddAPhotoIcon />
                <input
                  type="file"
                  className="fileIcon"
                  onChange={photoChange}
                />
              </label>
            </button>
          </Box>
          <div>
            <form
              className="user-margin-bottom__20px"
              onSubmit={handleSubmit(userSubmit)}
            >
              <input
                className="user-input"
                {...register("displayName", { required: true })}
              />
              <button className="user-mini-button">変更</button>
            </form>
          </div>
          <div
            className="user-margin-bottom__20px user-reset"
            onClick={() => setOpenModal(true)}
          >
            resetPassword?
          </div>
          {openModal && (
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <form className="modal" onSubmit={handleSubmit(sendReset)}>
                <p>email</p>
                <input {...register("resetEmail", { required: true })} />
                <button>submit</button>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default user;
