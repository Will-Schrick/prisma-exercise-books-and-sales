const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ message: "Sales endpoint works!" });
});


module.exports = router;
