import * as React from "react";
import { canvasAnimationLoop } from "./canvasVisualizer.js";

const containerStyle = (width: number, height: number): React.CSSProperties => {
  return {
    display: "inline-block",
    width: width,
    height: height,
    margin: "0 auto",
    background: "black",
    position: "relative",
  };
};

const canvasStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const imageStyle = (height: number): React.CSSProperties => {
  const scale = 1 / 1.5;
  return {
    position: "absolute",
    zIndex: 2,
    width: height * scale,
    height: height * scale,
  };
};

interface IVisualizerProps {
  width: number;
  height: number;
}

export const Visualizer: React.FC<IVisualizerProps> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestRef = React.useRef<number>(null);

  // Get the canvas animation from the visual engine and kick it off
  // Thanks to https://css-tricks.com/using-requestanimationframe-with-react-hooks/
  React.useEffect(() => {
    (async () => {
      const loop = await canvasAnimationLoop(canvasRef.current, requestRef);
      requestRef.current = requestAnimationFrame(loop);
    })();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={containerStyle(props.width, props.height)}
    >
      <img
        style={imageStyle(props.height)}
        alt={""}
        src="/spotify-workbench-icon.png"
      />
      <canvas
        style={canvasStyle}
        ref={canvasRef}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
};
