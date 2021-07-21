if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}

const express=require('express');
const path=require('path');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const ExpressError=require('./utils/ExpressError');
const session = require('express-session');
const flash=require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const User=require('./models/user');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize')


const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/reviews');
const catchAsync = require('./utils/catchAsync');

const MongoDBStore = require("connect-mongo")(session); //remember to download particular version of this not latest( npm i connect-mongo@3.2.0).


const dbUrl = process.env.MONGO_ATLAS_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))




app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith:""
}))

const secret=process.env.SECRET;

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

store.on('error', function(e) {
    console.log('Session Store Error', e);
});

const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    'https://connect.facebook.net'
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net/npm/",
    "https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/",

];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drybvwzqq/",  
                "https://images.unsplash.com/",
                "https://img.icons8.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.use(passport.initialize())
app.use(passport.session())
// for local users 
passport.use(new LocalStrategy(User.authenticate()));

//for using google strategy
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},(accessToken,refreshToken,profile,done)=>{

    User.findOne({googleId: profile.id})
        .then((currentUser) => {
            if(currentUser){
                // console.log('user is: ', currentUser);
                return done(null, currentUser);
            } else {
                new User({
                    username: profile.id,
                    googleId: profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                }).save().then((newUser) => {
                    return done(null, newUser);
                });
            }
    });
}))

// for facebook login they need secure server https , everything else is correct
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_URL,
    profileFields: ['id', 'emails', 'displayName']
},  function(accessToken, refreshToken, profile, done) {
    User.findOne({facebookId:profile.id}, function(err, user) {
        if (err) { return done(err); }
        if(user){
            return done(null,user)
        }
        else{
            let canBeEmail='Not provided'
            if(profile.emails.length){
                canBeEmail=profile.emails[0].value
            }
            new User({
                displayName:profile.displayName,
                facebookId:profile.id,
                username:profile.id,
                email:canBeEmail
            }).save().then((newUser)=>{
                return done(null,newUser)
            })
        }
        });
    }
));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

app.get('/',async (req,res)=>{
    res.render('home');
    
})

// routes ---------------------------------------------------------------------------------------

app.use('/', userRoutes);
app.use('/recipes', recipeRoutes)
app.use('/recipes/:id/reviews', reviewRoutes)

//-----------------------------------------------------------------------------------------------

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went wrond!';
    res.status(statusCode).render('error',{err})
})

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`serving on port ${port}`);
})

// To improve :

// save recipes of others 
// save own recipes without showing it to others 
// search on the base of title .
// max and min limit of  images.
