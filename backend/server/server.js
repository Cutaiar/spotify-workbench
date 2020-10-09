import express from "express";
import { ImageURLSToWallpaper } from "../ImageMerger.js";

const app = express();
const port = 3001;

// Allow cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// body will be automatically parsed into JSON objects
app.use(express.json());

// We cant use GET because we need the data in the body
// Tell the user this
app.get("/", (req, res) => {
  console.log("Got a GET at /. Serving message back.");
  res.send("Use a POST with a JSON list of URIs in the body!");
});

// Accept a post request, get the body, do the stitching, send the wallpaper in res
app.post("/", async (req, res) => {
  console.log("Got a POST at /. Kicking off wallpaper task");

  const URIs = req.body;

  // Stitch the images together
  const wallpaper = await ImageURLSToWallpaper(req.body);

  // send the finished image back in res
  console.log("Sending response back to client...");
  res.send(wallpaper);
  console.log("Sent.");
});

// start the server
app.listen(port, () => {
  console.log(`wp-serive istening at http://localhost:${port}`);
});
