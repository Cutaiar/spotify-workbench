import React from "react";

import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import hash from "../../common/hash";
import { authEndpoint, clientId, scopes } from "../../common/config";
import SpotifyWebApi from "spotify-web-api-js";

import { Button } from "primereact/button";

import { Home } from "../Home/Home";
import { RunPlaylist } from "../RunPlaylist/RunPlaylist";
import { GenerateWallpaper } from "../GenerateWallpaper/GenerateWallpaper";
import { ThreeEngine } from "../ThreeEngine/ThreeEngine";
import { Visualizer } from "../Visualizer/Visualizer";
import { Experiments } from "../Experiments/Experiments";

// TODO use window location instead
const redirectUri = window.location.href; // TODO Fix not working from non home authorizations in local testing
const connectToSpotifyLink = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export interface ISpotifyUser {
  userObject?: SpotifyApi.CurrentUsersProfileResponse;
  token: string;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

const App: React.FC = (props) => {
  const [spotifyUser, setSpotifyUser] = React.useState<ISpotifyUser>(undefined);

  interface IRoute {
    name: string;
    displayName: string;
    content: JSX.Element;
  }
  const routes: IRoute[] = [
    { name: "home", displayName: "Home", content: <Home /> },
    {
      name: "wallpaper",
      displayName: "Wallpaper",
      content: <GenerateWallpaper spotifyUser={spotifyUser} />,
    },
    {
      name: "runplaylist",
      displayName: "Running Playlists",
      content: <RunPlaylist spotifyUser={spotifyUser} />,
    },
    {
      name: "spotiverse",
      displayName: "Spotiverse",
      content: <ThreeEngine />,
    },
    {
      name: "experiments",
      displayName: "Experiments",
      content: <Experiments />,
    },
  ];

  React.useEffect(() => {
    // Set token
    let _token = (hash as any).access_token;
    if (_token) {
      const user: ISpotifyUser = {
        userObject: undefined,
        token: _token,
        spotifyApi: new SpotifyWebApi(),
      };
      user.spotifyApi.setAccessToken(_token);
      setSpotifyUser(user);

      // kickoff me request
      (async () => {
        try {
          const value = await user.spotifyApi.getMe();
          const userWithUserObject = { ...user, userObject: value };
          setSpotifyUser(userWithUserObject);
          console.log("Set spotify user object");
          return;
        } catch (error) {
          console.error("Issue fetching user object from spotify api. ", error);
          return;
        }
      })();
    }
  }, []);

  const getNavigation = () => {
    return (
      <nav className="p-pl-3">
        {routes.map((r, i) => {
          return (
            <NavLink key={i} className="navlink-style p-p-1" to={`/${r.name}`}>
              <Button className={"p-button-info"}>{r.displayName}</Button>
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
        style={{ width: "100%", height: "100px" }}
      >
        <div className="p-m-3">
          <Visualizer width={90} height={90} />
        </div>
        <h1 className="p-text-nowrap p-text-truncate">Spotify Workbench</h1>

        {getNavigation()}

        {spotifyUser?.userObject && (
          <div
            className="p-d-flex p-ai-center p-ml-auto"
            style={{
              background: "#191919",
              borderRadius: 8,
              position: "relative",
            }}
          >
            <img
              alt=""
              src={spotifyUser.userObject.images[0].url}
              width={50}
              height={50}
              style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
            ></img>
            <p
              style={{
                fontSize: 12,
                color: "#dcdfe1",
                overflow: "hidden",
                whiteSpace: "nowrap",
                paddingLeft: 14,
                paddingRight: 30,
              }}
            >
              {spotifyUser.userObject.display_name}
            </p>
            <img
              alt=""
              src={"/Spotify_Icon_RGB_Green.png"}
              width={14}
              height={14}
              style={{ position: "absolute", top: "5px", right: "5px" }}
            ></img>
          </div>
        )}
        {!spotifyUser?.userObject && (
          <Button
            onClick={() => {
              window.location.href = connectToSpotifyLink;
            }}
            label={"Connect to spotify"}
            style={{
              display: "flex",
              flexFlow: "row-reverse",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={`p-ml-auto p-button-rounded p-button-success`}
          >
            <div
              style={{
                paddingRight: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                alt=""
                src={"/Spotify_Icon_RGB_Black.png"}
                width={20}
                height={20}
              ></img>
            </div>
          </Button>
        )}
      </div>
    );
  };

  return (
    <Router>
      {getNavbar()}
      <Switch>
        {routes.map((r, i) => {
          return <Route path={`/${r.name}`}>{r.content}</Route>;
        })}
      </Switch>
    </Router>
  );
};
export { App };
