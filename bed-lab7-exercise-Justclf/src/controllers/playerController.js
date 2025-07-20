const model = require("../models/playerModel.js");

// Third step
module.exports.readAllUser = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}


module.exports.readByUserId = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }
    console.log("data", data);

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserbyId:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}