const express=require('express');
const router=express.Router({mergeParams:true})

const {storage}=require('../cloudinary/index');
const multer=require('multer');
const upload=multer({storage});


const catchAsync = require('../utils/catchAsync');
const recipes=require('../controllers/recipes');
const { isLoggedIn, validateRecipe, isAuthor } = require('../middleware');


router.route('/')
    .get(catchAsync(recipes.renderIndex))
    .post(isLoggedIn,upload.array('images'),validateRecipe,catchAsync(recipes.newRecipe))

router.route('/new')
    .get(isLoggedIn,recipes.renderNew)

router.route('/:id')
    .get(catchAsync(recipes.showRecipes))
    .put(isAuthor,upload.array('images'),validateRecipe,catchAsync(recipes.editRecipe))
    .delete(isLoggedIn,isAuthor,catchAsync(recipes.deleteRecipe))

router.route('/:id/edit')
    .get(isLoggedIn,isAuthor,catchAsync(recipes.renderEditRecipe))

module.exports=router;