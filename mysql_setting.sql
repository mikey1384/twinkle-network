# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.14)
# Database: twinkle
# Generation Time: 2016-04-06 13:02:03 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table msg_chatroom_members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_chatroom_members`;

CREATE TABLE `msg_chatroom_members` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `roomid` bigint(100) DEFAULT NULL,
  `userid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table msg_chatrooms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_chatrooms`;

CREATE TABLE `msg_chatrooms` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `roomname` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_chatrooms` WRITE;
/*!40000 ALTER TABLE `msg_chatrooms` DISABLE KEYS */;

INSERT INTO `msg_chatrooms` (`id`, `roomname`)
VALUES
	(2,'General'),
	(3,'Teachers');

/*!40000 ALTER TABLE `msg_chatrooms` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_chats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_chats`;

CREATE TABLE `msg_chats` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `roomid` int(11) DEFAULT NULL,
  `userid` bigint(100) DEFAULT NULL,
  `content` varchar(20000) DEFAULT NULL,
  `timeposted` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_chats` WRITE;
/*!40000 ALTER TABLE `msg_chats` DISABLE KEYS */;

INSERT INTO `msg_chats` (`id`, `roomid`, `userid`, `content`, `timeposted`)
VALUES
	(1,2,5,'leave a message here',1453359810);

/*!40000 ALTER TABLE `msg_chats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_notifications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_notifications`;

CREATE TABLE `msg_notifications` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(100) DEFAULT NULL,
  `content` varchar(5000) DEFAULT NULL,
  `read` tinyint(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_notifications` WRITE;
/*!40000 ALTER TABLE `msg_notifications` DISABLE KEYS */;

INSERT INTO `msg_notifications` (`id`, `userid`, `content`, `read`)
VALUES
	(1,5,'This is notification to mikey teacher',0),
	(2,23,'This is notification to mikey',0),
	(3,5,'This is another notification to mikey teacher',0);

/*!40000 ALTER TABLE `msg_notifications` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `realname` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `usertype` varchar(100) DEFAULT NULL,
  `joindate` int(11) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `sessioncode` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `realname`, `email`, `usertype`, `joindate`, `password`, `sessioncode`)
VALUES
	(1,'GUEST',NULL,NULL,'guest',NULL,NULL,NULL),
	(5,'MIKEY',NULL,'twinkle.mikey@gmail.com','master',NULL,'sha1$a1b4e5d8$1$9d276b32dfd2bd1aeabbde0c7d9f4b40820f16a8','f2a685e71f975c516ede148e576446f4156a2814b0b5f6726fa36b174dc5e793998e2e0ac6506e7e04f316a5b411e668db93c10fa9ea77e740b5d9fb44ec3e86'),
	(205,'TEACHER','Passwordis Password','twinkle.teacher@gmail.com','teacher',1459947370,'sha1$bb97bb36$1$bf37ba395a3a281fe6f60dac9df35700926cc0c2','c103e90ecad7fcbc20c42582a277425fd1fc6ade53b48d7308a7dc440f19e9c8db320f8579a668d66c9392e1d153556539f57e3cd2b161c908a358449668b173'),
	(206,'USER','Passwordis Password',NULL,'user',1459947427,'sha1$7d1504e0$1$853f1b45bbe54f120bdef7a7c187edd992ae8dd3','1baf5e85cec7bd3c3023468ca27de05e5820ea68c98fa4e2081fe202980cd9d8102a8cbe900c9e17a840bd4746dea3af9e902a62432d61a9601b0caced11097f');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_comments`;

CREATE TABLE `vq_comments` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(100) DEFAULT NULL,
  `content` varchar(20000) DEFAULT NULL,
  `timeposted` int(11) DEFAULT NULL,
  `videoid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table vq_commentupvotes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_commentupvotes`;

CREATE TABLE `vq_commentupvotes` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `commentid` bigint(100) DEFAULT NULL,
  `userid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table vq_playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_playlists`;

CREATE TABLE `vq_playlists` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `createdby` bigint(100) DEFAULT NULL,
  `pinned` tinyint(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_playlists` WRITE;
/*!40000 ALTER TABLE `vq_playlists` DISABLE KEYS */;

INSERT INTO `vq_playlists` (`id`, `title`, `description`, `createdby`, `pinned`)
VALUES
	(3,'test','No description',5,1),
	(12,'test2','No description',5,0),
	(13,'test3','No description',5,0),
	(14,'test4','No description',5,0);

/*!40000 ALTER TABLE `vq_playlists` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_playlistvideos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_playlistvideos`;

CREATE TABLE `vq_playlistvideos` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `playlistid` bigint(100) DEFAULT NULL,
  `videoid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_playlistvideos` WRITE;
/*!40000 ALTER TABLE `vq_playlistvideos` DISABLE KEYS */;

INSERT INTO `vq_playlistvideos` (`id`, `playlistid`, `videoid`)
VALUES
	(267,3,233),
	(268,3,234),
	(269,3,235),
	(270,3,236),
	(304,12,236),
	(305,12,235),
	(306,13,236),
	(307,13,235),
	(308,13,234),
	(309,14,236),
	(310,14,235),
	(311,14,234),
	(312,14,233);

/*!40000 ALTER TABLE `vq_playlistvideos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_questions`;

CREATE TABLE `vq_questions` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `videoid` bigint(100) DEFAULT NULL,
  `questiontitle` varchar(2000) DEFAULT NULL,
  `choice1` varchar(2000) DEFAULT NULL,
  `choice2` varchar(2000) DEFAULT NULL,
  `choice3` varchar(2000) DEFAULT NULL,
  `choice4` varchar(2000) DEFAULT NULL,
  `choice5` varchar(2000) DEFAULT NULL,
  `correctchoice` int(11) NOT NULL,
  `createdby` bigint(11) DEFAULT NULL,
  `isdraft` tinyint(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table vq_replies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_replies`;

CREATE TABLE `vq_replies` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `userid` bigint(100) DEFAULT NULL,
  `content` varchar(20000) DEFAULT NULL,
  `timeposted` int(11) DEFAULT NULL,
  `commentid` bigint(100) DEFAULT NULL,
  `videoid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table vq_replyupvotes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_replyupvotes`;

CREATE TABLE `vq_replyupvotes` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `replyid` bigint(100) DEFAULT NULL,
  `userid` bigint(100) DEFAULT NULL,
  `commentid` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table vq_videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_videos`;

CREATE TABLE `vq_videos` (
  `id` bigint(100) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `videocode` varchar(300) DEFAULT NULL,
  `uploader` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_videos` WRITE;
/*!40000 ALTER TABLE `vq_videos` DISABLE KEYS */;

INSERT INTO `vq_videos` (`id`, `title`, `description`, `videocode`, `uploader`)
VALUES
	(233,'test1','test','OFWT4yfPdjo',5),
	(234,'programming','programming related','pvAsqPbz9Ro',5),
	(235,'Thomas Suarez: A 12-year-old app developer','test','Fkd9TWUtFm0',5),
	(236,'tests','No description','GigYWy2UmOY',5),
	(237,'another vid','No description','eIho2S0ZahI',5),
	(238,'yet another ted','No description','P_6vDLq64gE',5);

/*!40000 ALTER TABLE `vq_videos` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
