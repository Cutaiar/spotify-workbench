import React from "react";

export interface IAppState {
  theme: string;
}

const defaultAppState: IAppState = {
  theme: "yeet-yellow",
};

export const AppStateContext = React.createContext(defaultAppState);

export const AppStateProvider = AppStateContext.Provider;
export const AppStateConsumer = AppStateContext.Consumer;
