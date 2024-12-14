const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//all sales
router.get("/", async (req, res) => {
    const sales =  await prisma.venta.findMany({
        select: {
            ID_Venta:true,
            ISBN:true,
            Fecha_Venta:true,
            Cantidad:true,
        },
      });
    res.json({ message: "Sales endpoint works!" ,
        sales: sales,
    });
});
    

// /sales/:id: 
router.get("/:id", async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL
    const salesID = await prisma.venta.findUnique({
      where: { ID_Venta: parseInt(id) }, // Convert string to integer
        select: {
            ID_Venta:true,
            ISBN:true,
            Fecha_Venta:true,
            Cantidad:true,
         },
    });
    res.json({ message: "Sales endpoint works!" ,
        sales: salesID,
});
});


/*
//.../sales/book/:isbn:
router.get("/book/:isbn", async (req, res) => {
    const { isbn } = req.params; // Extract the ID from the URL
    console.log(`Fetching sales for book with ISBN: ${isbn}`);  //sentence to see if works
    const salesISBN= await prisma.venta.findMany({
      where: { ISBN: isbn }, // match isbn
        select: {
            ID_Venta:true,
            ISBN:true,
            Fecha_Venta:true,
            Cantidad:true,
         },
    });
    res.json({ message: "Sales endpoint works!" ,
        sales: salesISBN,
    });
});
*/

//updated with try/catch for errors

//.../sales/book/:isbn:
router.get("/book/:isbn", async (req, res) => {
    const { isbn } = req.params; // Extract the ISBN from the URL
    console.log(`Fetching sales for book with ISBN: ${isbn}`); // Log for debugging
  
    try {
      // Query the database for sales of the book with the given ISBN
      const salesISBN = await prisma.venta.findMany({
        where: { ISBN: isbn }, // Match sales by ISBN
        select: {
          ID_Venta: true,
          ISBN: true,
          Fecha_Venta: true,
          Cantidad: true,
        },
      });
  
      // Handle case when no sales are found
      if (salesISBN.length === 0) {
        console.log("No sales found for this book."); // Debugging log
        return res.status(404).json({ error: "No sales found for this book" });
      }
  
      res.json({
        message: "Sales endpoint works!",
        sales: salesISBN,
      });
    } catch (error) {
      console.error("Error fetching sales:", error); // Log the error for debugging
      res.status(500).json({ error: "An error occurred while fetching sales" }); // Send an error response
    }
  });
  

  ///sales/date/:date: Displays all sales made on a particular date. Tip: Use new Date()to
  router.get("/date/:date", async (req, res) => {
    const { date } = req.params; // Extract the ISBN from the URL
    console.log(`Fetching sales for book with date: ${date}`); // Log for debugging
  
    try {
      // Query the database for sales of the book with the given ISBN
      const formatDate = new Date(date);  // change date to JS date format
      const salesD = await prisma.venta.findMany({
        where: { Fecha_Venta: formatDate }, // Match sales by date as date , not string
        select: {
          ID_Venta: true,
          ISBN: true,
          Fecha_Venta: true,
          Cantidad: true,
        },
      });
  
      // Handle case when no sales are found
      if (salesD.length === 0) {
        console.log("No sales found for this book with this date"); // Debugging log
        return res.status(404).json({ error: "No sales found for this book with this date" });
      }
  
      res.json({
        message: "Sales endpoint works!",
        sales: salesD,
      });
    } catch (error) {
      console.error("Error fetching sales:", error); // Log the error for debugging
      res.status(500).json({ error: "An error occurred while fetching sales with this date" }); // Send an error response
    }
  });



module.exports = router;
