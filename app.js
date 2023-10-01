const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
var multer = require('multer');
var upload = multer({dest:'exercise/uploads'})
const Post = require("./api/models/posts");
const postsData = new Post();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'exercise/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.jpg`)
    }
  })

  var upload = multer({ storage: storage });

app.use(express.json());
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*")
    next();

})

app.use('/uploads', express.static('uploads'));



app.get("/api/posts", (req, res) => {
    
    res.status(200).send(postsData.get());

})

app.get("/api/posts/:post_id",(req, res) => {

const postId = req.params.post_id;
const foundPost = postsData.getIndividualBlog(postId);
if(foundPost){

    res.status(200).send(foundPost)
}else{

    res.status(404).send("not found");
}

})

app.post("/api/posts",upload.single("post-image"),(req, res) =>{



const newPost = {
    "id": `${Date.now()}`,
    "title": req.body.title,
    "content": req.body.content,
    "post-image": req.file.path,
    "added-date": `${Date.now()}`
}    
postsData.add(newPost);
res.status(201).send(newPost);
})




app.listen(3000, () => console.log("Listening on http://localhost:3000") );