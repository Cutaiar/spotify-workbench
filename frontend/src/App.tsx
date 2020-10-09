import * as React from "react";
import { Component } from "react";
import "./App.css";
import GenerateWallpaper from "./GenerateWallpaper";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { RunPlaylist } from "./RunPlaylist";

const Home = () => {
  return (
    <>
      <h2 style={{color: "white"}}>Spotify Workbench</h2> <p style={{color: "white"}}>Welcome to your Spotify workbench</p>
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
            <NavLink to="/">
              <button>Home</button>
            </NavLink>
            <NavLink to="/wallpaper">
              <button>wallpaper</button>
            </NavLink>
            <NavLink to="/runplaylist">
              <button>run playlist</button>
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
export default App;
