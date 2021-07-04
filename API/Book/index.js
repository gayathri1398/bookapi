// Prefix:/book

//Initializing Express Router
const Router = require("express").Router();
// Including Models
const BookModel = require("../../database/book");

/*
Routing     : /
Description : get all books
Access      : public
Parameters  : none
Method      : GET
*/

Router.get("/",async(req,res)=>{
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
Router.get("/is/:isbn",async(req,res)=>{
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

Router.get("/c/:category",async(req,res)=>{
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

Router.get("/a/:id",async(req,res)=>{
   
    
    const authorBasedBooks = await BookModel.findOne({authors: parseInt(req.params.id)});
   
    if (!authorBasedBooks){
        
        return res.json({error:`No data found on author ${req.params.id} `});
    }
    return res.json({books:authorBasedBooks});
});

// post method
/*
Routing     : /book/new
Description : add a new book
Access      : public
Parameters  : none
Method      : POST
 */
Router.post("/new",async(req,res)=>{
    const {newBook} = req.body;  //destructure
    const addNewBook = BookModel.create(newBook);
    return res.json({books:addNewBook,message:"book added succesfully!"}) ;
});

// put request
/*
Routing     : /book/update
Description : update a title
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

Router.put("/update/:isbn",async(req,res)=>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {title: req.body.bookTitle},
        {new:true}
        )
    
  
    return res.json({books:updatedBook,message:"Here u go!"});
});

// DELETE
/*
Routing     : /book/delete
Description : delete a book from thebooks database
Access      : PUBLIC
Parameters  : isbn
Method      : DELETE
 */ 
Router.delete("/delete/:isbn",async(req,res)=>{
    // since deleting the whole object just pass the parameter
        const updateBookDatabase = await BookModel.findOneAndDelete(    
            {ISBN:req.params.isbn})
          
        
        return res.json({books:updateBookDatabase,message:"deleted successfully!"});
});  

module.exports = Router;