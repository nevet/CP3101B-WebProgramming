-- Clear Table Auto Increment
DELETE FROM `RECORDS` WHERE 1;
DELETE FROM `PUZZLES` WHERE 1;
DELETE FROM `USERS` WHERE 1;
ALTER TABLE USERS AUTO_INCREMENT = 1;
ALTER TABLE PUZZLES AUTO_INCREMENT = 1;
ALTER TABLE RECORDS AUTO_INCREMENT = 1;