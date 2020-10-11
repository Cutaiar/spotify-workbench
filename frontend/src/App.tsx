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

// import { Button } from "primereact/button";
import { Button } from '@material-ui/core';

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
              <Button  style={{ textDecoration: "none", borderRadius:"2px",
                backgroundColor: "#39CCCC",
                fontSize: "10px",marginRight:"2px"
              }}>Home</Button>
            </NavLink>
            <NavLink className="navlink-style" to="/wallpaper">
              <Button style={{ textDecoration: "none", borderRadius:"2px",
                backgroundColor: "#0074D9",
                fontSize: "10px",marginRight:"2px",
              }}>wallpaper</Button>
            </NavLink>
            <NavLink className="navlink-style" to="/runplaylist">
              <Button style={{ textDecoration: "none", borderRadius:"2px",
                backgroundColor: "#7FDBFF",
                fontSize: "10px",marginRight:"2px",
              }}>run playlist</Button>
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
