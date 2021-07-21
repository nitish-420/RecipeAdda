const Recipe=require('../models/recipe')
const {cloudinary}=require('../cloudinary/index')

module.exports.renderIndex=async (req,res)=>{
    const recipes=await Recipe.find({}).populate('images');
    await recipes.reverse();
    res.render('recipes/index',{recipes});
}


module.exports.renderNew=(req,res)=>{
    res.render('recipes/new');
    
}


module.exports.newRecipe=async (req,res)=>{
    const recipe=new Recipe(req.body.recipe);
    recipe.author=req.user._id;
    recipe.authorName=req.user.displayName;
    recipe.date=new Date().toDateString();
    recipe.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    await recipe.save();
    req.flash('success','Successfully created a new Recipe...!');
    res.redirect('/recipes');
}

module.exports.showRecipes=async (req,res)=>{
    const {id}=req.params;
    
    const recipe=await Recipe.findById(id).populate('reviews').populate('images');
    
    let countImages=0;
    for(let img of recipe.images){
        countImages++;
    }
    
    if(countImages==0){
        
        await recipe.images.push({
            url:'https://res.cloudinary.com/drybvwzqq/image/upload/v1625643118/RecipeAdda/q6c0j7tmtfxm3rbxmmop.jpg',
            filename:'RecipeAdda/q6c0j7tmtfxm3rbxmmop'
        })
    };  
        await recipe.save();
        
        res.render('recipes/show',{recipe});
}

module.exports.renderEditRecipe=async (req,res)=>{
    const {id}=req.params;
    const recipe=await Recipe.findById(id);
    res.render('recipes/edit',{recipe});
}


module.exports.editRecipe=async(req,res)=>{
    const {id}=req.params;
    const imgs=req.files.map(f=>({ url:f.path,filename:f.filename}));
    const recipe= await Recipe.findByIdAndUpdate(id,{...req.body.recipe});
    recipe.images.push(...imgs);
    recipe.date=new Date().toDateString()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
            await cloudinary.uploader.upload
        }
        await recipe.updateOne({$pull:{images:{filename:{$in : req.body.deleteImages}}}})
    }
    await recipe.save();
    
    await recipe.updateOne({$pull:{images:{filename:'RecipeAdda/q6c0j7tmtfxm3rbxmmop'}}})

    req.flash('success','Successfully updated a Recipe...!')
    res.redirect(`/recipes/${id}`);
}

module.exports.deleteRecipe=async(req,res)=>{
    const {id}=req.params;
    await Recipe.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a Recipe...!')
    res.redirect('/recipes');
}
