const fs = require("fs");
const router = require("express").Router();
const path = require("path");


function checkFileExistsSync(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

router.post('/invoices', async (req, res) => {
  const body = req.body;
  const filePath = path.resolve(__dirname, process.env.FILE_PATH || "../db/invoices.csv");

  try {
    console.log({ body }, checkFileExistsSync(filePath))
    if (!body.length) {
      res.status(400).send({
        success: false,
        message: "Data passed should be an array"
      });
      return
    }

    // Extract directory path from the file path
    const directoryPath = path.dirname(filePath);

    // Check if the directory exists, if not, create it
    fs.mkdirSync(directoryPath, { recursive: true });

    // Check if the file path exists, if not, create the file
    fs.access(filePath, fs.constants.F_OK, err => {
      if (err) {
        fs.open(filePath, "w", (err, file) => {
          if (err) {
            throw err;
          }
          console.log("File was created: ", { file, filePath });
          // todo add the header
        });
      } else {
        console.log("File exists");
      }
    });

    for (let { productName, quantity, price } of body) {
      const amount = quantity * price;
      // Append the invoice details to the file
      const newLine = `${productName},${quantity},${price},${amount}\n`;
      fs.appendFile(filePath, newLine, err => {
        if (err) {
          throw err;
        }
        console.log("invoice data was appended: ", newLine);
      });
    }

    res.status(201).send({
      success: true,
      message: "Invoice added successfully"
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
});

router.post("/invoices/export", (req, res) => {
  // send to the email
  try {
    const { email } = req.body;
    console.log({ email })
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email not provided"
      })
    }

    // send email;

    return res.status(200).send({
      success: true,
      message: `Invoices exported to ${email} successfully`
    })
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
});


module.exports = router;