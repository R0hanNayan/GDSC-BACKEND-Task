const express = require('express');
const app = express();
const bodyParser =  require('body-parser');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const connection = mongoose.createConnection("mongodb+srv://rohannayan405:rohannayan405@cluster0.vc7pfye.mongodb.net/signUpDB");

const userSchema = new mongoose.Schema({
    _id: String,
    password: String
});

const User = connection.model("User", userSchema);



app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

//Sign Up
app.get("/signUp", function(req, res){
    res.sendFile(__dirname+"/signUp.html")
});


app.post("/signUp", function(req, res){
    const inputName = req.body.username;
    User.find({}).then(user=>{
        let flag = true;
        user.forEach(name => {
            if(name._id===inputName){
                flag = false;
                res.send("Username already in use! Please try again.");
            }
        });
        if(flag===true){
            const user = new User({
                _id: inputName,
                password: req.body.password
            })
            user.save().then(function(){
                console.log("Sign Up Success!");
                res.redirect('/');
            });
        }
    });
});


//Log In
app.get("/logIn", function(req, res){
    res.sendFile(__dirname+"/login.html")
});

app.post("/logIn",function(req, res){
    const inputName = req.body.username;
    const inputPass = req.body.password;
    User.findById(inputName).then(user=>{
        if(user.password===inputPass){
            console.log("Passed");
            res.send("Log In Success!");
        }else{
            console.log("Failed Login");
            res.send("Incorrect Password Please try again!");
        }
    });
});


app.listen(3000, function(){
    console.log("Server running at port 3000");
});