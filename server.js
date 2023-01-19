let express=require("express")
let {MongoClient, ObjectId}=require("mongodb");
let sanitizeHTML=require('sanitize-html');


let myApp=express()

let db;

myApp.use(express.static("public"))

async function letsConnect()
{
  let ourClient=new MongoClient('mongodb+srv://mytodolistapp:mongodb123@clusternew.ravacfz.mongodb.net/yourtodo?retryWrites=true&w=majority');
  await ourClient.connect();

  db=ourClient.db();
  myApp.listen(3000);
}
letsConnect();

myApp.use(express.json())
myApp.use(express.urlencoded({extended:false}))

function passwordProtected(req,res,next)
{
  res.set('WWW-Authenticate','Basic realm="Simple Todo"');
  console.log(req.headers.authorization);
  if(req.headers.authorization=="Basic dG9kbzp0b2Rv")
  {
    next();
  }else{
    res.status(401).send("AUTHENTICATION REQUIRED!");
  }
}
myApp.use(passwordProtected)
myApp.get('/',function(req,res)
{
  db.collection('items').find().toArray(function(err,yourItem)
  {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
          
        </ul>
        
      </div>
      <script>
      let myitems=${JSON.stringify(yourItem)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="./browser.js"></script>
    </body>
    </html>
    `)
  })
    
})

myApp.post('/create-item',function(req,res)
{
  let safeText=sanitizeHTML(req.body.text,
    {allowedTags:[],allowedAttributes:{}}
    )
  db.collection("items").insertOne(
    {toDotext:safeText},
    function(err,info)
    {
      res.json({_id:info.insertedId,
      toDotext:safeText})
    }
  )
    
   
})

myApp.post('/update-item',function(req,res)
{
  let safeText=sanitizeHTML(req.body.text,
    {allowedTags:[],allowedAttributes:{}}
    )
  db.collection("items").findOneAndUpdate({_id: new ObjectId(req.body.newId)},{$set:{toDotext:safeText}},function()
  {
    res.send("Success")
  })
})

myApp.post('/delete-item',function(req,res)
{
  db.collection("items").deleteOne({_id:new ObjectId(req.body.newId)},function()
  {
    res.send("Delete Successful!")
  })
})


