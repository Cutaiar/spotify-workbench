import React from "react";

import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";

import { Button } from "primereact/button";

import { Home } from "../Home/Home";
import { RunPlaylist } from "../RunPlaylist/RunPlaylist";
import { GenerateWallpaper } from "../GenerateWallpaper/GenerateWallpaper";
import { Visualizer } from "../Visualizer/Visualizer";
import { ChartPage } from "../ChartPage/ChartPage";
import { Spotiverse } from "../Spotiverse/Spotiverse";

import { Experiments } from "../Experiments/Experiments";
import { PinNavButton } from "../Experiments/PinNavButton";
import { StravaPage } from "../Strava/StravaPage";
import { AuthProvider } from "../../context/authContext";

import { StravaRedirect } from "../Strava/StravaRedirect";
import { AccountBadge } from "../AccountBadge";
import {
  ConnectButton,
  ISpotifyUser,
} from "../SpotifyConnectButton/SpotifyConnectButton";

const App: React.FC = (props) => {
  const [spotifyUser, setSpotifyUser] = React.useState<ISpotifyUser>(undefined);

  interface IRoute {
    name: string;
    displayName: string;
    content: JSX.Element;
  }
  const routes: IRoute[] = [
    {
      name: "home",
      displayName: "Home",
      content: <Home />,
    },
    {
      name: "spotiverse",
      displayName: "Spotiverse",
      content: <Spotiverse />,
    },
    {
      name: "wallpaper",
      displayName: "Wallpaper",
      content: <GenerateWallpaper />,
    },
    {
      name: "runplaylist",
      displayName: "Running Playlists",
      content: <RunPlaylist spotifyUser={spotifyUser} />,
    },
    {
      name: "chart",
      displayName: "Chart",
      content: <ChartPage />,
    },
    {
      name: "experiments",
      displayName: "Experiments",
      content: <Experiments />,
    },
    {
      name: "strava",
      displayName: "Strava",
      content: <StravaPage />,
    },
  ];

  const logout = () => {
    window.localStorage.removeItem("user_token");
    const user: ISpotifyUser = {
      userObject: undefined,
      token: undefined,
      spotifyApi: undefined,
    };
    setSpotifyUser(user);
  };

  const configureScroll = (str) => {
    if (str === "spotiverse") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const getNavigation = () => {
    return (
      <nav className="p-pl-3">
        {routes.map((r, i) => {
          return r.name === "experiments" ? (
            <PinNavButton pin={"BOOL"} to={r.name}>
              {r.displayName}
            </PinNavButton>
          ) : (
            <NavLink key={i} className="navlink-style p-p-1" to={`/${r.name}`}>
              <Button
                onClick={() => configureScroll(r.name)}
                className={"p-button-info"}
              >
                {r.displayName}
              </Button>
            </NavLink>
          );
        })}
      </nav>
    );
  };
  const getNavbar = () => {
    return (
      <div
        className={
          " navbar-style p-d-flex p-flex-row p-jc-start p-ai-center p-p-3"
        }
        style={{ width: "100%", height: "8%" }}
      >
        <div className="p-m-3">
          <Visualizer width={90} height={90} />
        </div>
        <h1 className="p-text-nowrap p-text-truncate">Spotify Workbench</h1>

        {getNavigation()}

        {spotifyUser?.userObject && (
          <AccountBadge
            imageUrl={spotifyUser.userObject.images[0].url}
            name={spotifyUser.userObject.display_name}
            onClickLogout={logout}
            accountType="spotify"
          />
        )}
        {!spotifyUser?.userObject && (
          <ConnectButton
            onConnect={(user) => {
              setSpotifyUser(user);
            }}
          />
        )}
      </div>
    );
  };
  return (
    <AuthProvider>
      <Router>
        {getNavbar()}
        <Switch>
          {routes.map((r, i) => {
            return <Route path={`/${r.name}`}>{r.content}</Route>;
          })}
          <Route path="/redirect">
            <StravaRedirect redirectPageName="strava" />
          </Route>

          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};
export { App };
