//Initializing Express Router
const Router = require("express").Router();

// Including Model
const AuthorModel = require("../../database/author");

/*
Routing     : /author
Description : get all authors
Access      : public
Parameters  : none
Method      : GET
 */
Router.get("",async(req,res)=>{
    try {
        const getAuthor = await AuthorModel.find();
        return res.json({authors:getAuthor})
    } catch (error) {
        return res.json({error:error.message});
    }
  
});


 /*
Routing     : /authorname
Description : get specific author
Access      : public
Parameters  : name
Method      : GET
 */
Router.get("/authorname/:name",async(req,res)=>{
    try{
     const getSpecificAuthor = await AuthorModel.findOne({name:req.params.name});
     if(!getSpecificAuthor){
         return res.json({error:`No data found on this ${req.params.name}`});
     }
     return res.json({authors:getSpecificAuthor});
    
    }catch(error){
        return res.json({error:error.message});
    }
});

/*
Routing     : /authorisbn
Description : get all authors based on isbn 
Access      : public
Parameters  : isbn
Method      : GET
 */
 
Router.get("/authorisbn/:isbn",async(req,res)=>{
    try {
        const getAuthor = await AuthorModel.findOne({books:req.params.isbn});
  
   
        if (!getAuthor){
            
            return res.json({error:`No data found on this ${req.params.isbn}`});
        }
        return res.json({authors:getAuthor});

    } catch (error) {
        return res.json({error:error.message});
    }
   
});

/*
Routing     : /author/new
Description : add a new author
Access      : PUBLIC
Parameters  : none
Method      : POST
*/ 
Router.post("/new",async(req,res)=>{
try {
    const {newAuthor} = req.body;
    const createNewAuthor = await AuthorModel.create(newAuthor);
    return res.json({authors: createNewAuthor ,message:"Yooo! added succesfully!"});
        
    } catch (error) {
        return res.json({error:error.message});
    }

    });
 

// put request
/*
Routing     : /book/author/update
Description : add an author id in books as well as authors database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 
Router.put("/book/update/:isbn",async(req,res)=>{
    try {
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
        
    } catch (error) {
        return res.json({error:error.message});
    }
  

});

/*
Routing     : /book/author/delete/
Description : delete an author from the books as well as update the author database
Access      : PUBLIC
Parameters  : isbn/authorID
Method      : DELETE
 */ 
Router.delete("/book/delete/:isbn/:authorID",async(req,res)=>{
 try {
    const updatedBook = await BookModel.findOneAndUpdate({ISBN:req.params.isbn},
        {$pull:{authors:req.params.authorID}},
        {new:true}
        );

    const updatedAuthor = await AuthorModel.findOneAndUpdate({id:parseInt(req.params.authorID)},
        {$pull:{books:req.params.isbn}},
        {new:true}
        );
        
        
    return res.json({books:updatedBook,authors:updatedAuthor ,message:"Deleted and updated succesfully!"});

 } catch (error) {
     return res.json({error:error.message});
 }
   
});

module.exports = Router;
