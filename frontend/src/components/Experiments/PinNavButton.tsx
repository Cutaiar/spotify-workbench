import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import PinInput from "react-pin-input";
import { useHistory } from "react-router-dom";

export interface IPinNavButtonProps {
  pin: string;
  to: string;
}
export const PinNavButton: React.FC<IPinNavButtonProps> = (props) => {
  const { pin, to } = props;
  const [started, setStarted] = useState<boolean>(false);
  const [passed, setPassed] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const pinRef = useRef(null);
  const history = useHistory();

  return (
    <Button
      className={"p-button-info"}
      onClick={() => {
        if (!started && !passed) {
          setStarted(true);
        }
        if (started && !passed) {
          pinRef.current?.clear();
          pinRef.current?.focus();
        }
      }}
    >
      {started && !passed && (
        <PinInput
          ref={pinRef}
          length={4}
          focus
          type="custom"
          onChange={(value, i) => setIndex(i)}
          onComplete={(value, index) => {
            if (value === pin) {
              console.log("you're in");
              setPassed(true);
              // TODO unlock animation then
              history.push(`/${to}`);
              setStarted(false);
              setPassed(false);
            }
          }}
        />
      )}
      {(!started || passed) && props.children}
    </Button>
  );
};
