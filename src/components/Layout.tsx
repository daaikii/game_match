import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "../slice/userSlice";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { auth } from "../firebase";

type TITLE = {
  title: string;
};

const Layout: React.FC<TITLE> = ({ children, title = "nextjs" }) => {
  const userData = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="app">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="header">
        <div className="header-left">
          <Link href="/home">
            <button className="header-icon">
              <h1>gamematch</h1>
              <VideogameAssetIcon
                fontSize="large"
                className="header-miniicon"
              />
            </button>
          </Link>
        </div>
        <div className="header-right">
          {userData.uid ? (
            <>
              {isOpen ? (
                <ExpandLessIcon
                  onClick={() => setIsOpen(false)}
                  fontSize="large"
                />
              ) : (
                <ExpandMoreIcon
                  onClick={() => setIsOpen(true)}
                  fontSize="large"
                />
              )}
              <ul
                className={`header-list__${isOpen ? "display" : "none"}`}
                onBlur={() => setIsOpen(false)}
              >
                <li>
                  <Link href="/home">
                    <button className="header-link header-link__bottom">
                      HOME
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/reqruit">
                    <button className="header-link header-link__bottom">
                      REQRUIT
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/setting">
                    <button className="header-link header-link__bottom">
                      SETTING
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/user">
                    <button className="header-link header-link__bottom">
                      USER
                    </button>
                  </Link>
                </li>
                <li>
                  <button
                    className="header-link"
                    onClick={() => auth.signOut()}
                  >
                    SIGNOUT
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};

export default Layout;
