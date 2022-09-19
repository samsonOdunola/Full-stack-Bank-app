const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary");
const { updateOne } = require("../models/user.model");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const JWT_SECRET = process.env.JWT_SECRET;

const testApi = (req, res) => {
  res.send([
    { firstName: "Adejola", lastName: "Odunola" },
    { firstName: "Oyinkansola", lastName: "Abifarin" },
  ]);
};
const registerUser = (req, res) => {
  let myImage = req.body.image;
  cloudinary.v2.uploader.upload(myImage, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ message: "Error in creating Account", status: false });
    } else {
      let form = new userModel({ ...req.body, image: result.secure_url });
      form.save((err) => {
        if (err) {
          res.send({ message: "An Error occured", status: false });
        } else {
          res.send({ message: "Account Created Succesfully", status: true });
        }
      });
    }
  });
};

const loginUser = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { password, email } = req.body;
  userModel.findOne(
    {
      email: email,
    },
    (err, result) => {
      console.log(err, result);
      if (!result) {
        res.send({ message: "Email does not exist", status: false });
      } else if (result) {
        result.validatePassword(password, (err, same) => {
          if (err) {
            res.send({ message: "Server Error", staus: false });
          } else if (same) {
            let token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
            res.send({
              message: "Login Successfull",
              status: true,
              result,
              token,
            });
          } else {
            res.send({ message: "Incorrect Password", status: false });
          }
        });
      }
    }
  );
};

const getCurrentUserInfo = (req, res) => {
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, result) => {
    if (err) {
      res.send({ status: false });
    } else {
      userModel.findOne({ email: result.email }, (err, result) => {
        if (err) {
          res.send({ status: false });
        } else {
          res.send({ result, status: true });
        }
      });
    }
  });
};
const getTransferDetails = (req, res) => {
  userModel.findOne({ Accountnum: req.body.num }, (err, result) => {
    if (!result) {
      res.send({ response: "User Not Found", status: false });
    } else {
      res.send({ response: result, status: true });
    }
  });
};
const postTransaction = (req, res) => {
  let newActiveUserBalance = req.body.activeUser.AccountBalance;
  let newAccountToCreditBalance = req.body.accountToCredit.AccountBalance;

  userModel.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: req.body.activeUser._id },
          update: {
            $set: { AccountBalance: newActiveUserBalance },
            $push: {
              recentTransaction: req.body.activeUser.recentTransaction[0],
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: req.body.accountToCredit._id },
          update: {
            $set: { AccountBalance: newAccountToCreditBalance },
            $push: {
              recentTransaction: req.body.accountToCredit.recentTransaction[0],
            },
          },
        },
      },
    ],
    (err, result) => {
      if (result) {
        res.send({ status: true, message: "Transaction Succesfull" });
      } else {
        res.send({ status: false, message: "Transacion failure" });
      }
    }
  );
};
// const validateToken = (req, res) => {
//   let token = req.headers.authorization.split(" ")[1];
//   jwt.verify(token, JWT_SECRET, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//       userModel.findOne({ email: result.email }, (err, result) => {
//         console.log(result);
//         res.send({ result, status: true });
//       });
//     }
//   });
// };
module.exports = {
  testApi,
  registerUser,
  loginUser,
  getCurrentUserInfo,
  getTransferDetails,
  postTransaction,
};
