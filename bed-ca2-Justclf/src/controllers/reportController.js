const model = require("../models/reportModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

// Submit a report and award XP
module.exports.submitReport = (req, res, next) => {
    if (!req.body.vulnerability_id) {
        return res.status(400).json({ message: "Vulnerability ID is required" });
    }

    const userId = res.locals.userId;
    const vulnerabilityId = parseInt(req.body.vulnerability_id);

    // Get gameuser first
    const callbackGetGameUser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        // Check if vulnerability exists and get points
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

            // Create the report (without description)
            const reportData = {
                user_id: gameUserId,
                vulnerability_id: vulnerabilityId
            };

            const callbackCreateReport = (error, reportResults) => {
                if (error) {
                    console.error("Error creating report:", error);
                    return res.status(500).json({ message: "Failed to create report" });
                }

                // Update user's XP
                const callbackUpdateXP = (error, updateResults) => {
                    if (error) {
                        console.error("Error updating XP:", error);
                        return res.status(500).json({ message: "Report created but failed to update XP" });
                    }

                    // Get updated user data to return new XP total
                    const callbackGetUpdatedUser = (error, updatedUserResults) => {
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
                            new_xp: newXP
                        });
                    };

                    gameUserModel.selectById({ id: gameUserId }, callbackGetUpdatedUser);
                };

                // Award XP to the user
                model.awardXP({ id: gameUserId, xp_amount: xpReward }, callbackUpdateXP);
            };

            model.createReport(reportData, callbackCreateReport);
        };

        model.getVulnerabilityById({ id: vulnerabilityId }, callbackCheckVuln);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};

// Get user's reports
module.exports.getUserReports = (req, res, next) => {
    const userId = res.locals.userId;

    // First get the gameuser ID
    const callbackGetGameUser = (error, results) => {
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

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};