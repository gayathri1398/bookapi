//Initializing Express Router
const Router = require("express").Router();

// Including Models
const PublicationModel = require("../../database/publication");


/*
Routing     : /publication
Description : get all publications
Access      : public
Parameters  : none
Method      : GET
 */
Router.get("",async(req,res)=>{
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
Router.get("/pubname/:name",async(req,res)=>{
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

Router.get("/pubisbn/:isbn",async(req,res)=>{
    const specifiedPublications = await PublicationModel.findOne( {books:req.params.isbn});
    if (!specifiedPublications){
        return res.json({error:`No data found on this ${req.params.isbn}`});
    }
    return res.json({publications:specifiedPublications});
});

/*
Routing     : /publication/new
Description : add a new publication
Access      : PUBLIC
Parameters  : none
Method      :POST
*/ 
Router.post("/new",async(req,res)=>{
try {
    const {newPublication} = req.body;
    const createNewPublication = await PublicationModel.create(newPublication);
    return res.json({publications: createNewPublication,message:"Hurray! added succesfully!!"});

} catch (error) {
    return res.json({Error:error.message});
}
});
 


/*
Routing     : /publication/update/book
Description : add a new book to publication and update in books database
Access      : PUBLIC
Parameters  : isbn
Method      : PUT
*/ 

Router.put("/update/book/:isbn",async(req,res)=>{
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
});



/*
Routing     : /publication/delete
Description : delete a publication based on id
Access      : PUBLIC
Parameters  : id
Method      : DELETE
 */ 
Router.delete("/delete/:id",async(req,res)=>{
    const updatePublication = await PublicationModel.findOneAndDelete(
        {id:parseInt(req.params.id)}
       
    )
   
    return res.json({publications:updatePublication,message:"deleted this data!"});
});

/*
Routing     : /publication/book/delete
Description : delete a publication  and update the books database
Access      : PUBLIC
Parameters  : isbn/id
Method      : DELETE
 */ 

Router.delete("/book/delete/:isbn/:id",async(req,res)=>{
    const newBook =await BookModel.findOneAndUpdate({ISBN:req.params.isbn},
        {publications:null},
        {new:true}
        )
    
    const newPublication = await PublicationModel.findOneAndUpdate(
        {id:parseInt(req.params.id)},
        {$pull:{books:req.params.isbn}},
        {new:true}
    )
   
   return res.json({books:newBook,publications:newPublication,message:"Uffff!!!!!!!!!"})

});

module.exports = Router;


