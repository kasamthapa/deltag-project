const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const User= require("./models/user.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You don't have the permission to perform this action!");
        res.redirect(`/listings/${id}`);
    }
    next();

}
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }
    else{
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);

        // Ensure the review exists
        if (!review) {
            return res.status(404).send("Review not found");
        }

        // Check if the current user and review author are defined
        if (!review.author || !res.locals.curUser) {
            console.error("Error in isReviewAuthor middleware: Review author or curUser is undefined");
            console.log("Review Author:", review.author);
            console.log("curUser:", res.locals.curUser);
            return res.status(500).send("Internal Server Error");
        }

        // Check if the current user is the author of the review
        if (!review.author.equals(res.locals.curUser._id)) {
            req.flash("error", "You don't have the permission to perform this action!");
            return res.redirect(`/listings/${id}`);
        }

        // If everything is fine, move to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in isReviewAuthor middleware:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.isReviewAuthor = isReviewAuthor;
