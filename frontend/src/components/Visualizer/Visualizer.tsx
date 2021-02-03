import * as React from "react";
import { getAnimationLoop } from "./visualEngine.js";

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
      const loop = await getAnimationLoop(canvasRef.current, requestRef, {
        factor: 0.1,
      });
      requestRef.current = requestAnimationFrame(loop);
    })();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
};
