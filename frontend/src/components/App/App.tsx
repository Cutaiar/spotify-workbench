import React from "react";

import "./App.css";

import { AuthProvider } from "../../context/authContext";
import { SpotifyUserProvider } from "../../context/spotifyUserContext";

import { Header } from "../Header/Header";

const App: React.FC = (props) => {
  return (
    <AuthProvider>
      <SpotifyUserProvider>
        <Header />
      </SpotifyUserProvider>
    </AuthProvider>
  );
};
export { App };
