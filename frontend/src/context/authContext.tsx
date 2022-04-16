import * as React from "react";

// Types and default state
interface ITokens {
  spotify?: string;
  strava?: string;
}
interface IAuthState {
  tokens: ITokens;
}

type SetTokenOptions = {
  cache: boolean;
};

const defaultSetTokenOptions: SetTokenOptions = {
  cache: true,
};

type IAuthContextProviderValue = [
  authState: IAuthState,
  setToken: (
    name: keyof ITokens,
    token: string,
    setTokenOptions?: SetTokenOptions
  ) => void,
  logout: (name: keyof ITokens, forget?: boolean) => void
];

const tokenCacheKeys: Record<keyof ITokens, string> = {
  spotify: "spotify-token",
  strava: "strava-token",
};

// Default state is based on the cache (could these be expired? If so, refresh?)
const generateDefaultState = (): IAuthState => {
  const spotifyToken = window.localStorage.getItem(tokenCacheKeys["spotify"]);
  const stravaToken = window.localStorage.getItem(tokenCacheKeys["strava"]);
  return {
    tokens: {
      spotify: spotifyToken ?? undefined,
      strava: stravaToken ?? undefined,
    },
  };
};

const defaultContextValue: IAuthContextProviderValue = [
  { tokens: {} },
  (name: keyof ITokens, token: string, options?: SetTokenOptions) => {},
  (name: keyof ITokens) => {},
];
// The actual context (//todo do we need a type for this?)
const AuthContext =
  React.createContext<IAuthContextProviderValue>(defaultContextValue);

/**
 * Wrap any auth consuming components in a provider
 */
export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = React.useState<IAuthState>(
    generateDefaultState()
  );
  const setToken = (
    name: keyof ITokens,
    token: string,
    options?: SetTokenOptions
  ) => {
    setAuthState({
      ...authState,
      tokens: { ...authState.tokens, [name]: token },
    });

    // Todo allow exclusion of just single options. But there's only 1 rn
    (options ?? defaultSetTokenOptions).cache &&
      window.localStorage.setItem(tokenCacheKeys[name], token); //set local storage to remember token thru refresh
  };

  const logout = (name: keyof ITokens, forget?: boolean) => {
    setAuthState({
      ...authState,
      tokens: { ...authState.tokens, [name]: undefined },
    });
    (forget ?? true) && window.localStorage.removeItem(tokenCacheKeys[name]);
  };

  return (
    <AuthContext.Provider value={[authState, setToken, logout]}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Use this hook inside components which are interested in auth state
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth can only be used inside AuthProvider");
  }
  return context;
};
