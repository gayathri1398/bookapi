require ('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const database = require('./database/index.js');

// Including models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// connecting the mongodb
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>console.log("Connection established!"));

const shapeAI  = express();

shapeAI.use(express.json());
/*
Routing     : /
Description : get all books
Access      : public
Parameters  : none
Method      : GET
*/

shapeAI.get("/",(req,res)=>{
    return res.json({books:database.books});
});


/*
Routing     : /
Description : get all books
Access      : public
Parameters  : isbn
Method      : GET
*/
shapeAI.get("/is/:isbn",(req,res)=>{
    const getSpecifiedBook = database.books.filter((book)=>book.ISBN==req.params.isbn);

    if (getSpecifiedBook.length===0){
        return res.json({error:`no data found on id ${req.params.isbn}`});
    }
    return res.json({books:getSpecifiedBook});
});

/*
Routing     : /c
Description : get all books
Access      : public
Parameters  : category
Method      : GET
*/

shapeAI.get("/c/:category",(req,res)=>{
    const categorizedBook = database.books.filter((book)=>
    book.category.includes(req.params.category));

    if (categorizedBook.length===0) {
    return res.json({error:`No data found on the category ${req.params.category}`});
    }

    return res.json({books:categorizedBook});
});

 /*

 [not solved]
Routing     : /a
Description : get all books based on author
Access      : public
Parameters  : authors
Method      : GET
 */

shapeAI.get("/a/:id",(req,res)=>{
   
    
    const authorBasedBooks = database.books.filter((book)=>book.authors.includes, parseInt(req.params.id));
   
    if (authorBasedBooks.length===0){
        
        return res.json({error:`No data found on author ${req.params.id} `});
    }
    return res.json({books:authorBasedBooks});
});



 /*
Routing     : /author
Description : get all authors
Access      : public
Parameters  : none
Method      : GET
 */
shapeAI.get("/author",(req,res)=>{
    return res.json({authors:database.authors})
});


 /*
Routing     : /authorname
Description : get specific author
Access      : public
Parameters  : name
Method      : GET
 */
shapeAI.get("/authorname/:name",(req,res)=>{
     const getSpecificAuthor = database.authors.filter((author)=>author.name.includes(req.params.name));
     if(getSpecificAuthor.length===0){
         return res.json({error:`No data found on this ${req.params.name}`});
     }
     return res.json({authors:getSpecificAuthor});
});

/*
Routing     : /authorisbn
Description : get all authors based on isbn 
Access      : public
Parameters  : isbn
Method      : GET
 */
 
shapeAI.get("/authorisbn/:isbn",(req,res)=>{
    const getAuthor = database.authors.filter((author)=>
    author.books.includes(req.params.isbn));
  
   
    if (getAuthor.length===0){
        
        return res.json({error:`No data found on this ${req.params.isbn}`});
    }
    return res.json({authors:getAuthor});
});


/*
Routing     : /publication
Description : get all publications
Access      : public
Parameters  : none
Method      : GET
 */
shapeAI.get("/publication",(req,res)=>{
    return res.json({publications:database.publications});
    
});

/*
Routing     : /pubname
Description : get all publications
Access      : public
Parameters  : name
Method      : GET
 */
shapeAI.get("/pubname/:name",(req,res)=>{
    const specifiedPublications = database.publications.filter((publication)=>
    publication.name.includes(req.params.name));
   
    if (specifiedPublications.length===0){
        return res.json({error:`No data found on this ${req.params.name}`});
    }
    return res.json({publications:database.publications});

});

/*
Routing     : /pubisbn
Description : get all publications on isbn
Access      : public
Parameters  : isbn
Method      : GET
 */

shapeAI.get("/pubisbn/:isbn",(req,res)=>{
    const specifiedPublications = database.publications.filter((publication)=>publication.books.includes(req.params.isbn));
    if (specifiedPublications.length===0){
        return res.json({error:`No data found on this ${req.params.isbn}`});
    }
    return res.json({publications:specifiedPublications});
});



// post method
/*
Routing     : /book/new
Description : add a new book
Access      : public
Parameters  : none
Method      : POST
 */
shapeAI.post("/book/new",(req,res)=>{
    const {newBook} = req.body;  //destructure
    database.books.push(newBook);
    return res.json({books:database.books,message:"book added succesfully!"}) ;
})

/*
Routing     : /author/new
Description : add a new author
Access      : PUBLIC
Parameters  : none
Method      : POST
*/ 
shapeAI.post("/author/new",(req,res)=>{
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);
    return res.json({authors:database.authors,message:"Yooo! added succesfully!"});
});

/*
Routing     : /publication/new
Description : add a new publication
Access      : PUBLIC
Parameters  : none
Method      :POST
*/ 
shapeAI.post("/publication/new",(req,res)=>{
    const {newPublication} = req.body;
    database.publications.push(newPublication);
    return res.json({publications:database.publications,message:"Hurray! added succesfully!!"});
});

// put request
/*
Routing     : /book/update
Description : add a new publication
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

shapeAI.put("/book/update/:isbn",(req,res)=>{
    database.books.forEach((book)=> {
        if(book.ISBN===req.params.isbn){
          book.title = req.body.bookTitle;
          return;
         }
    })
    return res.json({books:database.books,message:"Here u go!"});
});

// put request
/*
Routing     : /book/author/update
Description : add an author id in books as well as authors database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 
shapeAI.put("/book/author/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.authors.push(req.body.newAuthor); // for each book 
            return;
        };
    })
    database.authors.forEach((author)=>{
        if(author.id===req.body.newAuthor){
        author.books.push(req.params.isbn);
        return;
        }
    })
    return res.json({books:database.books,authors:database.authors,message:"both done succesfully!!"});

})

/*
Routing     : /publication/update/book
Description : add a new book to publication and update in books database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

shapeAI.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    database.publications.forEach((publication)=>{
      if(publication.id===req.body.pubID){
          return publication.books.push(req.params.isbn);
      }
    })
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            return book.publications = req.body.pubID;
        }
    })
    return res.json({books:database.books,publications:database.publications,message:"added dude!!"});
})


// DELETE
/*
Routing     : /book/delete
Description : delete a book from thebooks database
Access      : PUBLIC
Parameters  : isbn
Method      : DELETE
 */ 
shapeAI.delete("/book/delete/:isbn",(req,res)=>{
        const updateBookDatabase = database.books.filter((book)=>book.ISBN!==req.params.isbn);
        database.books = updateBookDatabase;
        return res.json({books:database.books,message:"deleted successfully!"});
});  

/*
Routing     : /book/author/delete/
Description : delete an author from the books as well as update the author database
Access      : PUBLIC
Parameters  : isbn/authorID
Method      : DELETE
 */ 
shapeAI.delete("/book/author/delete/:isbn/:authorID",(req,res)=>{
    database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const updateBookAuthor = book.authors.filter((author)=>(author!==parseInt(req.params.authorID)));
        book.authors =updateBookAuthor;
        return;
    }  
    });
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.authorID)){
            const updateAuthorDatabase = author.books.filter((book)=>(book!==req.params.isbn));
            author.books=updateAuthorDatabase;
            return;
        }
    })
    return res.json({books:database.books,authors:database.authors,message:"Deleted and updated succesfully!"});
})

/*
Routing     : /publication/delete
Description : delete a publication based on id
Access      : PUBLIC
Parameters  : id
Method      : DELETE
 */ 
shapeAI.delete("/publication/delete/:id",(req,res)=>{
    const updatePublication = database.publications.filter((publication)=>publication.id!==parseInt(req.params.id));
    database.publications = updatePublication;
    return res.json({publications:database.publications});
})

/*
Routing     : /publication/book/delete
Description : delete a publication  and update the books database
Access      : PUBLIC
Parameters  : isbn/id
Method      : DELETE
 */ 

shapeAI.delete("/publication/book/delete/:isbn/:id",(req,res)=>{
   database.books.forEach((book)=>{
     if(book.ISBN===req.params.isbn){
    //    const updatePub = book.publications.filter ((publication)=>publication!==parseInt(req.params.id));  
    // book.publications = updatePub;
            //book.publication -for that particular book
               // this doesnt work beacause filter is used for array
        book.publications=0;
               
       return;
    }
  })
   
   database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            const updateBookPublication = publication.books.filter((book)=>book!==req.params.isbn);
            publication.books = updateBookPublication;
            return;
        }

   })
   return res.json({books:database.books,publications:database.publications,message:"Uffff!!!!!!!!!"})

})








shapeAI.listen(8000,()=> console.log("Server is running sucessfully!..."));

