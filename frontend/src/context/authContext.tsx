import * as React from "react";

// Types and default state
interface ITokens {
  spotify?: string;
  strava?: string;
}
interface IAuthState {
  tokens: ITokens;
}

type IAuthContextProviderValue = [
  authState: IAuthState,
  setToken: (name: keyof ITokens, token: string) => void
];

const defaultState: IAuthState = {
  tokens: {},
};

// The actual context (//todo do we need a type for this?)
const AuthContext = React.createContext<IAuthContextProviderValue>(undefined);

/**
 * Wrap any auth consuming components in a provider
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = React.useState<IAuthState>(defaultState);
  const setToken = (name: keyof ITokens, token: string) => {
    setAuthState({
      ...authState,
      tokens: { ...authState.tokens, [name]: token },
    });
  };

  return (
    <AuthContext.Provider value={[authState, setToken]}>
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
