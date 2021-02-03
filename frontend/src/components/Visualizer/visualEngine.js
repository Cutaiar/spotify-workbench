/**
 * Gets an canvas animation loop that is audio reactive to the microphone
 * Call request animation frame on the function returned.
 *
 * Requires an html canvas object and a react Red to the animation frame
 *
 * Thanks to: https://codesandbox.io/s/bold-pond-fqq22?file=/index.html for inspiration
 */
export const getAnimationLoop = async (canvas, requestRef, options) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: devices[1].deviceId, // Microphone on my macbook
    },
  });
  const ctx = canvas.getContext("2d");
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = context.createAnalyser();
  const source = context.createMediaStreamSource(stream);
  source.connect(analyser);

  let freqs = new Uint8Array(analyser.frequencyBinCount);

  return function draw() {
    let radius = 30;
    let bars = 100;

    // Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
    analyser.getByteFrequencyData(freqs);

    // Draw bars
    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      let bar_height = freqs[i] * options?.factor ?? 0.5;

      let x = canvas.width / 2 + Math.cos(radians * i) * radius;
      let y = canvas.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
      let y_end =
        canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
      let color = "rgb(" + 160 + ", " + 168 + ", " + (218 - freqs[i]) + ")";
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x_end, y_end);
      ctx.stroke();
    }

    requestRef.current = requestAnimationFrame(draw);
  };
};
