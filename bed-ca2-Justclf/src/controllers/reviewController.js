const model = require("../models/reviewModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

// Create new review
module.exports.createReview = (req, res, next) => {
    if (!req.body.rating || !req.body.comment) {
        return res.status(400).json({ message: "Rating and comment are required" });
    }
    
    if (req.body.rating > 5 || req.body.rating < 1) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const userId = res.locals.userId;



    const callbackgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error)
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Game user not found"})
        }

        const gameUserId = results[0].id;
        const data = {
            rating: req.body.rating,
            comment: req.body.comment,
            user_id: gameUserId
        }


        const callback = (error2, results2) => {
            if (error2) {
                console.error ("Error creating review:", error2);
                return res.status(500).json(error2)
            }
            res.status(201).json({message: "Reviews created", id: results2.insertId});
        }
        model.insertSingle(data, callback);
    };
    gameUserModel.selectByUserId({user_id: userId}, callbackgameuser)
}

module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error reading review:", error);
            return res.status(500).json(error);
        }
        res.status(200).json(results)
    }
    model.selectAll(callback)
}


module.exports.updateReviewById = (req, res, next) => {
    if (!req.body.rating || !req.body.comment) {
        return res.status(400).json({message: "Rating and comments are required"})
    }

    if (req.body.rating > 5 || req.body.rating < 1) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const userId = res.locals.userId;


    const callbackgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Game user not found"})
        }

        const gameUserId = results[0].id;
        const data = {
            id: req.params.id,
            rating: req.body.rating,
            comment: req.body.comment,
            user_id:gameUserId
        }
        

        const callback = (error2, results2) => {
            if (error2) {
                console.error ("Error creating review:", error2);
                return res.status(500).json(error2)
            }
            res.status(200).json({message: "Reviews updated"});
        }
        model.updateById(data, callback);
    };
    gameUserModel.selectByUserId({user_id: userId}, callbackgameuser)
}

module.exports.deleteReviewById = (req, res, next) => {
    const userId = res.locals.userId;

    const gameUserId = results[0].id


    const callbackgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Game user not found"})
        }

        const data = {
            id: req.params.id,
            user_id:gameUserId
        }

        const callback = (error2, results2) => {
            if (error2) {
                console.error("Error deleteReviewById:", error2);
                return res.status(500).json(error2);
            }
            if (results2.affectedRows === 0) {
                return res.status(404).json({ message: "Review not found or you can only delete your own reviews" });
            }
            res.status(200).json({ message: "Review deleted successfully" });
        }
        model.deleteById(data, callback);
    };
    gameUserModel.selectByUserId({ user_id: userId }, callbackgameuser);
}