import React from "react";
const UnitContext = React.createContext({
  unit: {
    value: "km",
    updateUnit: () => {},
}});

export default UnitContext;
