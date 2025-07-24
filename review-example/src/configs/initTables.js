const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS Reviews;

CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_amt INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Reviews (review_amt, user_id) VALUES
  (5, 1),
  (4, 2),  
  (3, 3);
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});
