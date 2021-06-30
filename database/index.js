let books =[{
  ISBN : "12345ONE",
  title:"Getting started with MERN",
  authors:[1,2,3],
  language:"en",
  pubDate:"2021-07-02",
  numOfPage:225,
  category:["fiction","programming","tech","web dev"],
  publications: [1,2]
},
{
    ISBN : "12345TWO",
    title:"Python Programming",
    authors:[1,2],
    language:"en",
    pubDate:"2021-07-02",
    numOfPage:225,
    category:["fiction","programming","tech","web dev","funny"],
    publications:2,
  }
]


const authors =[{
    id: 1,
    name:"pavan",
    books:["12345ONE"]
    },
 {
    id: 2,
    name:"shaurya",
    books:["12345ONE","12345TWO"]
  },
  {
    id: 3,
    name:"shauryasinha",
    books:["12345ONE"]
  }]


let publications =[{
  id: 1,
  name:"chakra publication",
  books:["12345ONE","12345TWO"]

},
{
  id: 2,
  name:"gaya3 publication",
  books:["12345TWO"]

}]
module.exports={books,authors,publications};