const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
      SET FOREIGN_KEY_CHECKS=0;

      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS Vulnerability;
      DROP TABLE IF EXISTS Report;
      DROP TABLE IF EXISTS QuestStart;
      DROP TABLE IF EXISTS QuestCompletion;
      DROP TABLE IF EXISTS GameUser;
      DROP TABLE IF EXISTS Quests;
      DROP TABLE IF EXISTS Reviews;


      CREATE TABLE User (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE, 
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      reputation INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO User (username, email, password, reputation)
      VALUES
      ("Bob", "Bob@bob.com", "${hash}", 0);

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
      status BOOLEAN NOT NULL DEFAULT 0, -- 0 for Open, 1 for Closed
      FOREIGN KEY (user_id) REFERENCES User(id)
      );

      

      CREATE TABLE GameUser (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE,
      XP INT NOT NULL DEFAULT 0,
      user_rank VARCHAR(20) NOT NULL DEFAULT "E-Hunter",
      FOREIGN KEY (user_id) REFERENCES User(id)
      );


      INSERT INTO GameUser (user_id, username, XP, user_rank)
      VALUES
      (1, "Sung Jin Woo", 20000, "S-Hunter");


      CREATE TABLE Quests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR(255) NOT NULL,
      xp_reward INT NOT NULL,
      recommended_rank VARCHAR(20) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

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


      CREATE TABLE Reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rating INT NOT NULL,
      comment TEXT NOT NULL,
      user_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES GameUser(id)
      );


      INSERT INTO Reviews (rating, comment, user_id)
      VALUES
      (5, "Game is lowkey fun. Would reco to my frens", 1),
      (4, "Can be better, maybe can add more features?", 1),
      (5, "Jet2Holiday", 1);



      SET FOREIGN_KEY_CHECKS=1;
      `;
    pool.query(SQLSTATEMENT, callback);
  }
});
