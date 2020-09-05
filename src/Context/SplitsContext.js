import React from "react";
const SplitsContext = React.createContext({
  splits: {
    value: [],
    updateSplits: () => {},
}});

export default SplitsContext;
