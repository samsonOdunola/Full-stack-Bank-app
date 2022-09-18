const {
  testApi,
  registerUser,
  loginUser,
  getCurrentUserInfo,
  getTransferDetails,
  postTransaction,
} = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
router.get("/", testApi);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/getcurrentuser", getCurrentUserInfo);
router.post("/gettransferdetails", getTransferDetails);
router.post("/posttransaction", postTransaction);

module.exports = router;
