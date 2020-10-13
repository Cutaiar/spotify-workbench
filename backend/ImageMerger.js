import mergeImages from "merge-images";
import canvas from "canvas";
const { Canvas, Image } = canvas;

const MergeTask = () => {
  //   mergeImages(
  //     ["./images/body.png", "./images/eyes.png", "./images/mouth.png"],
  mergeImages(["../frontend/images/cover.jpeg"], {
    Canvas: Canvas,
    Image: Image,
  }).then((b64) => {
    //console.log(b64);
    console.log("done mergin'");
  });
};

const ImageURLSToWallpaper = async (imageUrls) => {
  let dim = 64; // TODO base dimension off of actual from spotify
  console.log(`Recieved ${imageUrls.length} images...`);
  console.log(`Assuming a dimension of ${dim}x${dim} for each...`);
  console.log("Stitching image...");
  let widthInImages = imageUrls.length / 20;
  let widthInPixels = widthInImages * dim;
  const b64 = await mergeImages(
    imageUrls.map((image, i) => {
      return {
        src: image,
        x: (i % widthInImages) * dim,
        y: Math.floor(i / widthInImages) * dim,
      };
    }, this),
    {
      width: widthInPixels,
      height: widthInPixels,
      Canvas: Canvas,
      Image: Image,
    }
  );
  console.log("Finished Stitching");
  return b64;
};

export { MergeTask, ImageURLSToWallpaper };
