CREATE DATABASE IF NOT EXISTS usersdb;

USE usersdb;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) DEFAULT NULL,
    last_name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    user_password VARCHAR(255) DEFAULT NULL,
    sex VARCHAR(255) DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT UQ_User_Email UNIQUE (email)
);

DELIMITER $$

CREATE PROCEDURE create_and_return 
	(
	    IN first_name VARCHAR(255),
	    IN last_name VARCHAR(255),
	    IN email VARCHAR(255),
	    IN user_password VARCHAR(255),
	    IN sex VARCHAR(255),
	    IN image_url VARCHAR(255)
	)
BEGIN 

INSERT INTO users(first_name, last_name, email, user_password, sex, image_url) VALUES(first_name, last_name, email, user_password, sex, image_url); 

SET @USER_ID = LAST_INSERT_ID();

SELECT * FROM users WHERE id=@USER_ID;

END $$

DELIMITER ;