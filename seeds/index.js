const mongoose=require('mongoose');
const Recipe=require('../models/recipe');
const User=require('../models/user')
mongoose.connect('mongodb://localhost:27017/recipe-adda', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const imgAddress='https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=549&q=80'

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


const dishArray=['Cake','Pastry','Pasta','Garlic-Bread','Pizza','Bread-Butter','Sweet-corns']


const date=new Date();

// "https://res.cloudinary.com/drybvwzqq/image/upload/v1625643118/RecipeAdda/q6c0j7tmtfxm3rbxmmop.jpg", "filename" : "RecipeAdda/q6c0j7tmtfxm3rbxmmop"


const seedDB=async()=>{
    await Recipe.deleteMany({});

    const adminRecipe=new Recipe({
        author:'60e5583da1c514f6405d8341',
        title:"Everyone's favourite",
        authorName:'admin',
        images:[{
            url:'https://res.cloudinary.com/drybvwzqq/image/upload/v1625643118/RecipeAdda/q6c0j7tmtfxm3rbxmmop.jpg',
            filename:'RecipeAdda/q6c0j7tmtfxm3rbxmmop'
        }],
        description:'This is seed databasem !',
        cookingTips:'None',
        date:date.toDateString(),
        category:'0'
    });
    await adminRecipe.save();
    
    for (let dish of dishArray){
        const recipe=new Recipe({
            author:'60e3f796e25f51225c8c3299',
            title:dish,
            authorName:'nitish420',
            images:[{
                url:'https://res.cloudinary.com/drybvwzqq/image/upload/v1625643118/RecipeAdda/q6c0j7tmtfxm3rbxmmop.jpg',
                filename:'RecipeAdda/q6c0j7tmtfxm3rbxmmop'
            }],
            description:'this is seed database',
            cookingTips:'None',
            date:date.toDateString(),
            category:'1'
    
        })
        
        await recipe.save();
    }
    
}

// pending to add veg nonveg section

seedDB().then(()=>{
    mongoose.connection.close();
})


// "images" : [ { "_id" : ObjectId("60e4e55bb3bef29428769130"),
//  "url" : "https://res.cloudinary.com/drybvwzqq/image/upload/v1625613658/RecipeAdda/wqdqvdzcw0511lnu72mj.jpg",
//   "filename" : "RecipeAdda/wqdqvdzcw0511lnu72mj" } ]