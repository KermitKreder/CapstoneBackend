CREATE DATABASE capstone; /*creation of database*/

USE capstone; /*stepping into the database*/

/*Users table*/
CREATE TABLE Users(
	uid int NOT NULL AUTO_INCREMENT,
    email varchar(320) NOT NULL,
    username varchar(255) NOT NULL,
    u_password varchar(255) NOT NULL,
    pfp varchar(2048),
    PRIMARY KEY (uid)
);

/*Followers table*/
CREATE TABLE Follow(
	follower_id int NOT NULL,
    followee_id int NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES Users(uid),
    FOREIGN KEY (followee_id) REFERENCES Users(uid)
);

/*Post creation table*/
CREATE TABLE Post(
	pid int NOT NULL AUTO_INCREMENT,
	creator_id int NOT NULL,
    image varchar(2048) NOT NULL,
    title varchar(255) NOT NULL,
    content text(1000),
    created_at datetime NOT NULL,
    likes int NOT NULL,
    PRIMARY KEY (pid),
    FOREIGN KEY (creator_id) REFERENCES Users(uid)
);

/*Comment creation table*/
CREATE TABLE Comments(
	commentor_id int NOT NULL,
    post_id int NOT NULL,
    comment_id int NOT NULL AUTO_INCREMENT,
    content text(1000) NOT NULL,
    created_at datetime NOT NULL,
    likes int NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (commentor_id) REFERENCES Users(uid),
    FOREIGN KEY (post_id) REFERENCES Post(pid)
);

/*command to view current tables in the database*/
SHOW TABLES;

/*command to show columns in every table in the database*/
SHOW COLUMNS FROM Users;
SHOW COLUMNS FROM Post;
SHOW COLUMNS FROM Comments;
SHOW COLUMNS FROM Follow;