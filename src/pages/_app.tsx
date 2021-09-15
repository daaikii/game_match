import React from "react";
import "../styles/globals.scss";
import { Provider } from "react-redux";
import Feed from "../components/Feed";
import { store } from "../store/store";
import { CssBaseline } from "@material-ui/core";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Feed>
        <Component {...pageProps} />
      </Feed>
    </Provider>
  );
}

export default MyApp;
