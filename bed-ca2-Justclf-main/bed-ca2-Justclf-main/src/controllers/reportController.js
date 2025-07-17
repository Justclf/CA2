const model = require("../models/reportModel.js");



// Question 7


// Verify that user exists
module.exports.CheckUserId = (req, res, next) =>
{
    if (req.body.user_id == undefined){
            return res.status(400).send("User_id is not complete")
    }

    const data = {
        id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error){
            console.error("Error CheckUserId:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0){
                return res.status(404).json({message: "User not found"})
            } else {
                res.locals.user = results[0];
                next();
            }
        }
    }
    model.GetUserById(data, callback);
}


// Verify vulnerability exists
module.exports.CheckVulnerabilityId = (req, res, next) =>
{
    if (req.body.vulnerability_id == undefined){
        return res.status(400).send("Vulnerability_id is not complete")
    }

    const data = {
        id: req.body.vulnerability_id
    }
    
    const callback = (error, results, fields) => {
        if (error){
            console.error("Error CheckVulnerabilityId:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0){
                return res.status(404).json({message: "Vulnerability not found"})
            } else {
                res.locals.vulnerability = results[0];
                next();
            }
        }
    }
    model.GetVulnerabilityById(data, callback);
}


// Create report
module.exports.CreateNewReport = (req, res, next) =>
{
    const data = {
        user_id: req.body.user_id,
        vulnerability_id: req.body.vulnerability_id
    }

    const callback = (error, results, fields) => {
        if (error){
            console.error("Error creating report:", error);
            return res.status(500).json(error);
        }
        res.locals.reportId = results.insertId;
        next();
    }
    model.CreateReport(data, callback);
}


// Update reputation
module.exports.UpdateUserReputation = (req, res) =>
{
    // Combining the reputation
    const newRep = res.locals.user.reputation + res.locals.vulnerability.points // user.reputation means that its getting its stuff in user//reputation

    const data = {
        id: res.locals.user.id,
        reputation: newRep
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updating reputation:", error)
            return res.status(500).json(error)
        }
        res.status(201).json({
            id: res.locals.reportId,
            user_id: req.body.user_id,
            vulnerability_id: req.body.vulnerability_id,
            status: 0,
            user_reputation: newRep
        })
    }

    model.UpdateReputation(data, callback)
}


// Question 8


// Verify that the report exists
module.exports.CheckReport = (req, res, next) => {
    if (req.body.status === undefined || req.body.user_id == undefined) {
        return res.status(400).json({message: "Error: Status or User_id is undefined"})
    }

    const data = {
        id: req.params.id,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error CheckReport:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Report not found"})     
        }
        res.locals.report = results[0]
        next()
    }

    model.CheckReportById(data, callback)
}


// Verify the user_id(Closer) exists
module.exports.CheckCloser = (req, res, next) => {
    const data = {
        id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error fetching user:", error)
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        res.locals.user = results[0]
        next()
    }

    model.CheckUserById(data, callback)
}


// Update report
module.exports.FinishReport = (req, res, next) => {
    
    const data = {
        id: req.params.id,
        status: req.body.status,
        user_id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error UpdateReport:", error);
            return res.status(500).json(error);
        }

        res.status(200).json({
            id: Number(data.id), // Number makes it int
            status: data.status,
            closer_id: data.user_id,
            user_reputation: results.newRep
        });
    }

    model.UpdateReportAndReputation(data, callback);
}
