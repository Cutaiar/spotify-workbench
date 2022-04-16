import React from "react";

import SpotifyWebApi from "spotify-web-api-js";

export interface ISpotifyUser {
  userObject?: SpotifyApi.CurrentUsersProfileResponse;
  token: string;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

type ISpotifyUserContextProviderValue = {
  spotifyUser?: ISpotifyUser;
  setSpotifyUser: (user?: ISpotifyUser) => void;
};

const SpotifyUserContext =
  React.createContext<ISpotifyUserContextProviderValue>({
    setSpotifyUser: () => {},
  });

/**
 * Wrap any spotify user consuming components in a provider
 */
export const SpotifyUserProvider: React.FC = ({ children }) => {
  const [spotifyUser, setSpotifyUser] = React.useState<ISpotifyUser>();

  return (
    <SpotifyUserContext.Provider value={{ spotifyUser, setSpotifyUser }}>
      {children}
    </SpotifyUserContext.Provider>
  );
};

/**
 * Use this hook inside components which are interested in a spotify user
 */
export const useSpotifyUser = () => {
  const context = React.useContext(SpotifyUserContext);
  if (context === undefined) {
    throw new Error("useAuth can only be used inside AuthProvider");
  }
  return context;
};
