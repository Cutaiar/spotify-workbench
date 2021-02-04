import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { Button } from "primereact/button";
import { Home } from "../Home/Home";
import { RunPlaylist } from "../RunPlaylist/RunPlaylist";
import { GenerateWallpaper } from "../GenerateWallpaper/GenerateWallpaper";
import hash from "../../common/hash";
import SpotifyWebApi from "spotify-web-api-js";
import { authEndpoint, clientId, scopes } from "../../common/config";
import { Visualizer } from "../Visualizer/Visualizer";

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

  const HomeRoute = () => {
    return <Home />;
  };

  const WallpaperRoute = () => {
    return <GenerateWallpaper spotifyUser={spotifyUser} />;
  };

  const RunPlaylistRoute = () => {
    return <RunPlaylist spotifyUser={spotifyUser} />;
  };

  React.useEffect(() => {
    // Set token
    const func = async () => {
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
        await user.spotifyApi.getMe(
          undefined,
          (
            error: SpotifyWebApi.ErrorObject,
            value: SpotifyApi.CurrentUsersProfileResponse
          ) => {
            if (error) {
              console.error("Issue fetching user object from spotify api.");
              return;
            }
            // Got a user object back
            const userWithUserObject = { ...user, userObject: value };
            setSpotifyUser(userWithUserObject);
            console.log("Set spotify user object");
            return;
          }
        );
      }
    };
    func();
  }, []);

  const getNavigation = () => {
    return (
      <nav className="p-pl-3">
        <NavLink className="navlink-style p-p-1" to="/">
          <Button className={"p-button-secondary"}>Home</Button>
        </NavLink>
        <NavLink className="navlink-style p-p-1" to="/wallpaper">
          <Button className={"p-button-secondary"}>wallpaper</Button>
        </NavLink>
        <NavLink className="navlink-style p-p-1" to="/runplaylist">
          <Button className={"p-button-secondary"}>run playlist</Button>
        </NavLink>
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
        <img
          alt={""}
          src="/spotify-workbench-icon.png"
          style={{ width: 60, height: 60 }}
          className="p-m-3"
        />
        <h1 className="p-text-nowrap p-text-truncate">Spotify Workbench</h1>

        {getNavigation()}
        <Visualizer width={200} height={200} />

        <Button
          onClick={() => {
            window.location.href = connectToSpotifyLink;
          }}
          icon={spotifyUser?.token ? "pi pi-check" : "pi pi-sign-in"}
          label={spotifyUser?.token ? "Token acquired" : "Connect To Spotify"}
          className={`p-ml-auto p-button-rounded p-button-${
            spotifyUser?.token ? "success" : "help"
          }`}
        ></Button>
        <p>{JSON.stringify(spotifyUser?.userObject)}</p>
      </div>
    );
  };

  return (
    <Router>
      {getNavbar()}
      <Switch>
        <Route path="/wallpaper">
          <WallpaperRoute />
        </Route>
        <Route path="/runplaylist">
          <RunPlaylistRoute />
        </Route>
        <Route path="/">
          <HomeRoute />
        </Route>
      </Switch>
    </Router>
  );
};
export { App };
