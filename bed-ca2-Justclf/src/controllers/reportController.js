const reportModel = require("../models/reportModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

// Get available vulnerabilities (excluding ones user has already reported)
module.exports.getAvailableVulnerabilities = (req, res, next) => {
    const userId = res.locals.userId;

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
                console.error("Error getting available vulnerabilities:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results);
        };

        reportModel.getAvailableVulnerabilities({ user_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};

// Submit a report on a vulnerability
module.exports.submitReport = (req, res, next) => {
    if (!req.body.vulnerability_id) {
        return res.status(400).json({ message: "Vulnerability ID is required" });
    }

    const userId = res.locals.userId;
    const vulnerabilityId = parseInt(req.body.vulnerability_id);

    const callbackGetGameUser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        // Check if user has already reported this vulnerability
        const callbackCheckExisting = (error, existingResults) => {
            if (error) {
                console.error("Error checking existing report:", error);
                return res.status(500).json({ message: "Error checking existing reports" });
            }

            if (existingResults.length > 0) {
                return res.status(400).json({ message: "You have already reported this vulnerability" });
            }

            // Check if the vulnerability exists
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

                // Create the report
                const reportData = {
                    user_id: gameUserId,
                    vulnerability_id: vulnerabilityId
                };

                const callbackCreateReport = (error, reportResults) => {
                    if (error) {
                        console.error("Error creating report:", error);
                        return res.status(500).json({ message: "Failed to create report" });
                    }

                    // Award XP to user
                    const callbackAwardXP = (error, updateResults) => {
                        if (error) {
                            console.error("Error awarding XP:", error);
                            return res.status(500).json({ message: "Report created but failed to award XP" });
                        }

                        // Get updated user data
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

                    reportModel.awardXP({ id: gameUserId, xp_amount: xpReward }, callbackAwardXP);
                };

                reportModel.createReport(reportData, callbackCreateReport);
            };

            reportModel.getVulnerabilityById({ id: vulnerabilityId }, callbackCheckVuln);
        };

        reportModel.checkExistingReport({ user_id: gameUserId, vulnerability_id: vulnerabilityId }, callbackCheckExisting);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};

// Get user's reports
module.exports.getUserReports = (req, res, next) => {
    const userId = res.locals.userId;

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

        reportModel.getUserReports({ user_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};uln = (error, vulnResults) => {
                if (error) {
                    console.error("Error checking vulnerability:", error);
                    return res.status(500).json({ message: "Error checking vulnerability" });
                }

                if (vulnResults.length === 0) {
                    return res.status(404).json({ message: "Vulnerability not found" });
                }

                const vulnerability = vulnResults[0];
                const xpReward = vulnerability.points;

                // Create the report
                const reportData = {
                    user_id: gameUserId,
                    vulnerability_id: vulnerabilityId
                };

                const callbackCreateReport = (error, reportResults) => {
                    if (error) {
                        console.error("Error creating report:", error);
                        return res.status(500).json({ message: "Failed to create report" });
                    }

                    // Award XP to user
                    const callbackAwardXP = (error, updateResults) => {
                        if (error) {
                            console.error("Error awarding XP:", error);
                            return res.status(500).json({ message: "Report created but failed to award XP" });
                        }

                        // Get updated user data
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

                    reportModel.awardXP({ id: gameUserId, xp_amount: xpReward }, callbackAwardXP);
                };

                reportModel.createReport(reportData, callbackCreateReport);
            };

            reportModel.getVulnerabilityById({ id: vulnerabilityId }, callbackCheckVuln);
        };

        reportModel.checkExistingReport({ user_id: gameUserId, vulnerability_id: vulnerabilityId }, callbackCheckExisting);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};

// Get user's reports
module.exports.getUserReports = (req, res, next) => {
    const userId = res.locals.userId;

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

        reportModel.getUserReports({ user_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};