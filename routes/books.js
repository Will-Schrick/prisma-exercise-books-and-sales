const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
router.get("/", async (req, res) => {
  console.log("GET /books route hit");
  //router.get("/books", async (req, res) => {
  const books = await prisma.libro.findMany({
    select: {
      ISBN: true,
      Titulo: true,
      Autor: true,
      Precio: true,
    },
  });
  console.log("Books fetched successfully:", books);
  res.json({
    message: "Books fetched successfully", //my updated message
    books: books,
  });
  //res.json(books); //this was my original method
});

// Test route for "/books/test"...my original code was makeing it "/books/books"
//on accident..this was a trial to see url paths
router.get("/test", (req, res) => {
  res.send("Books test route is working!");
});



/*
//books/author/:author
router.get("/author/:author", async (req, res) => {
  const { author } = req.params;
  console.log(`Fetching books by author: ${author}`); // Log for debugging
  const booksA = await prisma.libro.findMany({
    where: {
      Autor: {
        contains: author,
        mode: "insensitive",
      },
    },
    select: {
      ISBN: true,
      Titulo: true,
      Autor: true,
      Precio: true,
    },
  });

  res.json(booksA); // Send the author as the response
});
*/
//same path but practice with try/catch block for errors
router.get("/author/:author", async (req, res) => {
  const { author } = req.params;
  console.log(`Fetching books by author: ${author}`); // Log for debugging

  try {
    // Query the database for books by the given author
    const booksA = await prisma.libro.findMany({
      where: {
        Autor: {
          contains: author,
          mode: "insensitive",
        },
      },
      select: {
        ISBN: true,
        Titulo: true,
        Autor: true,
        Precio: true,
      },
    });

    // Check if no books were found
    if (booksA.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    res.json(booksA); // Send the books as the response
  } catch (error) {
    console.error("Error fetching books:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching books" }); // Send an error message
  }
});


//books/price/:price: Displays all books that cost more than 20.
router.get("/price/:price", async (req, res) => {
  const { price } = req.params;
  console.log(`Fetching books by price >$20:  ${price}`); // Log for debugging

  try {
    // Query the database for books by the given author
    const booksP = await prisma.libro.findMany({
      where: {
        Precio: {
            gt: parseInt(price),
          },
        },
      select: {
        ISBN: true,
        Titulo: true,
        Autor: true,
        Precio: true,
      },
    });
  
    // Check if no books were found
    if (booksP.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    res.json(booksP); // Send the books as the response
  } catch (error) {
    console.error("Error fetching books:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching books" }); // Send an error message
  }
});


///books/with-sales: Performs a JOIN to combine the tables Librosand Ventas based on the ISBN.
router.get("/with-sales", async (req, res) => {
  try {
    const booksWithSales = await prisma.libro.findMany({
      include: {
        Ventas: true
      },
      
    });
    res.status(200).json(booksWithSales);
  } catch (error) {
    console.error("Error fetching books with sales:", error);
    res.status(500).json({ error: "Failed to fetch books with sales" });
  }
});



//  /sales/top: Extract the book with the highest total revenue generated.
router.get("/top", async (req, res) => {
  try {
    // Fetch all books with their total sales data
    const booksWithSales = await prisma.libro.findMany({
      include: {
        Ventas: true, // Include related sales
      },
    });

    // Calculate total revenue for each book
    const booksWithTotalRevenue = booksWithSales.map((book) => {
      const totalRevenue = book.Ventas.reduce(
     //array.reduce((accumulator, currentValue) => {
        (sum, venta) => sum + venta.Cantidad * book.Precio, 0
      ); //this is the callback for the reduce()
      return {
        ISBN: book.ISBN,
        Titulo: book.Titulo,
        Autor: book.Autor,
        Precio: book.Precio,
        TotalRevenue: totalRevenue,
      };
    });

    // Find the book with the highest total revenue
    const topBook = booksWithTotalRevenue.reduce((prev, current) => {
      if (prev.TotalRevenue > current.TotalRevenue) {
        return prev;
      } else {
        return current;
      }
      });
    console.log("Top book by revenue is (drumroll):", topBook);
    res.status(200).json(topBook);
  } catch (error) {
    console.error("Error fetching top book by revenue:", error);
    res.status(500).json({ error: "Failed to fetch top book by revenue" });
  }
});



// isbn
router.get("/:isbn", async (req, res) => {
  const { isbn } = req.params; // Extract ISBN from the URL
  console.log(`Fetching book with ISBN: ${isbn}`);
  const book = await prisma.libro.findUnique({
    where: { ISBN: isbn },
    select: {
      ISBN: true,
      Titulo: true,
      Autor: true,
      Precio: true,
    },
  });
  
  res.json(book); // Send the book as the response
});


//--terminado =)

module.exports = router;