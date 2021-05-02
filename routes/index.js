const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/index", { pageTitle: "Index", template: "index" });
});

module.exports = router;
