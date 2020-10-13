import * as React from "react";
import { Component } from "react";
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

const Home = () => {
  return (
    <>
      <h2 style={{ color: "white" }}>Spotify Workbench</h2>{" "}
      <p style={{ color: "white" }}>Welcome to your Spotify workbench</p>
    </>
  );
};

const WallpaperRoute = () => {
  return <GenerateWallpaper />;
};

const RunPlaylistRoute = () => {
  return <RunPlaylist />;
};

class App extends Component<any, any> {
  render() {
    return (
      <Router>
        <div>
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
        </div>
      </Router>
    );
  }
}
export { App };
