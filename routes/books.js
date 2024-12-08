const express = require("express");
const router = express.Router();


const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
router.get("/", async (req, res) => {
  console.log("GET /books route hit");
//router.get("/books", async (req, res) => {
  const books =  await prisma.libro.findMany({
    select: {
      ISBN: true,
      Titulo: true,
      Precio: true,
    },
  });
  console.log("Books fetched successfully:", books);
  res.json({
    message: "Books fetched successfully",
    books: books,
  });
  //res.json(books); // Send the data as a JSON response
});

// Test route for "/books/test"
router.get("/test", (req, res) => {
  res.send("Books test route is working!");
});


module.exports = router;
