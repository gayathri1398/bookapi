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

shapeAI.get("/",async(req,res)=>{
    const getAllBooks = await BookModel.find();
   return res.json({books:getAllBooks});

 });


/*
Routing     : /
Description : get all books
Access      : public
Parameters  : isbn
Method      : GET
*/
shapeAI.get("/is/:isbn",async(req,res)=>{
    const getSpecifiedBook =await BookModel.findOne({ ISBN:req.params.isbn});

    if (!getSpecifiedBook){
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

shapeAI.get("/c/:category",async(req,res)=>{
    const categorizedBook = await BookModel.findOne({category:req.params.category});

    if (!categorizedBook) {
    return res.json({error:`No data found on the category ${req.params.category}`});
    }

    return res.json({books:categorizedBook});
});

 /*

 
Routing     : /a
Description : get all books based on author
Access      : public
Parameters  : authors
Method      : GET
 */

shapeAI.get("/a/:id",async(req,res)=>{
   
    
    const authorBasedBooks = await BookModel.findOne({authors: parseInt(req.params.id)});
   
    if (!authorBasedBooks){
        
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
shapeAI.get("/author",async(req,res)=>{
    const getAuthor =await AuthorModel.find();
    return res.json({authors:getAuthor})
});


 /*
Routing     : /authorname
Description : get specific author
Access      : public
Parameters  : name
Method      : GET
 */
shapeAI.get("/authorname/:name",async(req,res)=>{
     const getSpecificAuthor = await AuthorModel.findOne({name:req.params.name});
     if(!getSpecificAuthor){
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
 
shapeAI.get("/authorisbn/:isbn",async(req,res)=>{
    const getAuthor = await AuthorModel.findOne({books:req.params.isbn});
  
   
    if (!getAuthor){
        
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
shapeAI.get("/publication",async(req,res)=>{
    const getPublication = await PublicationModel.find();
    return res.json({publications:getPublication});
    
});

/*
Routing     : /pubname
Description : get all publications
Access      : public
Parameters  : name
Method      : GET
 */
shapeAI.get("/pubname/:name",async(req,res)=>{
    const specifiedPublications = await PublicationModel.findOne({name:req.params.name});
   
    if (!specifiedPublications){
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

shapeAI.get("/pubisbn/:isbn",async(req,res)=>{
    const specifiedPublications = await PublicationModel.findOne( {books:req.params.isbn});
    if (!specifiedPublications){
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
shapeAI.post("/book/new",async(req,res)=>{
    const {newBook} = req.body;  //destructure
    const addNewBook = BookModel.create(newBook);
    return res.json({books:addNewBook,message:"book added succesfully!"}) ;
})

/*
Routing     : /author/new
Description : add a new author
Access      : PUBLIC
Parameters  : none
Method      : POST
*/ 
shapeAI.post("/author/new",async(req,res)=>{
    const {newAuthor} = req.body;
    const createNewAuthor = AuthorModel.create(newAuthor);
    return res.json({authors: createNewAuthor ,message:"Yooo! added succesfully!"});
});

/*
Routing     : /publication/new
Description : add a new publication
Access      : PUBLIC
Parameters  : none
Method      :POST
*/ 
shapeAI.post("/publication/new",async(req,res)=>{
    const {newPublication} = req.body;
    const createNewPublication = await PublicationModel.create(newPublication);
    return res.json({publications: createNewPublication,message:"Hurray! added succesfully!!"});
});

// put request
/*
Routing     : /book/update
Description : update a title
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

shapeAI.put("/book/update/:isbn",async(req,res)=>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {title: req.body.bookTitle},
        {new:true}
        )
    
  
    return res.json({books:updatedBook,message:"Here u go!"});
});

// put request
/*
Routing     : /book/author/update
Description : add an author id in books as well as authors database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 
shapeAI.put("/book/author/update/:isbn",async(req,res)=>{
     const updatedBook = await BookModel.findOneAndUpdate(
         {ISBN:req.params.isbn},
          {$addToSet:{authors: req.body.newAuthor}},
          {new:true}
         )
       
          
         const updatedAuthor= await AuthorModel.findOneAndUpdate(
             {id:req.body.newAuthor},
              {$addToSet:{books:req.params.isbn}},
              {new:true}
            )
            
       
       
    return res.json({books:updatedBook,authors:updatedAuthor,message:"both done succesfully!!"});

})


/*
Routing     : /publication/update/book
Description : add a new book to publication and update in books database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

shapeAI.put("/publication/update/book/:isbn",async(req,res)=>{
    //update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {id:req.body.pubID},
        {$push:{books:req.params.isbn}},
        {new:true}
    )
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {publications:req.body.pubID},
        {new:true}

    )
    return res.json({books:updatedBook,publications:updatedPublication,message:"added dude!!"});
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

