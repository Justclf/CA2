const pool = require("../services/db");

const SQLSTATEMENT = `
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS Vulnerability;

DROP TABLE IF EXISTS Report;

CREATE TABLE User (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE, 
reputation INT DEFAULT 0
);

INSERT INTO User (username, reputation)
VALUES
("Bob", 0);

CREATE TABLE Vulnerability (
id INT AUTO_INCREMENT PRIMARY KEY,
type TEXT NOT NULL,
description TEXT NOT NULL,
points INT NOT NULL
);

INSERT INTO Vulnerability (type, description, points)
VALUES
("XSS", "Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages", 50),
("SQL Injection", "SQL Injection allows attackers to manipulate a web application's database by injecting malicious SQL code through input fields", 100),
("CSRF", "Cross-Site Request Forgery (CSRF) security vulnerability tricks authenticated users into performing unwanted actions on a web application.", 80),
("Open Redirect", "Open Redirect occurs when a web application allows users to control the URL to which they are redirected, potentially leading to phishing attacks or malware distribution", 20);


CREATE TABLE Report (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
vulnerability_id INT NOT NULL,
status BOOLEAN NOT NULL DEFAULT 0 -- 0 for Open, 1 for Closed
);

-- Section B
DROP TABLE IF EXISTS QuestStart;
DROP TABLE IF EXISTS QuestCompletion;
DROP TABLE IF EXISTS GameUser;
DROP TABLE IF EXISTS Quests;

SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE GameUser (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
username VARCHAR(255) NOT NULL UNIQUE,
XP INT NOT NULL DEFAULT 0,
user_rank VARCHAR(20) NOT NULL DEFAULT "E-Hunter",
FOREIGN KEY (user_id) REFERENCES User(id)
);


INSERT INTO GameUser (user_id, username, user_rank)
VALUES
(1, "SJW", "E-Hunter");


CREATE TABLE Quests (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(100) NOT NULL UNIQUE,
description VARCHAR(255) NOT NULL,
xp_reward INT NOT NULL,
recommended_rank VARCHAR(20) NOT NULL
);

INSERT INTO Quests (title, description, xp_reward, recommended_rank)
VALUES
("Fix the codes", "There's an error in the codes, find it", 10, "E-Rank"),
("Find the vulnerability", "A certain code is causing problems to the server", 50, "D-Rank");


CREATE TABLE QuestStart (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL, 
quest_id INT NOT NULL,
started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE KEY uq_user_quest (user_id, quest_id),
FOREIGN KEY (user_id) REFERENCES GameUser(id),
FOREIGN KEY (quest_id) REFERENCES Quests(id)
);



CREATE TABLE QuestCompletion (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
quest_id INT NOT NULL,
completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE KEY uq_user_complete (user_id, quest_id),
FOREIGN KEY (user_id)  REFERENCES GameUser(id),
FOREIGN KEY (quest_id) REFERENCES Quests(id)
);
`;


pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully:", results);
  }
  process.exit();
});

