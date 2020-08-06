const express = require('express');
const router = express.Router();
const authorizationController = require("../controllers/authorization");

const isAuth = require("../middlewhare/isAuth");

router.post("/singIn", authorizationController.singIn);
router.post("/singUp", authorizationController.singUp);
router.get("/check", isAuth, authorizationController.check);

module.exports = router;