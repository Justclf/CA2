const model = require("../models/reportModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

// submit the report 
module.exports.submitReport = (req, res, next) => {
    if (!req.body.vulnerability_id) {
        return res.status(400).json({ message: "Vulnerability ID is required" });
    }

    if (!req.body.description) {
        return res.status(400).json({ message: "Description is required" });
    }

    const userId = res.locals.userId;
    const vulnerabilityId = parseInt(req.body.vulnerability_id);
    const description = req.body.description;

    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        // check if the vuln exists
        const callbackCheckVuln = (error, vulnResults) => {
            if (error) {
                console.error("Error checking vulnerability:", error);
                return res.status(500).json({ message: "Error checking vulnerability" });
            }

            if (vulnResults.length === 0) {
                return res.status(404).json({ message: "Vulnerability not found" });
            }

            const vulnerability = vulnResults[0];
            const xpReward = vulnerability.points;

            // create the report
            const reportData = {
                user_id: gameUserId,
                vulnerability_id: vulnerabilityId,
                description: description
            };

            
            const callbackCreateReport = (error, reportResults) => {
                if (error) {
                    console.error("Error creating report:", error);
                    return res.status(500).json({ message: "Failed to create report" });
                }

                // update users xp
                const callbackUpdateXP = (error, updateResults) => {
                    if (error) {
                        console.error("Error updating XP:", error);
                        return res.status(500).json({ message: "Report created but failed to update XP" });
                    }

                    // Get updated user data
                    const callbackGetUpdatedUsers = (error, updatedUserResults) => {
                        if (error) {
                            console.error("Error getting updated user:", error);
                            return res.status(500).json({ message: "Report submitted but failed to get updated data" });
                        }
                        const newXP = updatedUserResults[0].XP;
                        res.status(201).json({
                            message: "Report submitted successfully",
                            report_id: reportResults.insertId,
                            vulnerability_type: vulnerability.type,
                            xp_earned: xpReward,
                            new_xp: newXP,
                            description: description
                        });
                    };

                    gameUserModel.selectById({ id: gameUserId }, callbackGetUpdatedUsers);
                };

                model.UpdateReputation({ id: gameUserId, reputation: xpReward }, callbackUpdateXP);
            };

            model.CreateReport(reportData, callbackCreateReport); // ai
        };

        model.GetVulnerabilityById({ id: vulnerabilityId }, callbackCheckVuln);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackgetgameuser);
};

// get the users report
module.exports.getUserReports = (req, res, next) => {
    const userId = res.locals.userId;

    // First get the gameuser ID
    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        const callback = (error, results) => {
            if (error) {
                console.error("Error getting user reports:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results);
        };

        model.getUserReports({ user_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackgetgameuser);
};