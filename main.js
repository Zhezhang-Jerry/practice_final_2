/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

const path = require("path")

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => console.log("Extraction operation complete"))
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((fileArray) => {
    console.log(fileArray);
    for (const file of fileArray) {
      const extension = path.extname(file);
      if (extension == ".png") {
        IOhandler.grayScale(`${pathUnzipped}/${file}`, `${pathProcessed}/${file}`)
      }
    }
  })
  .catch((err) => console.log(err))


