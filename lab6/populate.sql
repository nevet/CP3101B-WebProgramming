-- Table USER
DROP TABLE USERS;
CREATE TABLE USERS (
  USER_ID INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  SESSION_ID VARCHAR(30),
  USER_NAME VARCHAR(10),
  USER_PASSWD VARCHAR(10)
);

-- Table PUZZLE
DROP TABLE PUZZLES;
CREATE TABLE PUZZLES (
  PUZZLE_ID INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  MAP VARCHAR(25),
  BESTCOUNT INTEGER,
  SOLUTION VARCHAR(30),
  USER_BESTCOUNT INTEGER,
  USER_BESTTIME FLOAT,
  PLAYED_TIMES INTEGER,
  AVG_STEP INTEGER,
  AVG_TIME FLOAT
);

-- Table RECORD
DROP TABLE RECORDS;
CREATE TABLE RECORDS (
  RECORD_ID INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  PUZZLE_ID INTEGER,
  USER_ID INTEGER,
  TIME FLOAT,
  STEP INTEGER,
  FOREIGN KEY (PUZZLE_ID) REFERENCES PUZZLES(PUZZLE_ID),
  FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
);