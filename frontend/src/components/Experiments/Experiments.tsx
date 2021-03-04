import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

export interface IExperimentsProps {}

export const Experiments: React.FC<IExperimentsProps> = (props) => {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ width: 1000 }}>
        <p
          style={{
            paddingLeft: "50px",
            paddingTop: "50px",
            color: "#4E565C",
            fontSize: 25,
          }}
        >
          sw experiments.
        </p>
      </div>
    </div>
  );
};
