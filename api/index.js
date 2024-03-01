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
  const { productName, quantity, price } = req.body;
  const amount = quantity * price; // Calculate the amount

  const filePath = path.resolve(__dirname, process.env.FILE_PATH || "../db/invoices.csv");

  try {
    // Check if the file path exists, if not, create the directory
    if (!checkFileExistsSync(filePath)) {
      fs.open(filePath, "w", (err, file) => {
        if (err) {
          throw err
        }
        console.log("File was created: ", { file, filePath })
        // todo add the header
      })
    }

    // Append the invoice details to the file
    const newLine = `${productName},${quantity},${price},${amount}\n`
    fs.appendFileSync(filePath, newLine, err => {
      if (err) {
        throw err
      }
      console.log("File data was appended: ", newLine)
    });

    res.status(200).send({
      success: true,
      message: "Invoice added successfully"
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
});

router.post("/invoices/export", (req, res) => {
  // send to the email
  const { email } = req.body;
  // send email;
});


module.exports = router;