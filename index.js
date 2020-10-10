var express       = require("express"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    app           = express(),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    user          = require("./models/user");

mongoose.connect("mongodb://localhost/hackvit",{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// PASSPORT CONFIG
app.use(require("express-session")({
    secret:"Burn in Hell",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currUser = req.user;
    next();
});

//ROUTES
app.get("/",function(req,res){
    res.send("hello");
})

//SignUp
app.get("/signup",function(req,res){
    res.render("signup");
});
app.post("/signup",function(req,res){
    var newuser= new user({username:req.body.username});
    user.register(newuser,req.body.password,function(err,u){
        if(err){
            console.log(err);
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});
//Login
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/",
        failureRedirect:"/login",
    }),function(req,res){
});
//Logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen("2000",function(){
    console.log("started");
})