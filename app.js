const express = require("express");

const cookieParser = require("cookie-parser");

const app = express();

const router = require("./router/login-auth");

const User = require("./model/User");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/auth",router);

// let authenticate = (req, res) =>{
//     console.log(req.baseUrl);
//     let path = req.baseUrl.split('/')[1];
//     res.cookie('YouAre', path, {
//         path: '/' + path
//     });
//     res.end('');
// }
// app.use('/admin/login', authenticate);
// app.use('/user/login', authenticate);

var isAuthenticated = function (req, res, next) {
    if(req.cookies.email != null){
        
        next();
        return;
    }else{
        res.redirect("/auth/login");
    }
}

app.use("/buypage", isAuthenticated, function (req, res) {
    res.render("buypage")
});

app.use("/auth/buypage", isAuthenticated, function (req, res) {
    let emailUser = req.cookies.email;
    User.findOne({
        email: emailUser
    })
    .then( (user)=>{
        res.render("buypage", {data:user});
    })
    .catch( (err)=>{
        console.log(err);
    });
    
});

app.use("/auth/historybuy", isAuthenticated, function (req, res) {
    console.log("hih");
   res.render("historybuy"); 
});


var mongoose = require('mongoose');
var conn = mongoose.connection;
conn.on('connected', function(err, conn) {
    if (err) throw Error('Database can not connected');
    console.log('Mongoose connected');
    app.listen(3000, () => {
        console.log("Server is running on port 3000!");
    });
});
mongoose.connect("mongodb://localhost/loginapp");