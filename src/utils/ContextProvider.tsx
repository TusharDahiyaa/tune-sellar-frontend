import React, { createContext, useContext, useReducer } from "react";

interface StateProviderProps {
  initialState: any;
  reducer: React.Reducer<any, any>;
  children: React.ReactNode;
}

export const StateContext = createContext<any>(null);

export const useStateValue = () => useContext(StateContext);

export const ContextProvider: React.FC<StateProviderProps> = ({
  initialState,
  reducer,
  children,
}: StateProviderProps) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useContextValue = () => useContext(StateContext);
