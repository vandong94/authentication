var express = require('express');

var routers = express.Router();

const bodyParser = require("body-parser");

var urlBodyParser = bodyParser.urlencoded({extended: false});

const mongoose = require("mongoose");

const User = require("../model/User");

const History = require("../model/history");

routers.post("/buypage", urlBodyParser, function (req, res) {

    let emailUser = req.cookies.email;

    User.findOne({
        email: emailUser
    })
    .then((data) => {
        if (data.balance > 0 && (data.balance >= req.body.buySelect)) {

            let value1 = req.body.buySelect

            let value2 = "";
            if (value1 == 10) {
                value2 = "Mệnh giá 10.000";
            }
            else if (value1 == 20) {
                value2 = "Mệnh giá 20.000";
            }
            else {
                value2 = "Mệnh giá 30.000";
            }

            //add userID

            let balanceUser = "";
            let remainBalanceUser = "";
            let data = User.findOne({
                email: emailUser
            })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
            });

            data.then((result) => {

                balanceUser = result.balance;
                remainBalanceUser = balanceUser - (req.body.buySelect);

                var saveData = {
                    username: result.username,
                    emailUser: req.cookies.email,
                    name: value2,
                    value: req.body.buySelect,
                    remainbalance: remainBalanceUser
                }
                console.log("balance nek: " + balanceUser);
                //lấy giá trị remainbalance này để update lại giá trị của balance trong collection user
                console.log("remain: " + remainBalanceUser);

                User.updateOne({email: emailUser}, {$set: {balance: remainBalanceUser}}).then((data) => {
                    console.log("data hi: " + data);
                })
                .catch((err) => {
                    console.log(err);
                });

                History(saveData).save((err, data) => {
                    if (err) new Error("Loi khi luu");
                    res.redirect("/auth/historybuy");
                });
                
            })
            .catch((err) => {
                console.log("loi: " + err);
            });

        }else{
            console.log("Your balance is not enough to buy more");
        }
    })
    .catch((err) => {
        console.log(err);
    })
});


routers.get("/login", (req, res) => {
    //console.log(req.path);
    res.render("login");
});
routers.post("/login", urlBodyParser, (req, res) => {
    var dataPost = req.body;
    let {email, password} = dataPost;
    User.findOne({
        email,
        password
    })
    .then(function (user) {
        if (user == null) {
            res.render("login");
        } else {
            res.cookie("email", user.email, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000,
                path: "/auth"
            });
            //user.remember = 1111;
            //user.save();
            res.redirect("/auth/buypage");
            //res.render("buypage", {data: user});
        }

    })
    .catch(function (err) {
        console.log(err);
    });
});

routers.get("/register", (req, res) => {
    res.render("register");
});
routers.post("/register", urlBodyParser, (req, res) => {
    console.log(req.body);
    User(req.body).save((err, data) => {
        if (err) throw err;
        //res.json(data);
        res.render("home");
    });
});

routers.get("/logout", function (req, res) {
    res.cookie("email", "", {
        maxAge: 0
    });
    res.redirect("/");
});

var isAuthenticated = function (req, res, next) {
    console.log("cookie nek: "+req.cookies.email);
    
    if(req.cookies.email != null){
        
        next();
        return;
    }else{
        res.redirect("/auth/login");
    }
}

routers.get("/historybuy", isAuthenticated, function (req, res) {
    let emailUser = req.cookies.email;

    History.find({emailUser: emailUser}, (err, data) => {
        if(err) throw err;
        res.render("historybuy", {data: data});
    });
});




module.exports = routers;