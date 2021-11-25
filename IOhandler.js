/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");
  createReadStream = require('fs').createReadStream
  readdir = require("fs/promises").readdir

const zipFile = "myfile.zip"
const unzipFolder = "unzipped"
const finalFolder = "grayscaled" 

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  return createReadStream(pathIn).pipe(unzipper.Extract({ path: pathOut }))
  .promise()
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async (dir) => {
  try {
    const files = await readdir(dir);
    return files
  } catch (err) {
    console.error(err);
  }
}; // ["unzipped/in1.png", "unzipped/in2.png"]



/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const grayScale = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
  .pipe(
    new PNG()
  )
  .on("parsed", function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
 
        // invert color
        let totalData = this.data[idx] + this.data[idx + 1] + this.data[idx + 2];
        this.data[idx] = totalData / 3; // R
        this.data[idx + 1] = totalData / 3; // G
        this.data[idx + 2] = totalData / 3; // B
 
        // and reduce opacity
        //this.data[idx + 3] = this.data[idx + 3] >> 1; // A
      }
    }
 
    this.pack().pipe(fs.createWriteStream(pathOut));
  });
};

// unzip(zipFile, unzipFolder)
//   .then(() => console.log("Extraction operation complete"))
//   .then(() => readDir(unzipFolder))
//   .then((fileArray) => {
//     console.log(fileArray)
//     for (const file of fileArray) {
//       const extension = path.extname(file)
//       if (extension == ".png") {
//         grayScale(`${unzipFolder}/${file}`, `${finalFolder}/${file}`)
//       }
//     }
//   })
//   .catch((err) => console.log(err))

module.exports = {
  unzip,
  readDir,
  grayScale,
};
