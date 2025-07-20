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
      DROP TABLE IF EXISTS Pokedex;

      DROP TABLE IF EXISTS Pokemon;

      DROP TABLE IF EXISTS Player;

      DROP TABLE IF EXISTS User;

      DROP TABLE IF EXISTS PlayerUserRel;

      CREATE TABLE Pokemon (
        id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT NOT NULL,
        dex_num INT NOT NULL,
        hp INT,
        atk INT,
        def INT
      );

      CREATE TABLE Pokedex (
        number INT PRIMARY KEY,
        name TEXT NOT NULL,
        type1 TEXT NOT NULL,
        type2 TEXT NOT NULL
      );

      CREATE TABLE Player (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name TEXT NOT NULL,
        level INT NOT NULL,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE PlayerUserRel (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        player_id INT NOT NULL
      );

      CREATE TABLE User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO Pokedex (number, name, type1, type2) VALUES
      (1, 'Bulbasaur', 'Grass', 'Poison'),
      (2, 'Ivysaur', 'Grass', 'Poison'),
      (3, 'Venusaur', 'Grass', 'Poison'),
      (4, 'Charmander', 'Fire', ''),
      (5, 'Charmeleon', 'Fire', ''),
      (6, 'Charizard', 'Fire', 'Flying'),
      (7, 'Squirtle', 'Water', ''),
      (8, 'Wartortle', 'Water', ''),
      (9, 'Blastoise', 'Water', '');

      INSERT INTO Player (name, level) VALUES
      ('Ash', 1),
      ('Misty', 21),
      ('Brock', 30);

      INSERT INTO Pokemon (owner_id, dex_num, hp, atk, def) VALUES
      (1, 4, 100, 5, 6),
      (2, 1, 100, 5, 6),
      (2, 5, 160, 27, 26),
      (2, 9, 200, 52, 55),
      (3, 6, 200, 52, 55),
      (3, 7, 200, 52, 55),
      (3, 8, 200, 52, 55),
      (3, 9, 200, 52, 55),
      (3, 1, 200, 52, 55),
      (3, 2, 200, 52, 55),
      (3, 3, 200, 52, 55);

      INSERT INTO User (username, email, password) VALUES
      ('admin', 'a@a.com', '${hash}');

      INSERT INTO PlayerUserRel (user_id, player_id) VALUES
      (1, 1),
      (1, 2),
      (1, 3);

      SELECT PlayerUserRel.user_id, PlayerUserRel.player_id, User.username, Player.name as character_name, Player.level as character_level, Player.created_on as char_created_on, User.created_on as user_created_on
      FROM PlayerUserRel
      INNER JOIN Player ON PlayerUserRel.player_id = Player.id
      INNER JOIN User ON PlayerUserRel.user_id = User.id;
      `;

    pool.query(SQLSTATEMENT, callback);
  }
});
