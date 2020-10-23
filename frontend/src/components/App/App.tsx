import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { Button } from "primereact/button";
import { RunPlaylist } from "../RunPlaylist/RunPlaylist";
import { GenerateWallpaper } from "../GenerateWallpaper/GenerateWallpaper";
import hash from "../../common/hash";
import SpotifyWebApi from "spotify-web-api-js";
import {
  authEndpoint,
  clientId,
  redirectUri,
  scopes,
} from "../../common/config";

const connectToSpotifyLink = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

const Home = () => {
  return (
    <>
      <h2 style={{ color: "white" }}>Spotify Workbench</h2>{" "}
      <p style={{ color: "white" }}>Welcome to your Spotify workbench</p>
    </>
  );
};

export interface ISpotifyUser {
  profileImage?: string;
  token: string;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

const App: React.FC = (props) => {
  const [spotifyUser, setSpotifyUser] = React.useState<ISpotifyUser>(undefined);

  const WallpaperRoute = () => {
    return <GenerateWallpaper spotifyUser={spotifyUser} />;
  };

  const RunPlaylistRoute = () => {
    return <RunPlaylist spotifyUser={spotifyUser} />;
  };

  React.useEffect(() => {
    // Set token
    let _token = (hash as any).access_token;
    if (_token) {
      const user: ISpotifyUser = {
        profileImage: undefined,
        token: _token,
        spotifyApi: new SpotifyWebApi(),
      };
      user.spotifyApi.setAccessToken(_token);
      setSpotifyUser(user);
    }
  }, []);

  return (
    <Router>
      <nav>
        <NavLink className="navlink-style" to="/">
          <Button style={{ textDecoration: "none" }}>Home</Button>
        </NavLink>
        <NavLink className="navlink-style" to="/wallpaper">
          <Button>wallpaper</Button>
        </NavLink>
        <NavLink className="navlink-style" to="/runplaylist">
          <Button>run playlist</Button>
        </NavLink>
      </nav>

      <Button
        onClick={() => {
          window.location.href = connectToSpotifyLink;
        }}
        icon={spotifyUser?.token ? "pi pi-check" : "pi pi-sign-in"}
        label={spotifyUser?.token ? "Token acquired" : "Connect To Spotify"}
        className={`p-button-${spotifyUser?.token ? "success" : "info"}`}
      ></Button>

      <Switch>
        <Route path="/wallpaper">
          <WallpaperRoute />
        </Route>
        <Route path="/runplaylist">
          <RunPlaylistRoute />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};
export { App };
