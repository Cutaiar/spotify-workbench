import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

export interface IExperimentsProps {}

interface Item {
  id: string;
  content: string;
}
// fake data generator
const getItems = (count: number): Item[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: String(k),
    content: String(k),
  }));

const reorder = (list: any, startIndex: number, endIndex: number): Item[] => {
  const result = Array.from<Item>(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250,
});

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 16,
  margin: `0 0 ${8}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

// Adapted from https://codesandbox.io/s/k260nyxq9v?file=/index.js:2376-2388
export const Experiments: React.FC<IExperimentsProps> = (props) => {
  const [items, setItems] = useState<Item[]>(getItems(5));

  const onDragEnd = (result: any) => {
    if (result.destination) {
      setItems(reorder(items, result.source.index, result.destination.index));
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div style={{ width: 1000 }}>
        <p
          style={{
            padding: "50px",
            color: "#4E565C",
            fontSize: 25,
          }}
        >
          sw experiments.
        </p>
        <div
          style={{
            padding: "0px 50px 50px 50px",
            color: "#5E565C",
            fontSize: 25,
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <p
            style={{
              padding: "10px 10px 10px 10px",
              fontSize: 15,
              color: "lightgrey",
              whiteSpace: "pre-wrap",
            }}
          >
            {"items: " + JSON.stringify(items, undefined, 2)}
          </p>
        </div>
        );
      </div>
    </div>
  );
};
