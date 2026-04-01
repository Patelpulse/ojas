const ImageKit = require("@imagekit/nodejs");

console.log("ImageKit require keys:", Object.keys(ImageKit));
const ImageKitClass = ImageKit.default || ImageKit;
console.log("ImageKitClass type:", typeof ImageKitClass);

const imagekit = new ImageKitClass({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || "").trim(),
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || "").trim(),
  urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT || "").trim(),
});

console.log("ImageKit instance keys:", Object.keys(imagekit));
// Check if upload exists in prototype
console.log("Has upload function:", typeof imagekit.upload === 'function');

module.exports = imagekit;


