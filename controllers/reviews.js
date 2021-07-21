const Review=require('../models/review');
const Recipe=require('../models/recipe')

module.exports.addReview=async (req,res)=>{
    const {id}=req.params;
    const review=new Review(req.body);
    review.author=req.user._id;
    review.authorName=req.user.displayName;
    await review.save();
    
    const recipe=await Recipe.findById(id);
    await recipe.reviews.push(review);
    await recipe.save();
    req.flash('success','Successfully created a new Review...!')
    res.redirect(`/recipes/${id}`);
    
}


module.exports.deleteReview=async (req,res)=>{
    const {id,reviewId}=req.params;
    await Recipe.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted a Review...!')
    res.redirect(`/recipes/${id}`);

}
