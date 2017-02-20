# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.14)
# Database: twinkle
# Generation Time: 2017-02-20 14:15:05 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table content_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_categories`;

CREATE TABLE `content_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_categories` WRITE;
/*!40000 ALTER TABLE `content_categories` DISABLE KEYS */;

INSERT INTO `content_categories` (`id`, `label`)
VALUES
	(1,'Math & Science'),
	(2,'History & Literature'),
	(3,'Coding & Technology'),
	(4,'Learning & Education'),
	(5,'Games & Riddles'),
	(6,'Cool Projects'),
	(7,'Other');

/*!40000 ALTER TABLE `content_categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table content_comment_likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_comment_likes`;

CREATE TABLE `content_comment_likes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_comment_likes` WRITE;
/*!40000 ALTER TABLE `content_comment_likes` DISABLE KEYS */;

INSERT INTO `content_comment_likes` (`id`, `commentId`, `userId`)
VALUES
	(7,2,5),
	(9,28,5),
	(10,67,5),
	(11,66,5),
	(63,5,5),
	(81,NULL,5),
	(90,72,5),
	(96,37,5),
	(100,74,5),
	(105,80,5),
	(106,85,5),
	(145,125,5),
	(148,128,5),
	(149,129,5),
	(151,NULL,5),
	(155,149,205),
	(160,329,205),
	(162,327,205),
	(164,202,205),
	(166,206,205),
	(167,324,205),
	(203,609,5),
	(215,586,5),
	(218,610,5),
	(221,622,5),
	(222,621,5),
	(223,625,205),
	(224,607,5),
	(225,697,5),
	(226,698,5),
	(230,NULL,5),
	(231,696,5),
	(235,722,5),
	(237,731,5),
	(238,751,5),
	(239,755,5),
	(240,756,5),
	(241,756,205),
	(242,755,205),
	(243,755,218),
	(244,756,218),
	(245,775,5),
	(247,847,5),
	(259,857,5),
	(262,853,5),
	(267,883,5),
	(268,884,5),
	(269,915,218),
	(271,915,215),
	(272,1,5),
	(273,901,5),
	(276,900,5),
	(277,905,5),
	(278,912,5),
	(279,914,5),
	(281,981,5),
	(282,920,5),
	(283,980,5),
	(291,985,5),
	(293,990,5),
	(297,992,5),
	(298,991,5),
	(300,993,5),
	(305,998,5),
	(306,999,5),
	(307,1000,5);

/*!40000 ALTER TABLE `content_comment_likes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table content_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_comments`;

CREATE TABLE `content_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `rootType` varchar(11) DEFAULT NULL,
  `rootId` int(11) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4,
  `timeStamp` bigint(11) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `replyId` int(11) DEFAULT NULL,
  `discussionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_comments` WRITE;
/*!40000 ALTER TABLE `content_comments` DISABLE KEYS */;

INSERT INTO `content_comments` (`id`, `userId`, `rootType`, `rootId`, `content`, `timeStamp`, `commentId`, `replyId`, `discussionId`)
VALUES
	(2,5,'video',1,'This is the first comment!',1475587469,NULL,NULL,NULL),
	(586,205,'video',30,'comment number 586',1479792644,NULL,NULL,NULL),
	(593,205,'video',30,'one',1479793901,586,NULL,NULL),
	(594,205,'video',30,'two',1479793904,586,NULL,NULL),
	(595,205,'video',30,'three',1479793907,586,NULL,NULL),
	(596,205,'video',30,'four',1479793946,586,NULL,NULL),
	(597,205,'video',30,'five',1479809439,586,NULL,NULL),
	(598,205,'video',30,'six',1479809442,586,NULL,NULL),
	(599,205,'video',30,'seven',1479809449,586,NULL,NULL),
	(600,205,'video',30,'eight',1479809454,586,NULL,NULL),
	(601,205,'video',30,'nine',1479809457,586,NULL,NULL),
	(602,205,'video',30,'ten',1479809460,586,NULL,NULL),
	(603,205,'video',30,'eleven',1479809463,586,NULL,NULL),
	(604,205,'video',30,'twelve',1479809466,586,NULL,NULL),
	(605,205,'video',30,'test',1479816660,NULL,NULL,16),
	(606,205,'video',30,'one',1479816663,605,NULL,16),
	(607,205,'video',30,'two',1479816672,605,NULL,16),
	(608,205,'video',30,'three',1479816674,605,NULL,16),
	(609,205,'video',30,'four',1479816677,605,NULL,16),
	(610,205,'video',30,'another',1479816691,NULL,NULL,16),
	(619,205,'video',31,'i can play this all day long',1480002885,NULL,NULL,NULL),
	(620,5,'video',31,'tes',1480036622,619,NULL,NULL),
	(621,5,'video',33,'comment',1480038879,NULL,NULL,NULL),
	(622,5,'video',33,'reply',1480038883,621,NULL,NULL),
	(650,205,'video',53,'hi!!',1481032132,NULL,NULL,23),
	(651,205,'video',53,'hey...',1481032144,650,NULL,23),
	(694,5,'video',53,'hello!',1482152339,NULL,NULL,23),
	(695,5,'video',53,'huh???',1482647691,NULL,NULL,25),
	(696,5,'video',53,'yeah',1482647735,NULL,NULL,23),
	(722,5,'video',53,'hello',1483019820,696,NULL,23),
	(723,5,'video',53,'yeah!!',1483019832,696,NULL,23),
	(724,5,'video',53,'hello',1483067113,696,NULL,23),
	(725,5,'video',53,'hello!!',1483067123,696,723,23),
	(726,5,'video',53,'yolo!',1483067143,696,722,23),
	(727,5,'video',53,'hoho!!',1483067154,696,725,23),
	(728,5,'video',53,'what......',1483067539,696,NULL,23),
	(729,5,'video',61,'test',1484803582,NULL,NULL,NULL),
	(730,5,'video',61,'test',1484803584,729,NULL,NULL),
	(731,5,'video',61,'test',1484803593,729,730,NULL),
	(732,5,'video',61,'hi',1484830711,729,730,NULL),
	(733,5,'video',61,'phew',1484830714,729,731,NULL),
	(750,222,'video',65,'fdsaf/?',1484931493,NULL,NULL,NULL),
	(751,222,'video',62,'hi?',1484931532,NULL,NULL,NULL),
	(753,5,'video',61,'test',1485705944,729,732,NULL),
	(754,5,'video',62,'test',1485706265,751,NULL,NULL),
	(755,5,'video',62,'test',1485706630,NULL,NULL,28),
	(756,5,'video',62,'test',1485706633,755,NULL,28),
	(758,5,'video',67,'fdsaf',1485707049,757,NULL,NULL),
	(760,5,'video',67,'fdsaf',1485707068,757,758,NULL),
	(765,5,'video',67,'test',1485707661,NULL,NULL,NULL),
	(766,5,'video',67,'test',1485707663,765,NULL,NULL),
	(767,5,'video',67,'test',1485707667,765,766,NULL),
	(768,5,'video',67,'test',1485707811,765,766,NULL),
	(769,5,'video',67,'test',1485708385,765,NULL,NULL),
	(770,5,'video',67,'test',1485708393,765,766,NULL),
	(771,5,'video',67,'test',1485708558,765,770,NULL),
	(772,5,'video',67,'test',1485708618,765,771,NULL),
	(773,5,'video',67,'testtest',1485708743,765,772,NULL),
	(774,5,'video',67,'testes',1485708747,765,773,NULL),
	(775,5,'video',62,'testes',1485708762,755,756,28),
	(776,5,'video',62,'testes',1485708823,755,756,28),
	(777,5,'video',62,'test',1485709078,755,775,28),
	(778,5,'video',62,'yea it looks right',1485735483,NULL,NULL,29),
	(779,5,'video',68,'this one is easy! ? ',1485827611,NULL,NULL,NULL),
	(780,5,'video',67,'hi there',1485828173,NULL,NULL,30),
	(781,5,'video',67,'hey',1485828180,780,NULL,30),
	(782,5,'video',67,'hihi',1485828639,780,NULL,30),
	(783,5,'video',67,'Where are you from?',1485828652,780,NULL,30),
	(838,5,'video',67,'test',1485865378,780,783,30),
	(839,5,'video',68,'4 replies?',1485865394,779,NULL,NULL),
	(840,5,'video',68,'test1',1485865405,779,839,NULL),
	(841,5,'video',68,'test2',1485865637,779,839,NULL),
	(842,5,'video',68,'test',1485865642,779,840,NULL),
	(843,5,'video',68,'test3',1485865691,779,839,NULL),
	(844,5,'video',68,'tesafds',1485865704,779,839,NULL),
	(847,5,'video',68,'I don`t like it toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo<br><br><a href=\"http://www.twin-kle.com/videos/1239\" target=\"_blank\">http://www.twin-kle.com/videos/1239</a>',1485865767,NULL,NULL,31),
	(848,5,'video',68,'test',1485865769,847,NULL,31),
	(849,5,'video',68,'test',1485865773,847,848,31),
	(850,5,'video',68,'I don`t like it toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',1485865778,847,848,31),
	(851,205,'video',68,'yah<br><br><br><br><br><br><br><br>',1485936386,847,NULL,31),
	(852,205,'video',68,'hello<br><br>hi<br><br><br>hihi',1485936393,847,NULL,31),
	(853,205,'video',68,'hello<br><br><br><br>hihi',1485936409,847,NULL,31),
	(854,205,'video',68,':D',1486028218,847,853,31),
	(855,205,'video',68,'? ',1486028223,847,853,31),
	(856,205,'video',68,'<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>hi',1486045916,847,851,31),
	(857,5,'video',68,'6th',1486047448,779,839,NULL),
	(883,5,'video',68,'This is way too funny ? ',1486162730,779,857,NULL),
	(884,5,'video',68,'<a href=\"http://www.twin-kle.com/videos/1239\"target=\"_blank\">http://www.twin-kle.com/videos/1239</a>',1486252708,779,883,NULL),
	(885,215,'video',68,'awesome ?   how are you?',1486820236,779,884,NULL),
	(886,215,'video',68,'Interesting perspective ?   What do you think could go wrong if he does come to Korea?',1486820360,779,885,NULL),
	(887,205,'video',69,'test?',1486894610,NULL,NULL,NULL),
	(894,205,'video',69,'test',1486895449,887,NULL,NULL),
	(895,205,'video',69,'test',1486895463,887,894,NULL),
	(896,205,'video',69,'go!!',1486895870,887,895,NULL),
	(897,205,'video',69,'test',1486895875,887,894,NULL),
	(898,205,'video',69,'hi',1486895883,887,894,NULL),
	(899,205,'video',69,'hello',1486895888,887,897,NULL),
	(900,5,'video',72,'minecraft:Protection ',1486999768,NULL,NULL,NULL),
	(901,5,'video',72,'welcome ?  this is great!',1487000012,900,NULL,NULL),
	(902,205,'video',72,'hellohello :)',1487036040,900,901,NULL),
	(903,205,'video',72,'ttest',1487036092,900,902,NULL),
	(904,205,'video',72,'test',1487036151,900,903,NULL),
	(905,205,'video',72,'tes',1487036158,900,903,NULL),
	(906,205,'video',72,'hihi ? ',1487036167,900,903,NULL),
	(907,205,'video',72,'? ',1487036171,900,903,NULL),
	(908,205,'video',72,':)hihi ? ',1487036179,900,903,NULL),
	(909,205,'video',72,':)? ',1487036317,900,908,NULL),
	(910,205,'video',72,'hello',1487036383,900,909,NULL),
	(911,205,'video',72,'? ',1487036426,900,910,NULL),
	(912,205,'video',72,'hihi? ',1487036434,900,910,NULL),
	(913,205,'video',72,':)hihi hello! ? ',1487036441,900,910,NULL),
	(914,205,'video',72,'?  hihi ? <br>',1487036452,900,910,NULL),
	(915,205,'video',72,'hi ? <br>',1487039328,900,914,NULL),
	(919,5,'url',47,'Hi there',1487039328,NULL,NULL,NULL),
	(920,5,'url',47,'second comment',1487039328,NULL,NULL,NULL),
	(980,5,'url',47,'reply',1487160396,920,NULL,NULL),
	(981,5,'video',72,'hi back',1487160464,900,915,NULL),
	(985,5,'video',72,'new',1487161110,NULL,NULL,NULL),
	(986,5,'video',72,'well?',1487161830,900,907,NULL),
	(987,5,'video',72,'hi?',1487161835,900,981,NULL),
	(988,5,'video',72,'test',1487161859,985,NULL,NULL),
	(989,5,'video',72,'Try this again',1487161928,NULL,NULL,NULL),
	(990,5,'video',72,'Yes',1487162918,NULL,NULL,32),
	(991,5,'video',73,'comment!',1487168110,NULL,NULL,NULL),
	(992,5,'url',48,'yeah!!',1487168164,NULL,NULL,NULL),
	(993,5,'url',48,'Good work!',1487176382,NULL,NULL,NULL),
	(994,5,'video',73,'Nice',1487176403,991,NULL,NULL),
	(995,5,'video',72,'ho',1487176479,900,906,NULL),
	(996,5,'video',72,'hello4',1487176981,900,902,NULL),
	(997,5,'video',72,'hi',1487177000,900,902,NULL),
	(998,5,'video',72,'sure',1487177644,NULL,NULL,32),
	(999,5,'video',72,'indeed ? ',1487177814,NULL,NULL,32),
	(1000,5,'url',48,'thanks',1487179676,993,NULL,NULL),
	(1001,5,'video',72,'yep',1487181822,999,NULL,32),
	(1003,5,'video',72,'yap',1487182074,999,NULL,32),
	(1022,5,'url',51,'test',1487354880,NULL,NULL,NULL),
	(1023,5,'url',51,'fdsa',1487356122,NULL,NULL,NULL),
	(1024,5,'url',51,'fdas',1487356123,NULL,NULL,NULL),
	(1029,5,'url',51,'fdsafsa',1487359006,1025,NULL,NULL),
	(1031,5,'url',51,'of reply',1487359024,1025,1030,NULL),
	(1033,5,'url',51,'reply',1487375437,1025,NULL,NULL),
	(1037,5,'video',76,'test',1487411101,NULL,NULL,NULL),
	(1038,5,'video',76,'reply',1487411104,1037,NULL,NULL),
	(1039,5,'video',76,'ok',1487411158,1037,1038,NULL),
	(1040,5,'video',76,'yeah',1487411162,1037,NULL,NULL),
	(1041,5,'video',76,'tesin',1487411170,NULL,NULL,NULL),
	(1042,205,'video',76,'testing again',1487411386,1037,NULL,NULL),
	(1043,205,'video',76,'test',1487411389,1037,1040,NULL),
	(1044,205,'video',76,'yeah',1487411393,1037,1039,NULL),
	(1045,205,'video',76,'yes',1487411419,1037,NULL,NULL),
	(1046,205,'video',76,'again',1487411445,1037,1038,NULL),
	(1047,205,'video',76,'ok',1487487121,NULL,NULL,33),
	(1048,205,'video',76,'here',1487487124,1047,NULL,33),
	(1049,205,'video',76,'we',1487487127,1047,NULL,33),
	(1050,205,'video',76,'go',1487487129,1047,NULL,33),
	(1051,205,'video',76,'here',1487487139,1047,1050,33),
	(1052,205,'video',76,'we',1487487143,1047,1050,33),
	(1053,205,'video',76,'yeah',1487489036,1047,1050,33),
	(1054,205,'video',76,'this...',1487489047,1047,1050,33),
	(1055,205,'video',76,'This question was epic! Thanks to you I was able to learn something I didn\'t know\nbefore! Thank you.',1487489075,1047,1050,33),
	(1056,205,'video',76,'yeah!!',1487493185,1037,NULL,NULL),
	(1057,205,'video',76,'hope',1487493211,1047,1050,33),
	(1058,205,'video',76,'not work',1487493234,1047,NULL,33),
	(1059,205,'video',76,'I think he used civil war to mean \"a war between citizens of the same country,\" not\nthe movie Civil War ?  ',1487493947,1047,NULL,33),
	(1060,205,'video',76,'I think he used civil war to mean \"a war between citizens of the same country,\" not\nthe movie Civil War ?  ',1487493955,1047,1050,33);

/*!40000 ALTER TABLE `content_comments` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_comments_after_insert` AFTER INSERT ON `content_comments` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, rootType, contentId, rootId, uploaderId, timeStamp)
VALUES ('comment', NEW.rootType, NEW.id, NEW.rootId, NEW.userId, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_comments_after_delete` AFTER DELETE ON `content_comments` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'comment' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table content_discussions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_discussions`;

CREATE TABLE `content_discussions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 DEFAULT NULL,
  `description` varchar(5000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `rootType` varchar(100) DEFAULT NULL,
  `rootId` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_discussions` WRITE;
/*!40000 ALTER TABLE `content_discussions` DISABLE KEYS */;

INSERT INTO `content_discussions` (`id`, `userId`, `title`, `description`, `rootType`, `rootId`, `timeStamp`)
VALUES
	(1,5,'Trump became a president. What now?','What should we do, now that our worst nightmare has come true?','video',26,1478527794),
	(2,5,'Who is the best hero in Overwatch?',NULL,'video',26,1478527795),
	(3,5,'random question',NULL,'url',3,1478527796),
	(4,205,'The Legend of Zelda Breath of the Wild -  is this game great?','For me this is a little different since the last consoles that I got were all of the gen 6 consoles and after that all I did was PC and built up my retro console game library. The new Zelda is everything that I have wanted them to do with the franchise and I have good faith in how it will turn out.﻿','video',26,1478744578),
	(5,205,'lets build up on this momentum',NULL,'video',26,1478745166),
	(6,205,'how is this test going?',NULL,'video',26,1478745298),
	(7,205,'Is coding easy?','if so, how is it so easy?','video',26,1478745508),
	(8,205,'Is upload feature done?',NULL,'video',26,1478745628),
	(9,205,'is the name showing properly?',NULL,'video',26,1478745712),
	(10,205,'Who is your favorite character in overwatch',NULL,'video',26,1478922204),
	(11,205,'what is the future of overwatch?','overwatch is obviously a great game but can it surpass starcraft?','video',26,1478931544),
	(12,205,'Why does Mark wear same clothes everyday?',NULL,'video',28,1479476174),
	(13,205,'two',NULL,'video',28,1479629539),
	(14,205,'three',NULL,'video',28,1479629542),
	(15,205,'four',NULL,'video',28,1479629544),
	(16,205,'lets see',NULL,'video',30,1479656928),
	(17,205,'let\'s test this!!','Hello world','video',42,1480251298),
	(19,205,'new discussion','random topic','video',45,1480731431),
	(23,205,'this is a new discussion. hellloooo?',NULL,'video',53,1480993102),
	(24,5,'A new debate on teenager brains',NULL,'video',50,1482149033),
	(25,5,'newer discussion','<a href=\"http://www.facebook.com\" target=\"_blank\">www.facebook.com</a> is the best site?','video',53,1482647676),
	(26,5,'newest discussion',NULL,'video',53,1483939500),
	(27,5,'4th discussion',NULL,'video',53,1483939506),
	(28,5,'<hello> www.facebook.com','testsetse  <a href=\"http://www.facebook.com\" target=\"_blank\">www.facebook.com</a>','video',62,1485706351),
	(29,5,'&lt;!DOCTYPE html&gt; is this right?','&lt;!DOCTYPE html&gt; is this right?','video',62,1485734997),
	(30,5,'New discussion. Yay','hello','video',67,1485828167),
	(31,5,'<!DOCTYPE html>','','video',68,1485865764),
	(32,5,'EQ is important','right?','video',72,1487162895),
	(33,205,'Multiple reply to reply please',NULL,'video',76,1487487117),
	(34,5,'Twinkle MC World needs a Show!',NULL,'video',76,1487596383);

/*!40000 ALTER TABLE `content_discussions` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_discussions_after_insert` AFTER INSERT ON `content_discussions` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, rootType, contentId, rootId, uploaderId, timeStamp)
VALUES ('discussion', NEW.rootType, NEW.id, NEW.rootId, NEW.userId, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_discussions_after_delete` AFTER DELETE ON `content_discussions` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'discussion' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table content_url_likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_url_likes`;

CREATE TABLE `content_url_likes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `linkId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `content_url_likes` WRITE;
/*!40000 ALTER TABLE `content_url_likes` DISABLE KEYS */;

INSERT INTO `content_url_likes` (`id`, `linkId`, `userId`)
VALUES
	(1,47,5),
	(2,47,205),
	(3,47,208),
	(4,47,206),
	(6,48,5),
	(7,45,5),
	(9,NULL,5),
	(10,NULL,5),
	(16,51,218),
	(17,51,215),
	(18,NULL,5),
	(20,NULL,5),
	(21,51,5),
	(30,51,205);

/*!40000 ALTER TABLE `content_url_likes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table content_urls
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_urls`;

CREATE TABLE `content_urls` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) CHARACTER SET utf8mb4 DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4,
  `categoryId` int(11) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `uploader` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_urls` WRITE;
/*!40000 ALTER TABLE `content_urls` DISABLE KEYS */;

INSERT INTO `content_urls` (`id`, `title`, `description`, `categoryId`, `content`, `uploader`, `timeStamp`)
VALUES
	(17,'Stack Overflow is great!!',NULL,4,'http://stackoverflow.com/questions/28889826/react-set-focus-on-input-after-render',5,1476360599),
	(18,'Now you can share YouTube videos and web links here! See how I coded it by clicking the link below!',NULL,3,'https://www.livecoding.tv/mikey1384/videos/b0dLA-es6-express-react-redux-programming-14',5,1476361043),
	(19,'Quora is a website where smart people around the world will answer any questions you have',NULL,4,'https://www.quora.com/',5,1476362411),
	(20,'test',NULL,4,'https://www.kickstarter.com/projects/2029950924/holovect-holographic-vector-display',5,1476433709),
	(21,'testestse',NULL,3,'https://auth0.com/blog/auth-with-socket-io/',5,1476433735),
	(22,'YouTube!!',NULL,4,'https://www.youtube.com/',5,1476705232),
	(23,'Difficult decisions',NULL,7,'https://www.youtube.com/watch?v=yac8DQZkhRI',5,1476705278),
	(28,'Final fantasy just link',NULL,5,'https://www.youtube.com/watch?v=YtFt5XpaSbQ',5,1476855751),
	(31,'JS StackOF',NULL,7,'http://stackoverflow.com/questions/33138370/how-to-wire-up-redux-form-bindings-to-the-forms-inputs',5,1476863130),
	(32,'ALF link',NULL,5,'https://www.youtube.com/watch?v=awNjw4x8rMo',5,1476863171),
	(33,'Youtube','No description',7,'https://www.youtube.com/',5,1480038445),
	(37,'Git Tutorial','No description',3,'https://www.atlassian.com/git/tutorials/what-is-version-control',5,1481113860),
	(38,'Cool react package','No description',4,'https://github.com/brigade/react-waypoint',5,1481210225),
	(39,'Web Fundamentals','No description',3,'https://developers.google.com/web/fundamentals/',5,1481972192),
	(40,'World University Rankings ','No description',7,'https://www.timeshighereducation.com/world-university-rankings/2016/world-ranking#!/page/0/length/25/sort_by/rank/sort_order/asc/cols/stats',5,1482412025),
	(41,'test','No description',4,'https://github.com/yannickcr/eslint-plugin-react/issues/553',5,1485705978),
	(42,'instagram','No description',2,'https://www.instagram.com/',5,1486955703),
	(43,'Reddit is an amazing site','No description',6,'https://www.reddit.com/',5,1487060234),
	(44,'Hacker news is the social media for Hackers and Startup founders','No description',3,'https://news.ycombinator.com/',5,1487060278),
	(45,'Amazon Web Service is the cloud server service hosted by Amazon','No description',3,'https://aws.amazon.com/',5,1487060351),
	(46,'Airbnb is the ultimate share house platform','No description',3,'https://www.airbnb.com/',5,1487060418),
	(47,'YCombinator is the best startup accelerator','No description',3,'https://www.ycombinator.com/',5,1487060490),
	(48,'Facebook is the biggest social media site in the world','No description',7,'https://www.facebook.com/',5,1487167035),
	(49,'This is bootstrap','',7,'http://getbootstrap.com/components/',5,1487340734),
	(50,'Don’t feel like writing that essay? Pay an unemployed professor to do it for you','Once upon a time, students wrote essays at university. Now they can hire unemployed profs to do that for them — or at least that\'s what one Montreal-based online service is offering.<br><br>Unemployedprofessors.com connects essay-dreading students with teachers willing to write papers for a fee.<br><br>The tag line says it all: \"So you can play while we make your papers go away.\"<br><br>The site \"unabashedly defends its actions on the grounds that education has already become overly commodified and academia is downsizing the tenure system,\" Karen Seidman wrote for Postmedia News.<br><br>Student-run essay mills aren\'t new, Schubert Laforest, president of the Concordia Student Union, told the National Post, but \"it\'s the first I\'ve heard of professors doing students\' work.\"<br><br>\"It just seems to hinder the academic process. The focus should be on acquiring skills, not trying to get an easy A. But I\'m sure some students will take advantage of it.\"<br><br>Plagiarism software is what drives some students to buy custom-written essays.<br><br>Unemployedprofessors.com explains: \"The whole reason why you\'re using this services is so that your lazy ass doesn\'t itself have to plagiarize. Long answer? We source and cite everything we write on the basis of our long experience of non-plagiarizing. Short answer? No, you\'re not going to get caught unless you do something stupid like tell everyone that you bought an essay.\"<br><br>The problem of cheating isn\'t confined to Montreal or one website. Plagiarism seems to be getting worse.<br><br>As described on the website of turnitin.com, a leading online plagiarism checker: \"We live in a digital culture where norms around copying, reuse and sharing are colliding with core principles of academic integrity.\"<br><br>One professor who works for the service told the National Post that students are told that the purchased essays are not to be used to fulfill an academic requirement.<br><br>According to the terms and conditions on the site, \"Although you own the copyright to the work, and it is completely original, we do not recommend making use of the product to fulfill an academic course requirement. As such, in using your essay, you agree to indemnify, defend, and hold harmless the company for any and all unauthorized use made of any materials available from this website, include any essay that you might purchase from us.\"<br><br>\"This removes the ethical dimension on our side as we have no control over what a client does upon paying for and receiving the project,\" said the anonymous professor.<br><br>\"In fact, it places the ethical burden squarely on the shoulders of the student.\"<br><br>Del Paulhus, a psychology professor at the University of B.C. told the Vancouver Sun that this evolution of plagiarism is hard for professors to catch.<br><br>\"Now it just takes a couple clicks and you have the exact paper you want,\" he said. \"In the past if you copied right out of a journal it looked too good, but now you can order a paper that has typos in it.\"<br><br>In Vancouver, city councillor Kerry Jang is calling for a crackdown on companies selling custom essays to university students following an undercover investigation of \"essay mills\" by CTV News.<br><br>University professors are also pushing to make these sorts of services illegal.<br><br>\"I, like many other faculty members, am outraged by it,\" Simon Fraser University\'s Rob Gordon told CTV News. \"They\'re ripping off the system.\"<br><br>While universities can discipline a student caught cheating, they have no power against the off-campus companies selling the essays.<br><br>Minister of Advanced Education John Yap responded to CTV News in an emailed statement:<br><br>\"Post-secondary institutions are responsible for the academic integrity within their institutions.\"<br><br>If universities can\'t detect the purchased essays, and services like Unemployedprofessors.com aren\'t shut down, what will become of a post-secondary education\'s value?<br><br>Maybe all essays should be written in-class. By hand. No internet allowed.',7,'https://ca.news.yahoo.com/blogs/dailybrew/don-t-feel-writing-essay-pay-unemployed-professor-163714821.html',5,1487344318),
	(51,'React router','<a href=\"http://www.facebook.com\" target=\"_blank\">www.facebook.com</a>',3,'https://github.com/ReactTraining/react-router',5,1487344491);

/*!40000 ALTER TABLE `content_urls` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_urls_after_insert` AFTER INSERT ON `content_urls` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, rootType, contentId, rootId, uploaderId, timeStamp)
VALUES ('url', 'url', NEW.id, NEW.id, NEW.uploader, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_urls_after_delete` AFTER DELETE ON `content_urls` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'url' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table msg_channel_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_channel_info`;

CREATE TABLE `msg_channel_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned DEFAULT NULL,
  `channelId` int(11) unsigned DEFAULT NULL,
  `lastRead` bigint(11) unsigned DEFAULT NULL,
  `channelName` varchar(200) DEFAULT NULL,
  `isHidden` tinyint(11) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_channel_info` WRITE;
/*!40000 ALTER TABLE `msg_channel_info` DISABLE KEYS */;

INSERT INTO `msg_channel_info` (`id`, `userId`, `channelId`, `lastRead`, `channelName`, `isHidden`)
VALUES
	(204,205,199,1486641498,NULL,0),
	(206,5,199,1487166235,'User And charlie?',0),
	(207,5,1,1468849599,NULL,0),
	(237,220,200,1469108618,NULL,0),
	(240,5,201,1486272376,NULL,0),
	(241,218,201,1486133397,NULL,0),
	(242,5,202,1486272349,'It worked :)',0),
	(243,5,203,1486286049,NULL,0),
	(244,218,203,1482758157,NULL,0),
	(246,210,203,1469798537,NULL,0),
	(247,210,202,1469415719,NULL,0),
	(249,221,204,1486365366,NULL,0),
	(250,5,204,1486744600,NULL,0),
	(251,5,205,1486742344,NULL,0),
	(253,218,206,1485706773,NULL,0),
	(256,5,208,1486915163,NULL,0),
	(258,210,208,1470147804,NULL,0),
	(260,5,210,1486310432,NULL,0),
	(261,5,211,1487166242,NULL,0),
	(266,5,213,1486744572,NULL,0),
	(267,209,213,1486607039,NULL,0),
	(268,215,214,1482761769,NULL,0),
	(269,218,215,1482758158,NULL,0),
	(271,208,211,1473585121,NULL,0),
	(272,209,215,1486607034,NULL,0),
	(273,209,214,1470493455,NULL,0),
	(274,208,216,1473585063,NULL,0),
	(276,5,219,1473586213,NULL,0),
	(277,212,220,1473848213,NULL,0),
	(278,5,220,1486742343,NULL,0),
	(280,225,221,1475391391,NULL,0),
	(281,5,221,1487166241,NULL,0),
	(288,227,225,1482139880,NULL,0),
	(289,5,225,1486744570,NULL,0),
	(292,5,228,1486744570,NULL,0),
	(294,5,230,1486915442,NULL,0),
	(295,5,231,1486744571,NULL,0),
	(299,209,216,1486607035,NULL,0),
	(300,215,232,1487583792,NULL,0),
	(301,5,232,1486740313,NULL,0),
	(302,215,233,1482769263,NULL,0),
	(303,NULL,233,1482768776,NULL,0),
	(304,NULL,233,1482768776,NULL,0),
	(305,5,233,1486744574,NULL,0),
	(306,208,233,1482769219,NULL,0),
	(307,215,234,1482769394,NULL,0),
	(308,5,234,1486308786,NULL,0),
	(309,215,235,1482769871,NULL,0),
	(310,5,235,1486744580,NULL,0),
	(311,218,236,1487583641,NULL,0),
	(312,215,236,1487583686,NULL,0),
	(313,5,236,1487166232,NULL,0),
	(314,218,237,1486133356,NULL,0),
	(315,215,237,1486364388,NULL,0),
	(316,5,237,1486365764,NULL,0),
	(317,215,238,1486364388,NULL,0),
	(318,5,238,1487166240,NULL,0),
	(319,218,238,1485356553,NULL,0),
	(323,211,240,1482772883,NULL,0),
	(324,215,240,1482770625,NULL,0),
	(325,208,240,1482770392,NULL,0),
	(329,5,243,1486640662,NULL,0),
	(330,228,243,1486603333,NULL,0),
	(332,208,244,1482772868,NULL,0),
	(333,211,244,1482772938,NULL,0),
	(334,5,244,1486309921,NULL,0),
	(335,211,230,1486365324,NULL,0),
	(339,211,238,1486365320,NULL,0),
	(341,5,246,1486744561,NULL,0),
	(342,222,246,1484932292,NULL,0),
	(343,218,235,1485440316,NULL,0),
	(344,218,233,1484901366,NULL,0),
	(345,218,234,1484901367,NULL,0),
	(346,222,247,1484932298,NULL,0),
	(347,218,247,1485356553,NULL,0),
	(349,5,248,1487166239,NULL,0),
	(350,229,248,1486365124,NULL,0),
	(355,211,250,1485437032,NULL,0),
	(357,218,250,1486080327,NULL,0),
	(358,230,251,1485445806,NULL,0),
	(359,218,251,1485442059,NULL,0),
	(360,230,252,1485445622,NULL,0),
	(399,205,2,1487583659,NULL,0),
	(400,230,2,1485456445,NULL,0),
	(413,208,275,1485497848,NULL,0),
	(414,208,276,1485497894,NULL,0),
	(488,5,2,1487583603,NULL,0),
	(800,NULL,400,1485622505,NULL,0),
	(801,NULL,401,1485622522,NULL,0),
	(802,NULL,402,1485622528,NULL,0),
	(803,205,402,1485622558,NULL,0),
	(804,205,401,1485622558,NULL,0),
	(805,205,400,1485622557,NULL,0),
	(959,218,2,1487583648,NULL,0),
	(963,5,457,1486742346,NULL,0),
	(964,206,457,1485933889,NULL,0),
	(965,221,457,1485933889,NULL,0),
	(1244,218,551,1486080350,NULL,0),
	(1245,5,551,1486742346,NULL,0),
	(1246,222,551,1486080350,NULL,0),
	(1247,211,551,1486080350,NULL,0),
	(1841,216,2,1486364286,NULL,0),
	(1842,5,750,1486738498,NULL,0),
	(1843,216,750,1486364290,NULL,0),
	(1844,5,751,1486915440,NULL,0),
	(1845,218,751,1486654934,NULL,0),
	(1846,209,2,1486607036,NULL,0),
	(1865,5,758,1487166234,NULL,0),
	(1866,205,758,1487583594,NULL,0),
	(1867,218,759,1486741933,NULL,0),
	(1868,205,759,1486641223,NULL,0),
	(1869,205,760,1487415636,NULL,0),
	(1870,216,760,1486641228,NULL,0),
	(1871,206,199,1486641484,NULL,0),
	(1872,218,199,1486741934,NULL,0),
	(1873,205,761,1487415635,NULL,0),
	(1874,215,761,1487583710,NULL,0),
	(1875,205,236,1486945206,NULL,0),
	(1876,205,762,1487583505,NULL,0),
	(1877,208,762,1487564930,NULL,0),
	(1878,211,762,1487564930,NULL,0),
	(1879,231,2,1487584320,NULL,0);

/*!40000 ALTER TABLE `msg_channel_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_channel_members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_channel_members`;

CREATE TABLE `msg_channel_members` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channelId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_channel_members` WRITE;
/*!40000 ALTER TABLE `msg_channel_members` DISABLE KEYS */;

INSERT INTO `msg_channel_members` (`id`, `channelId`, `userId`, `timeStamp`)
VALUES
	(575,199,5,NULL),
	(577,201,5,NULL),
	(578,201,218,NULL),
	(579,202,5,NULL),
	(580,202,210,NULL),
	(581,202,206,NULL),
	(582,203,5,NULL),
	(583,203,206,NULL),
	(584,203,210,NULL),
	(585,203,218,NULL),
	(586,204,221,NULL),
	(587,204,5,NULL),
	(588,205,5,NULL),
	(589,205,219,NULL),
	(590,206,218,NULL),
	(591,206,219,NULL),
	(599,208,5,NULL),
	(600,208,210,NULL),
	(603,210,5,NULL),
	(604,210,206,NULL),
	(605,211,5,NULL),
	(606,211,208,NULL),
	(609,213,209,NULL),
	(610,213,5,NULL),
	(611,214,209,NULL),
	(612,214,215,NULL),
	(613,215,209,NULL),
	(614,215,218,NULL),
	(615,216,209,NULL),
	(616,216,208,NULL),
	(622,220,5,NULL),
	(623,220,212,NULL),
	(624,221,225,NULL),
	(625,221,5,NULL),
	(635,225,5,NULL),
	(636,225,227,NULL),
	(643,228,5,NULL),
	(644,228,227,NULL),
	(645,228,226,NULL),
	(649,230,5,NULL),
	(650,230,211,NULL),
	(651,231,5,NULL),
	(652,231,224,NULL),
	(654,232,215,NULL),
	(655,232,5,NULL),
	(656,233,215,NULL),
	(657,233,218,NULL),
	(658,233,224,NULL),
	(663,233,5,NULL),
	(664,233,208,NULL),
	(665,234,215,NULL),
	(666,234,218,NULL),
	(667,234,224,NULL),
	(668,234,5,NULL),
	(669,235,215,NULL),
	(670,235,218,NULL),
	(671,235,216,NULL),
	(672,235,5,NULL),
	(673,236,215,NULL),
	(674,236,5,NULL),
	(675,236,218,NULL),
	(676,237,215,NULL),
	(677,237,5,NULL),
	(678,237,218,NULL),
	(679,238,218,NULL),
	(680,238,215,NULL),
	(681,238,5,NULL),
	(685,240,208,NULL),
	(686,240,215,NULL),
	(687,240,211,NULL),
	(692,243,228,NULL),
	(693,243,5,NULL),
	(694,244,211,NULL),
	(695,244,5,NULL),
	(696,244,208,NULL),
	(700,238,211,NULL),
	(701,246,222,NULL),
	(702,246,5,NULL),
	(703,247,218,NULL),
	(704,247,222,NULL),
	(705,248,229,NULL),
	(706,248,5,NULL),
	(710,250,218,NULL),
	(711,250,211,NULL),
	(712,251,218,NULL),
	(747,2,0,NULL),
	(1280,457,5,NULL),
	(1281,457,206,NULL),
	(1282,457,221,NULL),
	(1561,551,5,NULL),
	(1563,551,211,NULL),
	(1564,551,222,NULL),
	(2157,750,216,NULL),
	(2158,750,5,NULL),
	(2159,751,218,NULL),
	(2160,751,5,NULL),
	(2179,758,205,NULL),
	(2180,758,5,NULL),
	(2181,759,218,NULL),
	(2182,759,205,NULL),
	(2183,760,205,NULL),
	(2184,760,216,NULL),
	(2185,199,206,NULL),
	(2186,199,218,NULL),
	(2187,761,215,NULL),
	(2188,761,205,NULL),
	(2189,762,205,NULL),
	(2190,762,211,NULL),
	(2191,762,208,NULL);

/*!40000 ALTER TABLE `msg_channel_members` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_channels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_channels`;

CREATE TABLE `msg_channels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `twoPeople` tinyint(11) unsigned DEFAULT '0',
  `channelName` varchar(200) DEFAULT NULL,
  `creator` int(11) unsigned DEFAULT NULL,
  `lastUpdated` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_channels` WRITE;
/*!40000 ALTER TABLE `msg_channels` DISABLE KEYS */;

INSERT INTO `msg_channels` (`id`, `twoPeople`, `channelName`, `creator`, `lastUpdated`)
VALUES
	(2,0,'General',NULL,1487414808),
	(199,0,'User And charlie',5,1486704068),
	(203,0,'Testing!',5,1482758157),
	(204,1,NULL,NULL,1486365512),
	(205,1,NULL,NULL,1486307478),
	(206,1,NULL,NULL,1469604284),
	(208,1,NULL,NULL,1486272382),
	(210,1,NULL,NULL,1470497506),
	(211,1,NULL,NULL,1473585098),
	(213,1,NULL,NULL,1482760700),
	(214,1,NULL,NULL,1470493225),
	(215,1,NULL,NULL,1470493316),
	(216,1,NULL,NULL,1473585063),
	(220,1,NULL,NULL,1486317057),
	(221,1,NULL,NULL,1475391391),
	(225,1,NULL,NULL,1482139737),
	(228,0,'another test',5,1482140217),
	(230,1,NULL,NULL,1486365324),
	(231,1,NULL,NULL,1482220929),
	(232,1,NULL,NULL,1486364779),
	(233,0,'new testing arena',215,1482769219),
	(234,0,'another random house',215,1482769312),
	(235,0,'testotime',215,1482769437),
	(236,0,'start off with mikey',215,1486945215),
	(237,0,'another channel that deserve attention',215,1486133356),
	(238,0,'hello there',215,1482772969),
	(240,0,'hoho',215,1482770393),
	(243,1,NULL,NULL,1486365812),
	(244,0,'hihi',211,1482772869),
	(246,1,NULL,NULL,1484881533),
	(247,1,NULL,NULL,1484901435),
	(248,1,NULL,NULL,1486365124),
	(250,1,NULL,NULL,1485437033),
	(457,0,'hihi',5,1485933890),
	(551,0,'yoyoyo',218,1486080359),
	(750,1,NULL,NULL,1486364291),
	(751,1,NULL,NULL,1486369964),
	(758,1,NULL,NULL,1486944871),
	(759,1,NULL,NULL,1486641194),
	(760,1,NULL,NULL,1486641229),
	(761,1,NULL,NULL,1486820223),
	(762,0,'does channel feature work',205,1487564931);

/*!40000 ALTER TABLE `msg_channels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_chats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_chats`;

CREATE TABLE `msg_chats` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channelId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `timeStamp` bigint(11) unsigned DEFAULT NULL,
  `isNotification` tinyint(11) DEFAULT '0',
  `isSilent` tinyint(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `msg_chats` WRITE;
/*!40000 ALTER TABLE `msg_chats` DISABLE KEYS */;

INSERT INTO `msg_chats` (`id`, `channelId`, `userId`, `content`, `timeStamp`, `isNotification`, `isSilent`)
VALUES
	(1043,198,5,'Created channel \"Antonio and Andrew\"',1469015174,1,0),
	(1044,198,220,'Left the channel',1469015179,1,0),
	(1045,198,5,'Invited antonio to the channel',1469015321,1,0),
	(1046,198,220,'Left the channel',1469015330,1,0),
	(1047,198,5,'Invited antonio to the channel',1469015540,1,0),
	(1048,198,220,'Left the channel',1469015559,1,0),
	(1049,198,5,'Invited antonio to the channel',1469015661,1,0),
	(1050,198,220,'Left the channel',1469015725,1,0),
	(1051,198,5,'Invited antonio to the channel',1469015819,1,0),
	(1052,198,220,'Left the channel',1469015846,1,0),
	(1053,198,5,'Invited antonio to the channel',1469015937,1,0),
	(1054,198,220,'Left the channel',1469015946,1,0),
	(1055,198,5,'Invited antonio to the channel',1469016205,1,0),
	(1056,198,220,'Left the channel',1469016211,1,0),
	(1057,198,5,'Invited antonio to the channel',1469016338,1,0),
	(1058,198,220,'Left the channel',1469016343,1,0),
	(1059,198,5,'Invited antonio to the channel',1469016496,1,0),
	(1060,198,220,'Left the channel',1469016500,1,0),
	(1061,198,5,'Invited antonio to the channel',1469016881,1,0),
	(1062,198,220,'Left the channel',1469016888,1,0),
	(1063,198,5,'Invited antonio to the channel',1469017749,1,0),
	(1064,198,220,'Left the channel',1469017757,1,0),
	(1065,198,5,'Invited antonio to the channel',1469017917,1,0),
	(1066,198,220,'Left the channel',1469017924,1,0),
	(1067,198,5,'Invited antonio to the channel',1469018360,1,0),
	(1068,198,220,'Left the channel',1469018366,1,0),
	(1069,198,5,'Invited antonio to the channel',1469018413,1,0),
	(1070,198,220,'Left the channel',1469018419,1,0),
	(1071,198,5,'Invited antonio to the channel',1469018646,1,0),
	(1072,198,220,'Left the channel',1469018654,1,0),
	(1073,198,5,'Invited antonio to the channel',1469018775,1,0),
	(1074,198,220,'Left the channel',1469018779,1,0),
	(1075,198,5,'Invited antonio to the channel',1469018908,1,0),
	(1076,198,220,'Left the channel',1469018913,1,0),
	(1077,198,5,'Invited antonio to the channel',1469018995,1,0),
	(1078,198,220,'Left the channel',1469019000,1,0),
	(1079,198,5,'Invited antonio to the channel',1469019099,1,0),
	(1080,198,220,'Left the channel',1469019103,1,0),
	(1081,198,5,'Invited antonio to the channel',1469019185,1,0),
	(1082,198,220,'Left the channel',1469019192,1,0),
	(1083,198,5,'Invited antonio to the channel',1469019248,1,0),
	(1084,198,220,'Left the channel',1469019253,1,0),
	(1085,199,5,'Created channel \"Test Channel\"',1469019380,1,0),
	(1086,199,220,'Left the channel',1469019390,1,0),
	(1087,199,5,'Invited antonio to the channel',1469019482,1,0),
	(1088,199,220,'Left the channel',1469019491,1,0),
	(1089,200,220,'hello',1469087884,0,0),
	(1090,2,220,'hey',1469087897,0,0),
	(1091,2,5,'hi',1469087935,0,0),
	(1092,198,5,'Invited antonio to the channel',1469108407,1,0),
	(1093,198,5,'Invited jimmy to the channel',1469111922,1,0),
	(1094,201,5,'yo hear me out',1469113724,0,0),
	(1095,2,5,'hello',1469187985,0,0),
	(1096,2,5,'hi',1469187998,0,0),
	(1097,2,5,'hello',1469188028,0,0),
	(1098,2,5,'hi',1469188030,0,0),
	(1099,2,5,'hello',1469188084,0,0),
	(1100,2,5,'hi',1469188085,0,0),
	(1101,201,5,'wsup',1469188088,0,0),
	(1102,199,5,'hihi',1469188147,0,0),
	(1103,199,5,'another message',1469188213,0,0),
	(1104,199,5,'hello',1469188215,0,0),
	(1105,199,5,'hi',1469188216,0,0),
	(1106,201,5,'whats up',1469188219,0,0),
	(1107,201,218,'hi',1469188236,0,0),
	(1108,201,5,'hello',1469188240,0,0),
	(1109,202,5,'Created channel \"User And Micky\"',1469198523,1,0),
	(1110,201,218,'hey',1469364556,0,0),
	(1111,201,218,'yo',1469365582,0,0),
	(1112,201,5,'hi',1469365815,0,0),
	(1113,201,218,'yo',1469366270,0,0),
	(1114,201,218,'yoyo',1469366406,0,0),
	(1115,203,5,'Created channel \"Testing!\"',1469409014,1,0),
	(1116,203,218,'wow!',1469409036,0,0),
	(1117,203,5,':)',1469409042,0,0),
	(1118,203,5,'hi',1469409047,0,0),
	(1119,203,218,'hello!',1469409055,0,0),
	(1120,203,218,'hi!',1469409067,0,0),
	(1121,203,5,'hello!',1469409078,0,0),
	(1122,203,5,'ehll',1469409231,0,0),
	(1123,203,5,'hi',1469409233,0,0),
	(1124,203,5,'hello',1469409234,0,0),
	(1125,2,5,'one',1469410334,0,0),
	(1126,2,5,'more',1469410334,0,0),
	(1127,2,5,'time',1469410335,0,0),
	(1128,2,5,'for',1469410338,0,0),
	(1129,2,5,'load',1469410339,0,0),
	(1130,2,5,'more',1469410340,0,0),
	(1131,2,5,'button',1469410341,0,0),
	(1132,2,5,'one',1469410348,0,0),
	(1133,2,5,'two',1469410348,0,0),
	(1134,2,5,'three',1469410349,0,0),
	(1135,2,5,'four',1469410351,0,0),
	(1136,2,5,'five',1469410352,0,0),
	(1137,2,5,'six',1469410359,0,0),
	(1138,2,5,'seven',1469410360,0,0),
	(1139,2,5,'eight',1469410361,0,0),
	(1140,2,5,'nine',1469410362,0,0),
	(1141,201,218,'hi',1469411010,0,0),
	(1142,201,5,'hello!',1469411018,0,0),
	(1143,201,5,'hi',1469411026,0,0),
	(1144,201,218,'hihi',1469411031,0,0),
	(1145,201,5,'hello',1469413529,0,0),
	(1146,201,5,'hi',1469413533,0,0),
	(1147,201,5,'hello',1469413540,0,0),
	(1148,199,5,'hello',1469413558,0,0),
	(1149,199,5,'hi',1469413611,0,0),
	(1150,199,5,'hello',1469413720,0,0),
	(1151,199,5,'hi',1469413733,0,0),
	(1152,199,5,'wsup',1469413750,0,0),
	(1153,199,5,'hello',1469413838,0,0),
	(1154,201,5,'marking my message as read all the time',1469414288,0,0),
	(1155,199,5,'hi',1469414298,0,0),
	(1156,199,5,'hello',1469435167,0,0),
	(1157,199,5,'howd',1469435170,0,0),
	(1158,199,218,'howdy',1469435204,0,0),
	(1159,199,5,'yea',1469435213,0,0),
	(1160,199,218,'cool',1469435219,0,0),
	(1161,199,218,'awesome',1469435225,0,0),
	(1162,201,218,'okay',1469435277,0,0),
	(1163,201,5,'testing',1469437514,0,0),
	(1164,201,5,'another test',1469437669,0,0),
	(1165,201,5,'test',1469437750,0,0),
	(1166,201,5,'test',1469437765,0,0),
	(1167,201,5,'another test',1469437776,0,0),
	(1168,201,218,'new test',1469437800,0,0),
	(1169,201,218,'other test',1469437811,0,0),
	(1170,201,218,'hello',1469437819,0,0),
	(1171,201,218,'test',1469437863,0,0),
	(1172,201,5,'test in response',1469437877,0,0),
	(1173,2,221,'hi',1469521496,0,0),
	(1174,204,221,'hello',1469521540,0,0),
	(1175,204,221,'hi',1469521605,0,0),
	(1176,204,5,'hello',1469521862,0,0),
	(1177,205,5,'hello!',1469521878,0,0),
	(1178,205,5,'how are you',1469521881,0,0),
	(1179,205,5,'testing',1469521891,0,0),
	(1180,205,5,'test',1469522065,0,0),
	(1181,205,5,'test',1469522092,0,0),
	(1182,201,5,'test',1469604212,0,0),
	(1183,201,5,'new msg',1469604215,0,0),
	(1184,199,5,'hello world',1469604220,0,0),
	(1185,199,218,'So this is why you need unit testing',1469604248,0,0),
	(1186,199,218,'i c now',1469604254,0,0),
	(1187,201,218,'dang',1469604262,0,0),
	(1188,201,218,'hello world',1469604269,0,0),
	(1189,206,218,'hello jim',1469604284,0,0),
	(1190,201,5,'hihi',1469621279,0,0),
	(1191,201,5,'test',1469621280,0,0),
	(1192,201,5,'one ',1469621282,0,0),
	(1193,201,5,'two ',1469621283,0,0),
	(1194,201,5,'three',1469621284,0,0),
	(1195,199,5,'test',1469621387,0,0),
	(1197,199,5,'two',1469621389,0,0),
	(1198,199,218,'hi',1469623992,0,0),
	(1199,199,218,'hello',1469623993,0,0),
	(1200,199,218,'hi ',1469623994,0,0),
	(1201,199,5,'hello',1469623998,0,0),
	(1202,207,5,'Created channel \"hello world\"',1469632390,1,0),
	(1203,207,5,'Invited helloworld and micky to the channel',1469632610,1,0),
	(1205,199,5,'hello',1469692548,0,0),
	(1206,207,218,'hey',1469753414,0,0),
	(1207,207,218,'hello',1469753444,0,0),
	(1208,201,5,'fdsaf',1469794572,0,0),
	(1209,201,5,'fdsa',1469794572,0,0),
	(1210,201,5,'fdas',1469794573,0,0),
	(1211,201,5,'fdsa',1469794573,0,0),
	(1212,201,5,'fdsa',1469794573,0,0),
	(1213,201,5,'f',1469794574,0,0),
	(1214,201,5,'dsadf',1469794574,0,0),
	(1215,201,5,'ds',1469794574,0,0),
	(1216,201,5,'af',1469794574,0,0),
	(1217,201,5,'dsaf',1469794575,0,0),
	(1218,201,5,'sda',1469794575,0,0),
	(1219,201,5,'fd',1469794575,0,0),
	(1220,201,5,'sa',1469794575,0,0),
	(1221,201,5,'f',1469794575,0,0),
	(1222,201,218,'hey',1469794648,0,0),
	(1223,199,5,'Invited user and jinny to the channel',1469796901,1,0),
	(1224,199,5,'hello',1469798461,0,0),
	(1225,208,5,'hey',1469798468,0,0),
	(1226,208,5,'man',1469798472,0,0),
	(1227,208,5,'please work',1469798474,0,0),
	(1228,208,5,'haha',1469798475,0,0),
	(1229,208,5,'good',1469798478,0,0),
	(1230,208,5,'this is',1469798479,0,0),
	(1231,208,5,'working',1469798481,0,0),
	(1232,208,5,'yay',1469798483,0,0),
	(1233,208,5,'wow',1469798492,0,0),
	(1234,208,210,'good',1469798548,0,0),
	(1235,208,210,'hey',1469798553,0,0),
	(1236,208,210,'yoyo',1469798560,0,0),
	(1237,209,5,'hello',1469798810,0,0),
	(1238,209,5,'world',1469798811,0,0),
	(1239,209,5,'charlie',1469798813,0,0),
	(1240,209,5,'testing',1469798814,0,0),
	(1241,209,5,'hih',1469798823,0,0),
	(1242,210,5,'yo user,',1469799419,0,0),
	(1243,210,5,'hello',1469799421,0,0),
	(1244,210,5,'let\'s work',1469799913,0,0),
	(1245,210,5,'hi',1469799917,0,0),
	(1246,211,5,'hello',1469799927,0,0),
	(1247,211,5,'this is test',1469799931,0,0),
	(1248,211,5,'hi',1469799933,0,0),
	(1249,208,210,'hey',1470017920,0,0),
	(1250,208,210,'yoyo',1470017924,0,0),
	(1251,208,210,'yo',1470017941,0,0),
	(1252,208,210,'yoyo',1470017980,0,0),
	(1253,208,210,'hii',1470018009,0,0),
	(1254,208,210,'hello',1470144397,0,0),
	(1255,208,5,'hi',1470144402,0,0),
	(1256,208,210,'yo',1470144413,0,0),
	(1257,208,210,'hi',1470144520,0,0),
	(1258,208,5,'yo',1470144549,0,0),
	(1259,208,5,'hhi',1470144882,0,0),
	(1260,208,210,'hello',1470144885,0,0),
	(1261,208,210,'yo',1470144886,0,0),
	(1262,208,5,'good',1470144890,0,0),
	(1263,208,5,'this is working',1470144894,0,0),
	(1264,208,210,'yes',1470144902,0,0),
	(1265,208,210,'hopefully this keeps working',1470144907,0,0),
	(1266,208,5,'hey',1470144958,0,0),
	(1267,208,210,'this should work',1470144962,0,0),
	(1268,208,5,'hello',1470147793,0,0),
	(1269,208,5,'hi',1470147797,0,0),
	(1270,208,210,'yeah',1470147804,0,0),
	(1271,212,209,'hey',1470480957,0,0),
	(1272,2,5,'gen',1470482886,0,0),
	(1273,213,209,'yo',1470482893,0,0),
	(1274,213,5,'hey',1470482898,0,0),
	(1275,214,209,'hey',1470493225,0,0),
	(1276,215,209,'yo',1470493316,0,0),
	(1277,216,209,'hey',1470493504,0,0),
	(1278,210,5,'hello',1470497506,0,0),
	(1279,211,208,'yo',1473585034,0,0),
	(1280,216,208,'hi',1473585063,0,0),
	(1281,211,208,'yoyo',1473585070,0,0),
	(1282,211,5,'hihi',1473585098,0,0),
	(1285,220,5,'hello world',1473586299,0,0),
	(1286,220,212,'hi',1473586306,0,0),
	(1287,2,212,'yoyo',1473586605,0,0),
	(1288,204,5,'hi',1473586630,0,0),
	(1289,203,5,'hi',1473586632,0,0),
	(1290,202,5,'hi',1473586633,0,0),
	(1291,2,212,'uafdsa',1473586640,0,0),
	(1292,220,212,'hello',1473661095,0,0),
	(1293,220,5,'ho',1473661107,0,0),
	(1294,220,212,'yoyo',1473661125,0,0),
	(1295,220,212,'to',1473661134,0,0),
	(1296,220,212,'hi',1473661138,0,0),
	(1297,220,212,'hello',1473661163,0,0),
	(1298,220,212,'yo',1473661167,0,0),
	(1299,220,212,'hi',1473661178,0,0),
	(1300,220,212,'wassup',1473661183,0,0),
	(1301,220,5,'nada',1473661193,0,0),
	(1302,220,5,'haha',1473661202,0,0),
	(1303,220,212,'sup',1473661213,0,0),
	(1304,220,212,'cool',1473661215,0,0),
	(1305,220,212,'yoyo',1473848213,0,0),
	(1306,220,5,'fdas',1475136219,0,0),
	(1307,220,5,'fdsa',1475136220,0,0),
	(1308,220,5,'fdas',1475136220,0,0),
	(1309,220,5,'fdas',1475136220,0,0),
	(1310,220,5,'fd',1475136221,0,0),
	(1311,220,5,'as',1475136221,0,0),
	(1312,220,5,'fds',1475136221,0,0),
	(1313,220,5,'afdd',1475136222,0,0),
	(1314,220,5,'a',1475136222,0,0),
	(1315,220,5,'d',1475136222,0,0),
	(1316,220,5,'sf',1475136222,0,0),
	(1317,220,5,'a',1475136222,0,0),
	(1318,204,5,'1',1475136539,0,0),
	(1319,204,5,'2',1475136539,0,0),
	(1320,204,5,'3',1475136540,0,0),
	(1321,204,5,'4',1475136540,0,0),
	(1322,204,5,'5',1475136541,0,0),
	(1323,204,5,'6',1475136541,0,0),
	(1324,204,5,'7',1475136542,0,0),
	(1325,204,5,'8',1475136542,0,0),
	(1326,204,5,'9',1475136543,0,0),
	(1327,204,5,'0',1475136543,0,0),
	(1328,204,5,'11',1475136545,0,0),
	(1329,204,5,'1',1475136546,0,0),
	(1330,204,5,'2',1475136547,0,0),
	(1331,204,5,'3',1475136548,0,0),
	(1332,204,5,'44',1475136560,0,0),
	(1333,204,5,'55',1475136560,0,0),
	(1334,204,5,'66',1475136561,0,0),
	(1335,204,5,'77',1475136562,0,0),
	(1336,204,5,'8',1475136562,0,0),
	(1337,204,5,'88',1475136564,0,0),
	(1338,204,5,'99',1475136565,0,0),
	(1339,204,5,'00',1475136566,0,0),
	(1340,207,5,'1',1475136686,0,0),
	(1341,207,5,'2',1475136687,0,0),
	(1342,207,5,'3',1475136687,0,0),
	(1343,207,5,'4',1475136688,0,0),
	(1344,207,5,'5',1475136688,0,0),
	(1345,207,5,'6',1475136689,0,0),
	(1346,207,5,'7',1475136690,0,0),
	(1347,207,5,'8',1475136691,0,0),
	(1348,207,5,'9',1475136691,0,0),
	(1349,207,5,'10',1475136693,0,0),
	(1350,207,5,'11',1475136694,0,0),
	(1351,207,5,'12',1475136695,0,0),
	(1352,207,5,'13',1475136696,0,0),
	(1353,207,5,'14',1475136696,0,0),
	(1354,207,5,'15',1475136697,0,0),
	(1355,207,5,'16',1475136698,0,0),
	(1356,207,5,'17',1475136699,0,0),
	(1357,207,5,'18',1475136700,0,0),
	(1358,207,5,'19',1475136701,0,0),
	(1359,207,5,'20',1475136702,0,0),
	(1360,207,5,'21',1475136703,0,0),
	(1361,207,5,'22',1475136704,0,0),
	(1362,207,5,'23',1475136705,0,0),
	(1363,207,5,'24',1475136706,0,0),
	(1364,207,5,'25',1475136707,0,0),
	(1365,207,5,'26',1475136708,0,0),
	(1366,207,5,'27',1475136709,0,0),
	(1367,207,5,'28',1475136710,0,0),
	(1368,207,5,'29',1475136711,0,0),
	(1369,207,5,'30',1475136712,0,0),
	(1370,207,5,'31',1475136713,0,0),
	(1371,207,5,'32',1475136714,0,0),
	(1372,207,5,'33',1475136715,0,0),
	(1373,207,5,'34',1475136716,0,0),
	(1374,207,5,'35',1475136717,0,0),
	(1375,207,5,'36',1475136718,0,0),
	(1376,207,5,'37',1475136719,0,0),
	(1377,207,5,'38',1475136720,0,0),
	(1378,207,5,'39',1475136721,0,0),
	(1379,207,5,'40',1475136723,0,0),
	(1380,207,5,'41',1475136724,0,0),
	(1381,207,5,'42',1475136725,0,0),
	(1382,207,5,'43',1475136726,0,0),
	(1383,207,5,'44',1475136726,0,0),
	(1384,207,5,'45',1475136727,0,0),
	(1385,207,5,'46',1475136728,0,0),
	(1386,221,225,'hello',1475388836,0,0),
	(1387,221,225,'yoyo',1475388837,0,0),
	(1388,221,225,'haha',1475388863,0,0),
	(1389,221,225,'yoyo',1475389049,0,0),
	(1390,221,225,'yaya',1475389106,0,0),
	(1391,221,225,'hihi',1475389174,0,0),
	(1392,221,225,'ok',1475389180,0,0),
	(1393,221,225,'why',1475389185,0,0),
	(1394,221,225,'yes',1475389194,0,0),
	(1395,221,225,'hello',1475389229,0,0),
	(1396,221,225,'hi',1475389235,0,0),
	(1397,221,225,'hello',1475389352,0,0),
	(1398,221,225,'haha',1475389729,0,0),
	(1399,221,225,'yoy',1475389829,0,0),
	(1400,221,225,'haha',1475389835,0,0),
	(1401,221,225,'tada',1475389846,0,0),
	(1402,221,225,'aha',1475389848,0,0),
	(1403,221,225,'hello',1475391376,0,0),
	(1404,221,225,'hi',1475391391,0,0),
	(1456,223,5,'hi',1479699464,0,0),
	(1457,223,5,'hello',1479699679,0,0),
	(1458,223,5,'fsdafdsafdsa fds fdsa f fdsjk  asjdkla jkfdsja f jaksl jklsaf jlkfjlk asjfkljas klfjsa lksf jksfal jklfasj lkfaj klsjfdlk jaklf jklfj klsajf',1479700594,0,0),
	(1459,223,5,'super lonfdsafjk fjsaf j fdskl fkls fjsa fkl asfsdafdsafdsa fds fdsa f fdsjk  asjdkla jkfdsja f jaksl jklsaf jlkfjlk asjfkljas klfjsa lksf jksfal jklfasj lkfaj klsjfdlk jaklf jklfj klsajf',1479700932,0,0),
	(1460,223,5,'what do you want to do when you grow up?',1479701120,0,0),
	(1469,209,5,'INSERT INTO noti_feeds (type, contentId, parentContentType, parentContentId, uploaderId, timeStamp) <br>SELECT type, contentId, parentContentType, parentContentId, uploaderId, timeStamp FROM (<br>	SELECT \'comment\' AS type, id AS contentId, \'video\' AS parentContentType, videoId AS parentContentId, userId AS uploaderId, timeStamp <br>	FROM vq_comments <br>	UNION <br>	SELECT \'video\', id, \'video\', id, uploader, timeStamp FROM vq_videos <br>	UNION<br>	SELECT \'url\', id, \'url\', id, uploader, timeStamp FROM content_urls <br>	UNION<br>	SELECT \'discussion\', id, refContentType, refContentId, userId, timeStamp FROM content_discussions <br>	ORDER BY timeStamp<br>) AS data',1481090399,0,0),
	(1470,223,5,'new message',1482138347,0,0),
	(1471,223,5,'hello world',1482138349,0,0),
	(1473,223,5,'hello',1482138383,0,0),
	(1475,223,5,'oh',1482139255,0,0),
	(1476,223,5,'hey',1482139259,0,0),
	(1477,225,5,'hey',1482139737,0,0),
	(1478,227,5,'Created channel \"Profile Pic Test\"',1482139874,1,0),
	(1479,228,5,'Created channel \"another test\"',1482140217,1,0),
	(1480,229,5,'Created channel \"hard work pays off\"',1482140256,1,0),
	(1481,230,5,'yo',1482140271,0,0),
	(1482,231,5,'hey',1482140294,0,0),
	(1483,231,5,'man',1482140295,0,0),
	(1484,231,5,'hello',1482220929,0,0),
	(1485,201,5,'hello',1482321881,0,0),
	(1486,201,5,'hi',1482321883,0,0),
	(1487,201,5,'hi',1482321895,0,0),
	(1488,201,5,'hii',1482321906,0,0),
	(1489,201,5,'hi',1482321928,0,0),
	(1490,201,5,'hi',1482322015,0,0),
	(1491,201,5,'hello',1482322017,0,0),
	(1492,2,5,'yo',1482322024,0,0),
	(1493,229,5,'Invited lowercase to the channel',1482390850,1,0),
	(1494,229,5,'Invited andrew to the channel',1482391597,1,0),
	(1495,229,218,'Left the channel',1482392180,1,0),
	(1497,201,218,'hey',1482758150,0,0),
	(1498,207,218,'wasup',1482758154,0,0),
	(1499,203,218,'hihi',1482758157,0,0),
	(1500,2,209,'hihi',1482760029,0,0),
	(1501,2,209,'hihi',1482760030,0,0),
	(1502,2,209,'hoho',1482760193,0,0),
	(1503,2,209,'hoho',1482760194,0,0),
	(1504,2,209,'this',1482760457,0,0),
	(1505,2,209,'is',1482760458,0,0),
	(1506,2,209,'good',1482760461,0,0),
	(1507,2,209,'haha',1482760479,0,0),
	(1508,213,209,'yo',1482760487,0,0),
	(1509,213,209,'hello',1482760492,0,0),
	(1510,213,209,'yah',1482760691,0,0),
	(1511,213,209,'haha',1482760692,0,0),
	(1512,213,209,'yoyo',1482760700,0,0),
	(1513,2,209,'wsup',1482760705,0,0),
	(1514,232,215,'hello',1482761793,0,0),
	(1515,232,215,'hola',1482761873,0,0),
	(1516,232,215,'yi',1482761942,0,0),
	(1517,232,215,'gugu',1482762214,0,0),
	(1518,233,215,'Created channel \"new testing arena\"',1482768473,1,0),
	(1519,233,215,'hihi',1482768475,0,0),
	(1520,233,215,'hihi',1482768476,0,0),
	(1521,233,215,'Invited mikey to the channel',1482768494,1,0),
	(1522,233,215,'Invited mikey to the channel',1482768716,1,0),
	(1523,233,215,'Invited mikey to the channel',1482768776,1,0),
	(1524,233,215,'Invited mikey to the channel',1482768950,1,0),
	(1525,233,215,'Invited mikey to the channel',1482769020,1,0),
	(1526,233,215,'hi',1482769033,0,0),
	(1527,233,215,'Invited testingsignup to the channel',1482769219,1,0),
	(1528,234,215,'Created channel \"another random house\"',1482769280,1,0),
	(1529,234,215,'fdsa',1482769281,0,0),
	(1530,234,215,'fdsa',1482769281,0,0),
	(1531,234,215,'fdsa',1482769282,0,0),
	(1532,234,215,'Invited mikey to the channel',1482769286,1,0),
	(1533,234,215,'hi',1482769312,0,0),
	(1534,235,215,'Created channel \"testotime\"',1482769422,1,0),
	(1535,235,215,'fdsa',1482769423,0,0),
	(1536,235,215,'fdsa',1482769423,0,0),
	(1537,235,215,'dfsa',1482769424,0,0),
	(1538,235,215,'Invited mikey to the channel',1482769437,1,0),
	(1539,236,215,'Created channel \"start off with mikey\"',1482769885,1,0),
	(1540,236,215,'hi',1482769894,0,0),
	(1541,237,215,'Created channel \"another channel that deserve attention\"',1482770030,1,0),
	(1542,238,215,'Created channel \"hello there\"',1482770058,1,0),
	(1543,238,215,'hi',1482770059,0,0),
	(1544,238,215,'hi',1482770060,0,0),
	(1545,239,215,'Created channel \"hi\"',1482770377,1,0),
	(1546,240,215,'Created channel \"hoho\"',1482770393,1,0),
	(1547,241,228,'hello',1482770656,0,0),
	(1548,242,5,'hey',1482771025,0,0),
	(1549,242,5,'hi',1482771037,0,0),
	(1550,243,228,'hey',1482771172,0,0),
	(1551,243,228,'hi',1482771182,0,0),
	(1552,244,211,'Created channel \"hihi\"',1482772869,1,0),
	(1553,245,5,'Created channel \"hello\"',1482772921,1,0),
	(1554,238,5,'Invited trulynewaccount to the channel',1482772952,1,0),
	(1555,238,211,'what do',1482772969,0,0),
	(1556,245,5,'hi',1484829965,0,0),
	(1557,245,5,'hi',1484830120,0,0),
	(1558,245,5,'test',1484830236,0,0),
	(1559,245,5,'hello',1484830241,0,0),
	(1561,209,5,'hi',1484830486,0,0),
	(1563,209,5,'hi',1484830636,0,0),
	(1564,246,222,'hi',1484881533,0,0),
	(1565,207,222,'hi',1484881538,0,0),
	(1566,247,218,'yo',1484901374,0,0),
	(1567,247,218,'hel',1484901384,0,0),
	(1568,247,222,'hi',1484901391,0,0),
	(1569,207,218,'well',1484901403,0,0),
	(1570,247,218,'hi',1484901411,0,0),
	(1571,207,222,'yeah',1484901417,0,0),
	(1572,247,222,'hi',1484901421,0,0),
	(1573,247,218,'sup',1484901435,0,0),
	(1574,207,218,'hi',1484901439,0,0),
	(1575,248,229,'hey!',1485259354,0,0),
	(1576,2,229,'hi',1485259441,0,0),
	(1577,209,5,'yeah',1485356493,0,0),
	(1578,2,218,'hello',1485356524,0,0),
	(1579,2,218,'yo',1485356532,0,0),
	(1580,2,5,'yeah',1485356544,0,0),
	(1581,249,5,'Created channel \"testing (again)\"',1485359866,1,0),
	(1582,249,5,'haha',1485359868,0,0),
	(1583,249,5,'hi hello',1485359870,0,0),
	(1584,249,5,'hi',1485359871,0,0),
	(1585,209,5,'hi',1485362232,0,0),
	(1587,209,5,'yeah',1485364649,0,0),
	(1588,249,218,'ya',1485401706,0,0),
	(1590,250,218,'hi',1485437033,0,0),
	(1591,251,218,'hey',1485437890,0,0),
	(1592,251,230,'hi',1485437897,0,0),
	(1593,251,218,'hi',1485438512,0,0),
	(1594,251,230,'hello',1485438519,0,0),
	(1596,253,230,'hi',1485445808,0,0),
	(1648,309,5,'hello',1485507916,0,0),
	(1651,312,5,'hello',1485508005,0,0),
	(1655,316,5,'yo',1485513310,0,0),
	(1658,319,5,'hel',1485513407,0,0),
	(1661,322,5,'yo',1485513746,0,0),
	(1664,325,5,'ya',1485513825,0,0),
	(1669,330,5,'ya',1485514805,0,0),
	(1672,333,5,'ya',1485514916,0,0),
	(1675,336,5,'hello',1485515084,0,0),
	(1678,339,5,'hi',1485515403,0,0),
	(1682,342,5,'yo',1485515530,0,0),
	(1691,2,5,'hello',1485517824,0,0),
	(1692,2,5,'world',1485517825,0,0),
	(1693,351,5,'hi',1485517842,0,0),
	(1694,351,5,'yo',1485517853,0,0),
	(1717,207,5,'hi',1485526910,0,0),
	(1718,2,5,'yo',1485526976,0,0),
	(1719,248,5,'wait',1485526983,0,0),
	(1723,373,5,'yo',1485527356,0,0),
	(1724,373,5,'hello',1485527358,0,0),
	(1731,378,5,'hello',1485527503,0,0),
	(1732,378,5,'world',1485527504,0,0),
	(1753,392,5,'hello',1485527855,0,0),
	(1754,392,5,'world',1485527856,0,0),
	(1755,392,5,'hi',1485527858,0,0),
	(2103,207,218,'Invited charlie, trulynewaccount and kate to the channel',1485706788,1,0),
	(2104,457,5,'Created channel \"hihi\"',1485933890,1,0),
	(2111,462,5,'hello',1485998953,0,0),
	(2115,465,5,'hello',1485998991,0,0),
	(2119,468,5,'yo',1485999072,0,0),
	(2123,471,5,'yo',1485999103,0,0),
	(2132,476,5,'yyo',1485999227,0,0),
	(2134,476,5,'hihi',1485999238,0,0),
	(2136,476,5,'ho',1485999247,0,0),
	(2336,201,218,'hello',1486078206,0,0),
	(2337,201,218,'hi',1486078218,0,0),
	(2338,201,218,'hey',1486078258,0,0),
	(2339,201,218,'yo',1486078276,0,0),
	(2340,201,218,'whats up',1486078283,0,0),
	(2341,201,218,'hello',1486078543,0,0),
	(2342,201,218,'hi',1486078569,0,0),
	(2343,201,218,'yo',1486078689,0,0),
	(2344,201,218,'up',1486078695,0,0),
	(2345,201,218,'hello',1486078808,0,0),
	(2346,201,218,'ya',1486079013,0,0),
	(2347,201,218,'hello',1486079188,0,0),
	(2348,201,218,'hi',1486079194,0,0),
	(2349,201,218,'h',1486079197,0,0),
	(2350,201,218,'d',1486079268,0,0),
	(2351,201,218,'hi',1486079274,0,0),
	(2352,201,218,'yo',1486079280,0,0),
	(2353,2,218,'hihi',1486079758,0,0),
	(2354,2,218,'welcome',1486079759,0,0),
	(2355,201,218,'ya',1486079778,0,0),
	(2356,201,218,'hey',1486079779,0,0),
	(2357,2,218,'ho',1486079782,0,0),
	(2358,201,218,'haha',1486079908,0,0),
	(2359,201,218,'ho',1486079909,0,0),
	(2360,201,218,'hehe',1486079921,0,0),
	(2361,201,218,'haha',1486079922,0,0),
	(2362,201,218,'yoyo',1486080314,0,0),
	(2363,201,218,'haha',1486080319,0,0),
	(2364,201,218,'hey',1486080323,0,0),
	(2365,237,218,'mikey',1486080335,0,0),
	(2366,551,218,'Created channel \"yoyoyo\"',1486080351,1,0),
	(2367,551,218,'Left the channel',1486080359,1,0),
	(2368,201,5,'? ',1486110812,0,0),
	(2369,201,5,'? ',1486110817,0,0),
	(2370,201,5,'? ',1486110821,0,0),
	(2371,201,5,':o',1486110826,0,0),
	(2372,201,218,'hi',1486130540,0,0),
	(2373,201,218,'hi',1486130630,0,0),
	(2374,201,218,'hello',1486130705,0,0),
	(2375,201,218,'hi',1486130954,0,0),
	(2376,201,218,'hi',1486131050,0,0),
	(2377,201,218,'hi',1486131195,0,0),
	(2378,201,218,'hi',1486131201,0,0),
	(2379,201,218,'test',1486131255,0,0),
	(2380,201,218,'hi',1486131500,0,0),
	(2381,201,218,'hi',1486131641,0,0),
	(2382,201,218,'jo',1486131803,0,0),
	(2383,201,218,'hi',1486131973,0,0),
	(2384,201,218,'hi',1486132063,0,0),
	(2385,237,218,'hi',1486132327,0,0),
	(2386,237,218,'hi',1486132358,0,0),
	(2387,237,218,'hello',1486132363,0,0),
	(2388,237,218,'hi',1486132418,0,0),
	(2389,237,218,'hi',1486132596,0,0),
	(2390,237,218,'hi',1486132774,0,0),
	(2391,237,218,'hi',1486132840,0,0),
	(2392,201,218,'hi',1486132974,0,0),
	(2393,201,218,'hello',1486132976,0,0),
	(2394,201,218,'hi',1486133014,0,0),
	(2395,201,218,'hi',1486133023,0,0),
	(2396,237,218,'hi',1486133356,0,0),
	(2397,201,218,'yo',1486133366,0,0),
	(2398,201,218,'helel',1486133370,0,0),
	(2399,201,218,'haha',1486133383,0,0),
	(2400,201,218,'yo',1486133397,0,0),
	(2411,2,5,'? ?  hello world',1486162614,0,0),
	(2412,2,5,'? ',1486172841,0,0),
	(2413,2,5,';p',1486172844,0,0),
	(2414,2,5,'? ',1486172849,0,0),
	(2562,208,5,'test',1486272354,0,0),
	(2563,208,5,'test',1486272355,0,0),
	(2564,208,5,'tes',1486272355,0,0),
	(2565,208,5,'tes',1486272356,0,0),
	(2566,208,5,'tes',1486272356,0,0),
	(2567,208,5,'tes',1486272356,0,0),
	(2568,208,5,'tes',1486272357,0,0),
	(2569,208,5,'t',1486272357,0,0),
	(2570,208,5,'test',1486272361,0,0),
	(2571,208,5,'tes',1486272362,0,0),
	(2572,208,5,'tes',1486272362,0,0),
	(2573,208,5,'t',1486272362,0,0),
	(2574,208,5,'est',1486272362,0,0),
	(2575,208,5,'se',1486272362,0,0),
	(2576,208,5,'tes',1486272363,0,0),
	(2577,208,5,'t',1486272363,0,0),
	(2578,208,5,'es',1486272363,0,0),
	(2579,208,5,'tes',1486272363,0,0),
	(2580,208,5,'t',1486272363,0,0),
	(2581,208,5,'se',1486272363,0,0),
	(2582,208,5,'tes',1486272369,0,0),
	(2583,208,5,'tes',1486272369,0,0),
	(2584,208,5,'t',1486272369,0,0),
	(2585,208,5,'est',1486272369,0,0),
	(2586,208,5,'se',1486272370,0,0),
	(2587,208,5,'tse',1486272370,0,0),
	(2588,208,5,'t',1486272370,0,0),
	(2589,208,5,'est',1486272370,0,0),
	(2590,208,5,'se',1486272370,0,0),
	(2591,208,5,'t',1486272371,0,0),
	(2592,208,5,'es',1486272371,0,0),
	(2593,208,5,'tes',1486272371,0,0),
	(2594,208,5,'t',1486272371,0,0),
	(2595,208,5,'te',1486272378,0,0),
	(2596,208,5,'tes',1486272379,0,0),
	(2597,208,5,'tes',1486272379,0,0),
	(2598,208,5,'te',1486272379,0,0),
	(2599,208,5,'st',1486272380,0,0),
	(2600,208,5,'es',1486272380,0,0),
	(2601,208,5,'tes',1486272380,0,0),
	(2602,208,5,'t',1486272380,0,0),
	(2603,208,5,'es',1486272380,0,0),
	(2604,208,5,'tes',1486272381,0,0),
	(2605,208,5,'t',1486272381,0,0),
	(2606,208,5,'se',1486272381,0,0),
	(2607,208,5,'tes',1486272381,0,0),
	(2608,208,5,'t',1486272381,0,0),
	(2609,208,5,'se',1486272381,0,0),
	(2610,208,5,'t',1486272382,0,0),
	(2611,208,5,'est',1486272382,0,0),
	(2760,749,5,'hi',1486286205,0,0),
	(2761,205,5,'hi',1486307478,0,0),
	(2762,2,5,'yoyo',1486309030,0,0),
	(2764,220,5,'(thumb)',1486316740,0,0),
	(2765,220,5,'?  ',1486316770,0,0),
	(2766,220,5,'?  ',1486316828,0,0),
	(2767,220,5,'?  ',1486317057,0,0),
	(2768,750,216,'hi',1486364291,0,0),
	(2769,751,218,'yo',1486364343,0,0),
	(2770,232,215,'yoyo',1486364402,0,0),
	(2771,232,5,'hi',1486364570,0,0),
	(2772,232,5,'hi',1486364701,0,0),
	(2773,232,5,'test',1486364779,0,0),
	(2774,248,229,'hi',1486365124,0,0),
	(2775,230,211,'ya',1486365324,0,0),
	(2776,204,221,'hey',1486365366,0,0),
	(2777,204,5,'hi',1486365512,0,0),
	(2778,236,215,'hihi',1486365778,0,0),
	(2779,243,228,'hello',1486365812,0,0),
	(2780,236,5,'❤️  ',1486368831,0,0),
	(2781,236,5,'❤️  ',1486368834,0,0),
	(2782,751,218,'apple',1486369668,0,0),
	(2783,751,218,'orange',1486369670,0,0),
	(2784,751,218,'pine',1486369671,0,0),
	(2785,751,218,'apple',1486369732,0,0),
	(2786,751,218,'orange',1486369793,0,0),
	(2787,751,218,'pine',1486369794,0,0),
	(2788,751,218,'apple',1486369795,0,0),
	(2789,751,218,'orange',1486369801,0,0),
	(2790,751,218,'apple',1486369944,0,0),
	(2791,751,218,'orange',1486369945,0,0),
	(2792,751,218,'pine',1486369946,0,0),
	(2793,751,218,'apple',1486369947,0,0),
	(2794,751,218,'orange',1486369956,0,0),
	(2795,751,218,'pine',1486369961,0,0),
	(2796,751,218,'apple',1486369964,0,0),
	(2803,236,5,'ok',1486635017,0,0),
	(2806,2,205,'Hello World',1486640648,0,0),
	(2807,758,205,'yo',1486641118,0,0),
	(2808,759,205,'hi',1486641194,0,0),
	(2809,760,205,'hello',1486641229,0,0),
	(2810,199,205,'Invited user to the channel',1486641485,1,0),
	(2811,199,205,'Invited andrew to the channel',1486641499,1,0),
	(2812,199,205,'Left the channel',1486641501,1,0),
	(2813,199,218,'hi',1486654941,0,0),
	(2814,199,5,'test',1486657022,0,0),
	(2815,199,5,'test',1486657085,0,0),
	(2816,199,5,'hi',1486657268,0,0),
	(2817,199,5,'hello',1486657274,0,0),
	(2818,199,5,'test',1486657316,0,0),
	(2819,199,5,'hi',1486657319,0,0),
	(2820,199,5,'well',1486657328,0,0),
	(2821,199,5,'hi',1486657566,0,0),
	(2822,199,5,'hello',1486657568,0,0),
	(2823,199,5,'yeah',1486657666,0,0),
	(2824,199,218,'hi',1486659455,0,0),
	(2825,199,5,'play?',1486659538,0,0),
	(2826,199,218,'yeah!!',1486659594,0,0),
	(2827,199,5,'ok',1486660353,0,0),
	(2828,199,5,'why?',1486660358,0,0),
	(2829,199,5,'&lt;a href=\"http://<a href=\"http://www.facebook.com\" target=\"_blank\">http://www.facebook.com</a>\" target=\"_blank\"&gt;<a href=\"http://www.facebook.com&lt;/a&gt\" target=\"_blank\">www.facebook.com&lt;/a&gt</a>;',1486703944,0,0),
	(2830,199,5,'<a href=\"http://www.facebook.com\" target=\"_blank\">www.facebook.com</a>',1486704068,0,0),
	(2831,761,215,'hi',1486744652,0,0),
	(2832,761,215,'hi',1486744652,0,0),
	(2833,761,215,'hello ?     this is great',1486820223,0,0),
	(2834,758,205,'hi',1486915479,0,0),
	(2835,758,205,'yo',1486915493,0,0),
	(2836,758,205,'hihi',1486915573,0,0),
	(2837,758,205,'ha',1486915954,0,0),
	(2838,758,205,'oh',1486916005,0,0),
	(2839,236,5,'Invited charlie to the channel',1486919545,1,0),
	(2840,236,205,'Left the channel',1486919552,1,0),
	(2841,236,5,'Invited charlie to the channel',1486919587,1,0),
	(2842,236,205,'Left the channel',1486919592,1,0),
	(2843,2,205,'hihi',1486919645,0,0),
	(2844,2,205,'hihi',1486919646,0,0),
	(2845,758,205,'hihi',1486919658,0,0),
	(2846,758,205,'hihi',1486919658,0,0),
	(2847,758,205,'nana',1486944871,0,0),
	(2848,236,5,'Invited charlie to the channel',1486944885,1,0),
	(2849,236,205,'yep',1486944891,0,0),
	(2850,236,205,'Left the channel',1486944899,1,0),
	(2851,236,5,'Invited charlie to the channel',1486945190,1,0),
	(2852,236,5,'yo',1486945197,0,0),
	(2853,236,205,'ya',1486945200,0,0),
	(2854,236,205,'hi',1486945206,0,0),
	(2855,236,205,'Left the channel',1486945215,1,1),
	(2856,2,205,':)',1487035638,0,0),
	(2857,2,205,'hhello world :)',1487035680,0,0),
	(2858,2,205,'?  ',1487035692,0,0),
	(2859,2,205,'test',1487035741,0,0),
	(2860,2,205,'hi',1487035776,0,0),
	(2861,2,205,'hi',1487035825,0,0),
	(2862,2,205,'? ',1487036534,0,0),
	(2863,2,205,'?  hi helllo ? ',1487036576,0,0),
	(2864,2,205,':Protect',1487036583,0,0),
	(2865,2,205,'rotectp? ',1487036589,0,0),
	(2866,2,205,'rotect? ',1487036603,0,0),
	(2867,2,205,'?  is a (cow)',1487036900,0,0),
	(2868,2,205,'(cow)',1487036918,0,0),
	(2869,2,205,'?  smiley is ? ',1487037048,0,0),
	(2870,2,205,':Pis ',1487037085,0,0),
	(2871,2,205,'(cow)',1487037105,0,0),
	(2872,2,205,'? ',1487037773,0,0),
	(2873,2,205,':Protect is ?  good',1487037785,0,0),
	(2874,2,205,'hello world :)',1487037794,0,0),
	(2875,2,205,'? ? ',1487037880,0,0),
	(2876,2,205,'hello ? ',1487037964,0,0),
	(2877,2,205,'?? ',1487037968,0,0),
	(2878,2,205,'? : ? ',1487037974,0,0),
	(2879,2,205,'? ',1487038071,0,0),
	(2880,2,205,'? ? ',1487038074,0,0),
	(2881,2,205,'?  is a cow',1487038091,0,0),
	(2882,2,205,'?  ',1487038098,0,0),
	(2883,2,205,':Protect is a tongue',1487038107,0,0),
	(2884,2,205,'hello ? ',1487038116,0,0),
	(2885,2,205,'hello? ',1487038118,0,0),
	(2886,2,205,':-) ',1487038434,0,0),
	(2887,2,205,'?  ',1487038439,0,0),
	(2888,2,205,':-O is wow',1487038566,0,0),
	(2889,2,205,'? ',1487039100,0,0),
	(2890,2,205,'hello ? ',1487039104,0,0),
	(2891,2,205,'hello ?  my name is mikey ? ',1487039129,0,0),
	(2892,2,205,'hello ?  my name is cow ? ',1487039143,0,0),
	(2893,2,205,':$',1487413495,0,0),
	(2894,2,205,':$',1487413517,0,0),
	(2895,2,205,'? ',1487414805,0,0),
	(2896,2,205,'? ',1487414808,0,0),
	(2897,762,205,'Created channel \"does channel feature work\"',1487564931,1,0);

/*!40000 ALTER TABLE `msg_chats` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `msg_chats_after_insert` AFTER INSERT ON `msg_chats` FOR EACH ROW BEGIN

UPDATE msg_channels SET lastUpdated = NEW.timeStamp WHERE id = NEW.channelId;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table noti_feeds
# ------------------------------------------------------------

DROP TABLE IF EXISTS `noti_feeds`;

CREATE TABLE `noti_feeds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  `rootType` varchar(100) DEFAULT NULL,
  `rootId` int(11) DEFAULT NULL,
  `uploaderId` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `noti_feeds` WRITE;
/*!40000 ALTER TABLE `noti_feeds` DISABLE KEYS */;

INSERT INTO `noti_feeds` (`id`, `type`, `contentId`, `rootType`, `rootId`, `uploaderId`, `timeStamp`)
VALUES
	(2,'video',1,'video',1,5,1475581972),
	(3,'video',2,'video',2,5,1475583781),
	(4,'comment',2,'video',1,5,1475587469),
	(5,'video',4,'video',4,5,1475588062),
	(6,'video',6,'video',6,5,1475793988),
	(7,'video',7,'video',7,5,1475840404),
	(8,'video',9,'video',9,226,1475968575),
	(9,'video',11,'video',11,5,1476355252),
	(10,'video',12,'video',12,5,1476359033),
	(11,'video',13,'video',13,5,1476359194),
	(12,'url',17,'url',17,5,1476360599),
	(13,'url',18,'url',18,5,1476361043),
	(14,'url',19,'url',19,5,1476362411),
	(15,'url',20,'url',20,5,1476433709),
	(16,'url',21,'url',21,5,1476433735),
	(17,'video',15,'video',15,228,1476449749),
	(18,'video',16,'video',16,5,1476450729),
	(19,'url',22,'url',22,5,1476705232),
	(20,'url',23,'url',23,5,1476705278),
	(21,'video',17,'video',17,5,1476705296),
	(22,'video',18,'video',18,5,1476707205),
	(23,'video',19,'video',19,5,1476855734),
	(24,'url',28,'url',28,5,1476855751),
	(25,'url',31,'url',31,5,1476863130),
	(26,'video',20,'video',20,5,1476863153),
	(27,'url',32,'url',32,5,1476863171),
	(28,'video',21,'video',21,5,1476863199),
	(29,'video',22,'video',22,5,1476981236),
	(30,'video',23,'video',23,5,1476981534),
	(31,'video',24,'video',24,205,1478516279),
	(32,'video',25,'video',25,205,1478516340),
	(33,'video',26,'video',26,205,1478527578),
	(34,'discussion',1,'video',26,5,1478527794),
	(35,'video',28,'video',28,205,1478527794),
	(36,'discussion',2,'video',26,5,1478527795),
	(37,'discussion',3,'url',3,5,1478527796),
	(38,'discussion',4,'video',26,205,1478744578),
	(39,'discussion',5,'video',26,205,1478745166),
	(40,'discussion',6,'video',26,205,1478745298),
	(41,'discussion',7,'video',26,205,1478745508),
	(42,'discussion',8,'video',26,205,1478745628),
	(43,'discussion',9,'video',26,205,1478745712),
	(44,'discussion',10,'video',26,205,1478922204),
	(45,'discussion',11,'video',26,205,1478931544),
	(46,'discussion',12,'video',28,205,1479476174),
	(47,'discussion',13,'video',28,205,1479629539),
	(48,'discussion',14,'video',28,205,1479629542),
	(49,'discussion',15,'video',28,205,1479629544),
	(50,'video',30,'video',30,205,1479656788),
	(51,'discussion',16,'video',30,205,1479656928),
	(52,'comment',586,'video',30,205,1479792644),
	(53,'comment',593,'video',30,205,1479793901),
	(54,'comment',594,'video',30,205,1479793904),
	(55,'comment',595,'video',30,205,1479793907),
	(56,'comment',596,'video',30,205,1479793946),
	(57,'comment',597,'video',30,205,1479809439),
	(58,'comment',598,'video',30,205,1479809442),
	(59,'comment',599,'video',30,205,1479809449),
	(60,'comment',600,'video',30,205,1479809454),
	(61,'comment',601,'video',30,205,1479809457),
	(62,'comment',602,'video',30,205,1479809460),
	(63,'comment',603,'video',30,205,1479809463),
	(64,'comment',604,'video',30,205,1479809466),
	(65,'comment',605,'video',30,205,1479816660),
	(66,'comment',606,'video',30,205,1479816663),
	(67,'comment',607,'video',30,205,1479816672),
	(68,'comment',608,'video',30,205,1479816674),
	(69,'comment',609,'video',30,205,1479816677),
	(70,'comment',610,'video',30,205,1479816691),
	(71,'video',31,'video',31,205,1479883967),
	(72,'comment',619,'video',31,205,1480002885),
	(73,'comment',620,'video',31,5,1480036622),
	(74,'url',33,'url',33,5,1480038445),
	(75,'video',33,'video',33,5,1480038567),
	(76,'comment',621,'video',33,5,1480038879),
	(77,'comment',622,'video',33,5,1480038883),
	(78,'video',35,'video',35,205,1480088202),
	(79,'video',36,'video',36,205,1480088311),
	(80,'video',38,'video',38,205,1480088456),
	(81,'video',40,'video',40,205,1480090049),
	(82,'video',41,'video',41,205,1480121023),
	(83,'video',42,'video',42,205,1480121083),
	(85,'discussion',17,'video',42,205,1480251298),
	(89,'video',43,'video',43,205,1480622019),
	(90,'video',45,'video',45,205,1480688893),
	(91,'discussion',19,'video',45,205,1480731431),
	(92,'video',46,'video',46,205,1480734334),
	(128,'video',47,'video',47,205,1480833968),
	(129,'video',48,'video',48,205,1480867325),
	(130,'video',49,'video',49,205,1480900274),
	(131,'video',50,'video',50,205,1480923085),
	(132,'video',51,'video',51,205,1480989488),
	(134,'video',53,'video',53,205,1480989798),
	(139,'discussion',23,'video',53,205,1480993102),
	(163,'comment',650,'video',53,205,1481032132),
	(164,'comment',651,'video',53,205,1481032144),
	(171,'video',54,'video',54,5,1481094754),
	(173,'url',37,'url',37,5,1481113860),
	(174,'url',38,'url',38,5,1481210225),
	(175,'video',55,'video',55,5,1481225097),
	(188,'video',59,'video',59,5,1481275376),
	(189,'video',60,'video',60,5,1481289222),
	(191,'url',39,'url',39,5,1481972192),
	(192,'video',62,'video',62,5,1481975952),
	(202,'discussion',24,'video',50,5,1482149033),
	(230,'comment',694,'video',53,5,1482152339),
	(231,'url',40,'url',40,5,1482412025),
	(234,'video',65,'video',65,5,1482629072),
	(235,'discussion',25,'video',53,5,1482647676),
	(236,'comment',695,'video',53,5,1482647691),
	(237,'comment',696,'video',53,5,1482647735),
	(263,'comment',722,'video',53,5,1483019820),
	(264,'comment',723,'video',53,5,1483019832),
	(265,'comment',724,'video',53,5,1483067113),
	(266,'comment',725,'video',53,5,1483067123),
	(267,'comment',726,'video',53,5,1483067143),
	(268,'comment',727,'video',53,5,1483067154),
	(269,'comment',728,'video',53,5,1483067539),
	(270,'discussion',26,'video',53,5,1483939500),
	(271,'discussion',27,'video',53,5,1483939506),
	(272,'video',66,'video',66,5,1484566484),
	(273,'comment',729,'video',61,5,1484803582),
	(274,'comment',730,'video',61,5,1484803584),
	(275,'comment',731,'video',61,5,1484803593),
	(276,'comment',732,'video',61,5,1484830711),
	(277,'comment',733,'video',61,5,1484830714),
	(294,'comment',750,'video',65,222,1484931493),
	(295,'comment',751,'video',62,222,1484931532),
	(296,'video',67,'video',67,229,1485257393),
	(298,'comment',753,'video',61,5,1485705944),
	(299,'url',41,'url',41,5,1485705978),
	(300,'comment',754,'video',62,5,1485706265),
	(301,'discussion',28,'video',62,5,1485706351),
	(302,'comment',755,'video',62,5,1485706630),
	(303,'comment',756,'video',62,5,1485706633),
	(305,'comment',758,'video',67,5,1485707049),
	(307,'comment',760,'video',67,5,1485707068),
	(312,'comment',765,'video',67,5,1485707661),
	(313,'comment',766,'video',67,5,1485707663),
	(314,'comment',767,'video',67,5,1485707667),
	(315,'comment',768,'video',67,5,1485707811),
	(316,'comment',769,'video',67,5,1485708385),
	(317,'comment',770,'video',67,5,1485708393),
	(318,'comment',771,'video',67,5,1485708558),
	(319,'comment',772,'video',67,5,1485708618),
	(320,'comment',773,'video',67,5,1485708743),
	(321,'comment',774,'video',67,5,1485708747),
	(322,'comment',775,'video',62,5,1485708762),
	(323,'comment',776,'video',62,5,1485708823),
	(324,'comment',777,'video',62,5,1485709078),
	(325,'discussion',29,'video',62,5,1485734997),
	(326,'comment',778,'video',62,5,1485735483),
	(327,'video',68,'video',68,5,1485737188),
	(328,'comment',779,'video',68,5,1485827611),
	(329,'discussion',30,'video',67,5,1485828167),
	(330,'comment',780,'video',67,5,1485828173),
	(331,'comment',781,'video',67,5,1485828180),
	(332,'comment',782,'video',67,5,1485828639),
	(333,'comment',783,'video',67,5,1485828652),
	(388,'comment',838,'video',67,5,1485865378),
	(389,'comment',839,'video',68,5,1485865394),
	(390,'comment',840,'video',68,5,1485865405),
	(391,'comment',841,'video',68,5,1485865637),
	(392,'comment',842,'video',68,5,1485865642),
	(393,'comment',843,'video',68,5,1485865691),
	(394,'comment',844,'video',68,5,1485865704),
	(397,'discussion',31,'video',68,5,1485865764),
	(398,'comment',847,'video',68,5,1485865767),
	(399,'comment',848,'video',68,5,1485865769),
	(400,'comment',849,'video',68,5,1485865773),
	(401,'comment',850,'video',68,5,1485865778),
	(402,'comment',851,'video',68,205,1485936386),
	(403,'comment',852,'video',68,205,1485936393),
	(404,'comment',853,'video',68,205,1485936409),
	(405,'comment',854,'video',68,205,1486028218),
	(406,'comment',855,'video',68,205,1486028223),
	(407,'comment',856,'video',68,205,1486045916),
	(408,'comment',857,'video',68,5,1486047448),
	(434,'comment',883,'video',68,5,1486162730),
	(435,'comment',884,'video',68,5,1486252708),
	(436,'comment',885,'video',68,215,1486820236),
	(437,'comment',886,'video',68,215,1486820360),
	(438,'video',69,'video',69,205,1486893788),
	(439,'comment',887,'video',69,205,1486894610),
	(446,'comment',894,'video',69,205,1486895449),
	(447,'comment',895,'video',69,205,1486895463),
	(448,'comment',896,'video',69,205,1486895870),
	(449,'comment',897,'video',69,205,1486895875),
	(450,'comment',898,'video',69,205,1486895883),
	(451,'comment',899,'video',69,205,1486895888),
	(452,'video',70,'video',70,205,1486897320),
	(453,'video',71,'video',71,205,1486897632),
	(454,'video',72,'video',72,5,1486948339),
	(455,'url',42,'url',42,5,1486955703),
	(456,'comment',900,'video',72,5,1486999768),
	(457,'comment',901,'video',72,5,1487000012),
	(458,'comment',902,'video',72,205,1487036040),
	(459,'comment',903,'video',72,205,1487036092),
	(460,'comment',904,'video',72,205,1487036151),
	(461,'comment',905,'video',72,205,1487036158),
	(462,'comment',906,'video',72,205,1487036167),
	(463,'comment',907,'video',72,205,1487036171),
	(464,'comment',908,'video',72,205,1487036179),
	(465,'comment',909,'video',72,205,1487036317),
	(466,'comment',910,'video',72,205,1487036383),
	(467,'comment',911,'video',72,205,1487036426),
	(468,'comment',912,'video',72,205,1487036434),
	(469,'comment',913,'video',72,205,1487036441),
	(470,'comment',914,'video',72,205,1487036452),
	(471,'comment',915,'video',72,205,1487039328),
	(472,'url',43,'url',43,5,1487060234),
	(473,'url',44,'url',44,5,1487060278),
	(474,'url',45,'url',45,5,1487060351),
	(475,'url',46,'url',46,5,1487060418),
	(476,'url',47,'url',47,5,1487060490),
	(478,'comment',919,'url',47,5,1487039328),
	(479,'comment',920,'url',47,5,1487039328),
	(539,'comment',980,'url',47,5,1487160396),
	(540,'comment',981,'video',72,5,1487160464),
	(544,'comment',985,'video',72,5,1487161110),
	(545,'comment',986,'video',72,5,1487161830),
	(546,'comment',987,'video',72,5,1487161835),
	(547,'comment',988,'video',72,5,1487161859),
	(548,'comment',989,'video',72,5,1487161928),
	(549,'discussion',32,'video',72,5,1487162895),
	(550,'comment',990,'video',72,5,1487162918),
	(551,'video',73,'video',73,5,1487166982),
	(552,'url',48,'url',48,5,1487167035),
	(553,'comment',991,'video',73,5,1487168110),
	(554,'comment',992,'url',48,5,1487168164),
	(555,'comment',993,'url',48,5,1487176382),
	(556,'comment',994,'video',73,5,1487176403),
	(557,'comment',995,'video',72,5,1487176479),
	(558,'comment',996,'video',72,5,1487176981),
	(559,'comment',997,'video',72,5,1487177000),
	(561,'comment',998,'video',72,5,1487177644),
	(562,'comment',999,'video',72,5,1487177814),
	(563,'comment',1000,'url',48,5,1487179676),
	(564,'comment',1001,'video',72,5,1487181822),
	(566,'comment',1003,'video',72,5,1487182074),
	(585,'url',49,'url',49,5,1487340734),
	(586,'video',74,'video',74,5,1487340834),
	(587,'video',75,'video',75,5,1487341136),
	(588,'video',76,'video',76,5,1487341413),
	(589,'url',50,'url',50,5,1487344318),
	(590,'url',51,'url',51,5,1487344491),
	(591,'comment',1022,'url',51,5,1487354880),
	(592,'comment',1023,'url',51,5,1487356122),
	(593,'comment',1024,'url',51,5,1487356123),
	(598,'comment',1029,'url',51,5,1487359006),
	(600,'comment',1031,'url',51,5,1487359024),
	(602,'comment',1033,'url',51,5,1487375437),
	(606,'comment',1037,'video',76,5,1487411101),
	(607,'comment',1038,'video',76,5,1487411104),
	(608,'comment',1039,'video',76,5,1487411158),
	(609,'comment',1040,'video',76,5,1487411162),
	(610,'comment',1041,'video',76,5,1487411170),
	(611,'comment',1042,'video',76,205,1487411386),
	(612,'comment',1043,'video',76,205,1487411389),
	(613,'comment',1044,'video',76,205,1487411393),
	(614,'comment',1045,'video',76,205,1487411419),
	(615,'comment',1046,'video',76,205,1487411445),
	(616,'discussion',33,'video',76,205,1487487117),
	(617,'comment',1047,'video',76,205,1487487121),
	(618,'comment',1048,'video',76,205,1487487124),
	(619,'comment',1049,'video',76,205,1487487127),
	(620,'comment',1050,'video',76,205,1487487129),
	(621,'comment',1051,'video',76,205,1487487139),
	(622,'comment',1052,'video',76,205,1487487143),
	(623,'comment',1053,'video',76,205,1487489036),
	(624,'comment',1054,'video',76,205,1487489047),
	(625,'comment',1055,'video',76,205,1487489075),
	(626,'comment',1056,'video',76,205,1487493185),
	(627,'comment',1057,'video',76,205,1487493211),
	(628,'comment',1058,'video',76,205,1487493234),
	(629,'comment',1059,'video',76,205,1487493947),
	(630,'comment',1060,'video',76,205,1487493955),
	(631,'discussion',34,'video',76,5,1487596383);

/*!40000 ALTER TABLE `noti_feeds` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_groups`;

CREATE TABLE `user_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;

INSERT INTO `user_groups` (`id`, `name`)
VALUES
	(1,'Bumblebees'),
	(2,'Magical Brains'),
	(3,'Rolling Red Wagons'),
	(4,'Shooting Star'),
	(5,'Cookie Run'),
	(6,'Zoo Crew'),
	(7,'Thundercats'),
	(8,'Angry Birds'),
	(9,'Wild Eagles'),
	(10,'Melting Moon'),
	(11,'Pikachu'),
	(12,'Thunderbolts'),
	(13,'Smart Sodas'),
	(14,'Knowledge'),
	(15,'Silly Monkeys'),
	(16,'Frozen');

/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `realName` varchar(200) DEFAULT NULL,
  `class` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `userType` varchar(100) DEFAULT NULL,
  `joinDate` bigint(11) unsigned DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `lastChannelId` int(11) unsigned DEFAULT NULL,
  `profileFirstRow` varchar(200) DEFAULT NULL,
  `profileSecondRow` varchar(200) DEFAULT NULL,
  `profileThirdRow` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `realName`, `class`, `email`, `userType`, `joinDate`, `password`, `lastChannelId`, `profileFirstRow`, `profileSecondRow`, `profileThirdRow`)
VALUES
	(5,'mikey','Mikey Langelo',NULL,'twinkle.mikey@gmail.com','master',NULL,'sha1$a1b4e5d8$1$9d276b32dfd2bd1aeabbde0c7d9f4b40820f16a8',2,'hello i have a youtube channel lollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollollol','my favorite activity is recording (even though im not making videos much), my favorite books are gaming and magic tree house books.I like Minecraft!','i go to gaeil. im now 5th. i like arts. I like talking about facts and theories'),
	(205,'charlie','Charlie Shin',NULL,'twinkle.teacher@gmail.com','teacher',1459947370,'sha1$bb97bb36$1$bf37ba395a3a281fe6f60dac9df35700926cc0c2',2,'This is Miles. I\'m a linguist, which is a kind of scientist who studies languages. I am also a teacher here at Twin.kle.','',''),
	(206,'user','mike Ser',NULL,NULL,'user',1459947427,'sha1$7d1504e0$1$853f1b45bbe54f120bdef7a7c187edd992ae8dd3',NULL,NULL,NULL,NULL),
	(208,'testingsignup','Testing Signup',NULL,'twinkle.contact@gmail.com','teacher',1461661347,'sha1$bd66bf25$1$e7eab82f167ef1ab1fac89b357484d234d600627',211,NULL,NULL,NULL),
	(209,'student','Studious Lee',NULL,'','user',1463215894,'sha1$eaa3076d$1$f20549e534f34cf04fe4a3c7110ab4e959f76825',213,NULL,NULL,NULL),
	(210,'micky','Micky Kim',NULL,'twinkle.teacher@gmail.com','teacher',1463216295,'sha1$f0bf8d2f$1$1b7c86637ad83c47467ed6a532c9f3bff9c9bc2c',208,NULL,NULL,NULL),
	(211,'trulynewaccount','New Teacher',NULL,NULL,'teacher',1463216636,'sha1$d990a2ab$1$37311f327f2bae2a1e97a5f05cd3cd8c6d0bcc5a',230,NULL,NULL,NULL),
	(212,'mikey1384','Test Mikey',NULL,NULL,'teacher',1463375011,'sha1$fccb3959$1$5c769a8b5161fb4f74bfa77bdff0166991b62111',220,NULL,NULL,NULL),
	(214,'lowercase','Case Lower',NULL,'twinkle.andrew@gmail.com','teacher',1463467858,'sha1$739999fa$1$c7f9de1822a227665dcbce493dd45b19ce196701',NULL,NULL,NULL,NULL),
	(215,'tommy','Tommy Lee',NULL,NULL,'master',1463720113,'sha1$45181260$1$79c47e8a461e327eabf5724710beb3cfb51bf12c',232,NULL,NULL,NULL),
	(216,'testoalgobony','Testo Algoboni',NULL,NULL,'master',1465222454,'sha1$0af2b53e$1$bd9920873fb06b463f76d32c44a942a19e5d4fe5',750,NULL,NULL,NULL),
	(217,'newtoken','Token New',NULL,NULL,'user',1465399275,'sha1$a14b53a5$1$1f602cb292419192af2c5a1acb107ed233ff32e2',NULL,NULL,NULL,NULL),
	(218,'andrew','Andrew Park',NULL,'twinkle.andrew@gmail.com','teacher',1466181267,'sha1$a0a00e01$1$7813f8108d1bfed1cf13a6a65c45bd11c5b6135d',2,NULL,NULL,NULL),
	(219,'jimmy','Jimmy Kim',NULL,NULL,'user',1466957452,'sha1$23ccc837$1$60e45a47faef694cbd27456d8d1d21b75015280c',109,NULL,NULL,NULL),
	(221,'jinny','Jinny Lee',NULL,NULL,'user',1469521492,'sha1$ba8569ae$1$0255f65abc764e871be9d8e432a04752bd9a7689',204,NULL,NULL,NULL),
	(222,'helloworld','Hello World',NULL,NULL,'user',1469591201,'sha1$9738233b$1$1fe2c8b44224f41bd9377d1bf6029f7372dcef59',207,NULL,NULL,NULL),
	(223,'kate','Kate Brown',NULL,'twinkle.kate@gmail.com','teacher',1469592069,'sha1$6680a2be$1$9e49f1d6c39cee4793f4bf99a92a4d0a313549fd',NULL,NULL,NULL,NULL),
	(224,'random','Ran Dom',NULL,NULL,'user',1474323175,'sha1$e4294f00$1$e5eb5a445be946a909b349975fd2fb5d274680f1',NULL,NULL,NULL,NULL),
	(225,'sillymonkeyshyejunek','Com Ment',NULL,NULL,'user',1474323219,'sha1$9477a254$1$e023f009caa41a3c2d666cd72d015d08822cbea7',221,NULL,NULL,NULL),
	(226,'sonic','Sonic Shin',NULL,NULL,'user',1475968564,'sha1$9ea15458$1$acd6490023ff2d0e6ccefefdd7bd5639b9799fe5',NULL,NULL,NULL,NULL),
	(227,'profilepictest','ProfilePic Test',NULL,NULL,'user',1482139724,'sha1$85fd692b$1$00a5c18bf502431a841c84c0cec0f5feb6b046c3',227,NULL,NULL,NULL),
	(228,'perry','Perry Penguin',NULL,NULL,'user',1482770650,'sha1$796d2186$1$0615a514a2089c4237fc508a31d1e2e14e27de1b',243,NULL,NULL,NULL),
	(229,'leo1384','Leo Park',NULL,NULL,'user',1485256651,'sha1$5f8b3776$1$1efb19088465827dff1dd03b5b8acadd46047874',248,NULL,NULL,NULL),
	(230,'noma','Noma Lee',NULL,NULL,'user',1485437877,'sha1$5e80861c$1$74964c9b1dbd8d69d9b379c60125387bbfc60375',2,NULL,NULL,NULL),
	(231,'facebook','Face BOOK',NULL,NULL,'user',1487583819,'sha1$9f88203e$1$46a6104963ffb95f6e722ce523d56a1f248d45a2',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_photos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_photos`;

CREATE TABLE `users_photos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `isProfilePic` tinyint(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users_photos` WRITE;
/*!40000 ALTER TABLE `users_photos` DISABLE KEYS */;

INSERT INTO `users_photos` (`id`, `userId`, `isProfilePic`)
VALUES
	(1,5,0),
	(2,5,0),
	(3,5,0),
	(4,5,0),
	(5,5,0),
	(6,5,0),
	(7,205,0),
	(8,205,0),
	(9,205,0),
	(10,5,0),
	(11,5,0),
	(12,5,0),
	(13,218,1),
	(14,5,0),
	(15,5,1),
	(16,205,1);

/*!40000 ALTER TABLE `users_photos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_pinned_playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_pinned_playlists`;

CREATE TABLE `vq_pinned_playlists` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playlistId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_pinned_playlists` WRITE;
/*!40000 ALTER TABLE `vq_pinned_playlists` DISABLE KEYS */;

INSERT INTO `vq_pinned_playlists` (`id`, `playlistId`)
VALUES
	(1,2),
	(2,8),
	(3,4);

/*!40000 ALTER TABLE `vq_pinned_playlists` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_playlists`;

CREATE TABLE `vq_playlists` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `creator` int(11) unsigned DEFAULT NULL,
  `timeStamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_playlists` WRITE;
/*!40000 ALTER TABLE `vq_playlists` DISABLE KEYS */;

INSERT INTO `vq_playlists` (`id`, `title`, `description`, `creator`, `timeStamp`)
VALUES
	(1,'First playlist','No description',5,NULL),
	(2,'twenty three!!','No description',5,NULL),
	(3,'three','No description',5,NULL),
	(4,'forty nine!!','No description',5,NULL),
	(7,'Fifty','No description',5,NULL),
	(8,'Yo!','No description',5,NULL),
	(9,'New playlist without description','',5,NULL);

/*!40000 ALTER TABLE `vq_playlists` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_playlistvideos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_playlistvideos`;

CREATE TABLE `vq_playlistvideos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playlistId` int(11) unsigned DEFAULT NULL,
  `videoId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_playlistvideos` WRITE;
/*!40000 ALTER TABLE `vq_playlistvideos` DISABLE KEYS */;

INSERT INTO `vq_playlistvideos` (`id`, `playlistId`, `videoId`)
VALUES
	(1,1,6),
	(2,1,4),
	(3,1,2),
	(4,1,3),
	(5,1,1),
	(194,3,3),
	(195,3,2),
	(196,3,1),
	(197,3,66),
	(198,3,67),
	(267,4,66),
	(268,4,6),
	(269,4,4),
	(270,4,3),
	(271,4,65),
	(272,4,62),
	(290,2,6),
	(291,2,7),
	(292,2,9),
	(293,2,68),
	(294,2,70),
	(295,7,50),
	(296,7,72),
	(297,7,71),
	(298,7,70),
	(299,7,51),
	(305,8,12),
	(306,8,18),
	(307,8,16),
	(308,8,13),
	(309,9,74),
	(310,9,73),
	(311,9,75),
	(312,9,76);

/*!40000 ALTER TABLE `vq_playlistvideos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_questions`;

CREATE TABLE `vq_questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `videoId` int(11) unsigned DEFAULT NULL,
  `title` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `choice1` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `choice2` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `choice3` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `choice4` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `choice5` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `correctChoice` int(11) unsigned NOT NULL,
  `creator` int(11) unsigned DEFAULT NULL,
  `isDraft` tinyint(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_questions` WRITE;
/*!40000 ALTER TABLE `vq_questions` DISABLE KEYS */;

INSERT INTO `vq_questions` (`id`, `videoId`, `title`, `choice1`, `choice2`, `choice3`, `choice4`, `choice5`, `correctChoice`, `creator`, `isDraft`)
VALUES
	(6,248,'second question','one','two','three',NULL,NULL,2,5,0),
	(7,295,'what is the name of this video game?','friday the 12th','sunday the 13th','a and b',NULL,NULL,2,5,0),
	(10,270,'What is this game?','Assassins Creed','Dark Souls','None of the above',NULL,NULL,3,5,0),
	(11,270,'What is the color of the hoodie this guy is wearing?','blue','black','Somewhere in between.','Stupid question.',NULL,4,5,0),
	(14,260,'first question on unanimous decisions?','first choice','second choice','third choice','fourth choice',NULL,2,5,0),
	(15,260,'second question on ud','first choice!','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.','fifth!',3,5,0),
	(16,260,'The shape of a billiard table is altered by adding small straight edges (one on the top and one on the bottom). Choose the best description of what occurs when a billiard ball is hit.','yes','no',NULL,NULL,NULL,1,5,0),
	(17,260,'holy cow','this game is great.','hello','bird','rabbit',NULL,2,5,0),
	(18,235,'Error!!! Come on','One','Three','four','five',NULL,3,5,0),
	(19,235,'Adding bunch of questions for error','one!!','two!!','three??',NULL,NULL,3,5,0),
	(20,235,'Threee!!!','One','Two','dfafsaf',NULL,NULL,2,5,0),
	(21,309,'test<br><br><br>testetsadf<br>dsfa','fdas','fdsa',NULL,NULL,NULL,1,5,0),
	(22,66,'one','1','2','3',NULL,NULL,2,5,0),
	(23,66,'test2','test','tes2',NULL,NULL,NULL,2,5,0),
	(30,61,'fdsaf','fdsa1','fdsa2','fdsa3','fdsa/??',NULL,4,5,0),
	(31,61,'fdsa','fdsafdsa','fdsaf','fdsa','fdsa',NULL,1,5,0),
	(32,1,'test','fdsa','test','fdsa',NULL,NULL,3,5,0),
	(33,1,'fdsafsa','fdsa','fdsaf',NULL,NULL,NULL,1,5,0),
	(34,72,'Question 1','and','or','are',NULL,NULL,2,5,0),
	(35,72,'Question 2','has','have','had',NULL,NULL,2,5,0);

/*!40000 ALTER TABLE `vq_questions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_video_likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_video_likes`;

CREATE TABLE `vq_video_likes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `videoId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_video_likes` WRITE;
/*!40000 ALTER TABLE `vq_video_likes` DISABLE KEYS */;

INSERT INTO `vq_video_likes` (`id`, `videoId`, `userId`)
VALUES
	(64,241,5),
	(85,270,215),
	(86,270,205),
	(88,271,5),
	(93,240,5),
	(95,260,205),
	(98,235,205),
	(100,238,5),
	(102,283,5),
	(126,285,5),
	(129,288,5),
	(130,242,5),
	(140,290,205),
	(141,293,205),
	(151,298,5),
	(152,289,5),
	(154,295,5),
	(157,273,5),
	(172,291,5),
	(173,260,5),
	(178,287,5),
	(181,293,5),
	(182,284,5),
	(186,235,218),
	(192,302,5),
	(201,235,5),
	(202,307,205),
	(204,270,5),
	(205,309,5),
	(210,299,5),
	(212,3,5),
	(228,6,5),
	(234,18,5),
	(235,26,205),
	(236,31,5),
	(240,33,205),
	(243,42,205),
	(244,53,5),
	(245,60,5),
	(246,60,205),
	(247,68,5),
	(248,72,205),
	(250,72,218),
	(251,4,5),
	(267,48,5),
	(268,72,5),
	(270,73,5);

/*!40000 ALTER TABLE `vq_video_likes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_video_views
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_video_views`;

CREATE TABLE `vq_video_views` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `videoId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_video_views` WRITE;
/*!40000 ALTER TABLE `vq_video_views` DISABLE KEYS */;

INSERT INTO `vq_video_views` (`id`, `videoId`, `userId`, `timeStamp`)
VALUES
	(1,7,NULL,1475926554),
	(2,7,5,1475926566),
	(8,1,5,1475926824),
	(9,1,5,1475926946),
	(10,1,5,1475927066),
	(11,7,5,1475927289),
	(12,7,5,1475927308),
	(13,7,5,1475928717),
	(14,6,5,1475929030),
	(15,6,5,1475929231),
	(16,6,5,1475929246),
	(17,2,5,1475929268),
	(18,7,5,1475929898),
	(19,7,5,1475929957),
	(20,7,5,1475930277),
	(21,7,5,1475966996),
	(22,7,5,1475967001),
	(23,7,5,1475967006),
	(24,7,5,1475997551),
	(25,13,5,1476363007),
	(26,13,5,1476363027),
	(27,13,5,1476363491),
	(28,12,5,1476363509),
	(29,13,5,1476426482),
	(30,13,5,1476428071),
	(31,17,5,1476705301),
	(32,18,5,1476708661),
	(33,17,5,1476709696),
	(34,21,5,1476905811),
	(35,20,5,1476905829),
	(36,22,5,1477028534),
	(51,31,205,1480003642),
	(52,31,205,1480003676),
	(53,31,205,1480003686),
	(54,30,205,1480003699),
	(55,31,205,1480004111),
	(56,30,205,1480004111),
	(57,30,205,1480004139),
	(58,31,5,1480004181),
	(59,30,5,1480004194),
	(60,30,5,1480004199),
	(61,31,5,1480030708),
	(62,31,5,1480031303),
	(63,31,5,1480031451),
	(64,31,5,1480033946),
	(65,31,5,1480034256),
	(66,31,5,1480034270),
	(67,31,5,1480034957),
	(68,31,5,1480035086),
	(69,31,5,1480035729),
	(70,31,5,1480035739),
	(71,31,5,1480036039),
	(72,31,5,1480036054),
	(73,31,5,1480036087),
	(74,31,5,1480036240),
	(75,31,5,1480036253),
	(76,31,5,1480036262),
	(77,31,5,1480036776),
	(78,31,5,1480079977),
	(79,31,5,1480085759),
	(80,36,205,1480089389),
	(81,33,205,1480093216),
	(82,33,205,1480097802),
	(83,43,205,1480121152),
	(84,42,205,1480173592),
	(85,41,205,1480421767),
	(86,43,205,1480646411),
	(87,46,205,1480786021),
	(88,47,205,1480833972),
	(89,48,205,1480867329),
	(90,50,205,1480952089),
	(91,54,5,1481094823),
	(92,55,5,1481225129),
	(93,61,5,1481646502),
	(94,53,5,1481708944),
	(95,50,5,1481708952),
	(96,62,5,1481987429),
	(97,47,5,1482512903),
	(99,53,5,1482675029),
	(100,53,5,1482675050),
	(101,53,5,1482675326),
	(102,53,5,1482675764),
	(103,53,5,1482675766),
	(104,33,5,1482675837),
	(105,33,5,1482675840),
	(106,31,5,1482675867),
	(107,31,5,1482675868),
	(108,53,5,1482675950),
	(109,65,5,1482676204),
	(110,53,5,1482676214),
	(111,65,5,1482680183),
	(112,53,5,1482680378),
	(113,53,5,1482680445),
	(114,53,5,1482680457),
	(115,65,5,1482680465),
	(116,50,5,1482680481),
	(117,50,5,1482680577),
	(118,50,5,1482680989),
	(119,50,5,1482681035),
	(120,53,5,1482681066),
	(121,42,5,1482681084),
	(122,65,5,1482681370),
	(123,53,5,1482683776),
	(124,53,5,1482683782),
	(125,53,5,1482683789),
	(126,33,5,1482710260),
	(127,35,5,1482710299),
	(128,36,5,1482710307),
	(129,38,5,1482710325),
	(130,40,5,1482710592),
	(131,41,5,1482710599),
	(132,53,5,1482710729),
	(133,65,5,1482710841),
	(134,50,5,1482710892),
	(135,50,5,1482710990),
	(136,65,5,1482710996),
	(137,53,5,1482732240),
	(138,65,5,1482732281),
	(139,65,5,1482886903),
	(140,61,5,1482897616),
	(141,6,5,1484407273),
	(142,6,5,1484407322),
	(143,4,5,1484407331),
	(144,2,5,1484407342),
	(145,62,5,1484407370),
	(146,6,5,1484407775),
	(147,6,5,1484407938),
	(148,6,5,1484407968),
	(149,6,5,1484407989),
	(150,6,5,1484407997),
	(151,53,5,1484408004),
	(152,53,5,1484408050),
	(153,53,5,1484408062),
	(154,2,5,1484408073),
	(155,53,5,1484479052),
	(156,53,5,1484479060),
	(157,3,5,1484479077),
	(158,1,5,1484479095),
	(159,66,222,1484930325),
	(160,67,229,1485257396),
	(161,68,5,1485824618),
	(162,68,5,1485827052),
	(163,68,5,1486522180),
	(164,68,5,1486522257),
	(165,68,5,1486522273),
	(166,68,205,1486877714),
	(167,68,205,1486877743),
	(168,68,205,1486877818),
	(169,68,205,1486878143),
	(170,68,205,1486878406),
	(171,68,205,1486878555),
	(172,53,205,1486880058),
	(173,68,205,1486880916),
	(174,68,205,1486880926),
	(175,68,5,1487163430),
	(176,72,5,1487175048),
	(177,73,5,1487175217),
	(178,72,5,1487179717),
	(179,NULL,5,1487323130),
	(180,74,5,1487342177),
	(181,75,205,1487423081),
	(182,76,5,1487597157);

/*!40000 ALTER TABLE `vq_video_views` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_videos`;

CREATE TABLE `vq_videos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4,
  `categoryId` int(11) DEFAULT NULL,
  `content` varchar(300) DEFAULT NULL,
  `uploader` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_videos` WRITE;
/*!40000 ALTER TABLE `vq_videos` DISABLE KEYS */;

INSERT INTO `vq_videos` (`id`, `title`, `description`, `categoryId`, `content`, `uploader`, `timeStamp`)
VALUES
	(1,'Best Plays','No description',NULL,'K8g_OnF-Vuc',5,1475581972),
	(2,'Environmental Kills are Fun','No description',NULL,'2Hm6OL5WaUc',5,1475583781),
	(3,'The Zen Master','No description',NULL,'TquQe7Id9-4',5,NULL),
	(4,'SNES Code Injection -- Flappy Bird in SMW','No description',NULL,'hB6eY73sLV0',5,1475588062),
	(6,'Cause and effect real?','No description',NULL,'3AMCcYnAsdQ',5,1475793988),
	(7,'Blow Your Mind!','No description',NULL,'I31pi-6NgqM',5,1475840404),
	(9,'test','No description',NULL,'OQZKh8Bjdv0',226,1475968575),
	(11,'tests','testa',5,'VXoRbyHmT5E',5,1476355252),
	(12,'Dark Souls Video','',5,'H6hW98hY_bI',5,1476359033),
	(13,'One of my favorite youtubers',NULL,5,'oItZp9NlXNk',5,1476359194),
	(15,'test',NULL,5,'_iE1e_FJ2Fc',228,1476449749),
	(16,'Loserfruit','No description',NULL,'tlKL8sNYb5Y',5,1476450729),
	(17,'Difficult Decisions',NULL,7,'yac8DQZkhRI',5,1476705296),
	(18,'Must watch anime',NULL,7,'1B9E8U3rUww',5,1476707205),
	(19,'Final fantasy',NULL,5,'YtFt5XpaSbQ',5,1476855734),
	(20,'Another LF',NULL,5,'awNjw4x8rMo',5,1476863153),
	(21,'COOL',NULL,2,'PFDzr8xF1sE',5,1476863199),
	(22,'louis ck',NULL,2,'kmzt5sCLw3c',5,1476981236),
	(23,'Pontiff Maximus',NULL,2,'NcCtiX-VuWA',5,1476981534),
	(24,'Nintendo Switch','No description',5,'PhqRyXEOEJM',205,1478516279),
	(25,'Why will Switch succeed','why',5,'8rbtdehwN2I',205,1478516340),
	(26,'test','No description',3,'j-4rWtIYkZ8',205,1478527578),
	(28,'Zucker','No description',3,'bkHzvEnFsZ0',205,1478527794),
	(30,'check this out again!','<a href=\"http://www.facebook.com\" target=\"_blank\">www.facebook.com</a>',7,'IrfWGJukQ78',205,1479656788),
	(31,'Amazing scientist youtuber','How do you make a watermelon with no seeds?!<br>Facebook: <a href=\"https://www.facebook.com/BiteSciZed\" target=\"_blank\">https://www.facebook.com/BiteSciZed</a><br>Twitter: <a href=\"https://twitter.com/AlexDainis\" target=\"_blank\">https://twitter.com/AlexDainis</a><br>Google+: <a href=\"https://plus.google.com/u/0/b/1080578\" target=\"_blank\">https://plus.google.com/u/0/b/1080578</a>...<br><br><br>Sources:<br>Watermelon Genome:<br><a href=\"http://www.nature.com/ng/journal/v45/\" target=\"_blank\">http://www.nature.com/ng/journal/v45/</a>...<br>Great NPR Story about Seedless Watermelons:<br><a href=\"http://www.npr.org/blogs/thesalt/2012\" target=\"_blank\">http://www.npr.org/blogs/thesalt/2012</a>...<br>NC State University:<br><a href=\"http://web.ncsu.edu/abstract/science/\" target=\"_blank\">http://web.ncsu.edu/abstract/science/</a>...',1,'yvy1xA2RwxM',205,1479883967),
	(33,'Q & A Number 1!','Let\'s add some description to this video...',1,'dVjV0cdjcAM',5,1480038567),
	(35,'The flaw','The flaw which allowed the Allies to break the Nazi Enigma code.<br>First video explaining Enigma: <a href=\"http://youtu.be/G2_Q9FoD-oQ\" target=\"_blank\">http://youtu.be/G2_Q9FoD-oQ</a><br>Extra footage: <a href=\"http://youtu.be/BdrrJ7qd4HA\" target=\"_blank\">http://youtu.be/BdrrJ7qd4HA</a><br>Brown papers on ebay: <a href=\"http://bit.ly/brownpapers\" target=\"_blank\">http://bit.ly/brownpapers</a><br>Periodic Videos: <a href=\"http://www.youtube.com/periodicvideos\" target=\"_blank\">http://www.youtube.com/periodicvideos</a><br><br>This video features Dr James Grime discussing Enigma, the Bombe and Alan Turing.',1,'V4V2bpZlqx8',205,1480088202),
	(36,'Encryption and HUGE numbers - Numberphile','No description',1,'M7kEpw1tn50',205,1480088311),
	(38,'test','Professor Edward Frenkel discusses the mathematics behind the NSA Surveillance controversy - see links in full description.<br><br>More from this interview: <a href=\"http://youtu.be/1O69uBL22nY\" target=\"_blank\">http://youtu.be/1O69uBL22nY</a><br>Professor Frenkel\'s book (Love &amp; Math): <a href=\"http://bit.ly/loveandmath\" target=\"_blank\">http://bit.ly/loveandmath</a><br>The NIST document: <a href=\"http://bit.ly/NIST_numberphile\" target=\"_blank\">http://bit.ly/NIST_numberphile</a>',1,'ulg_AHBOIQU',205,1480088456),
	(40,'test','No description',2,'xHIIizHw85U',205,1480090049),
	(41,'Newest Dragonball Z Abridged','No description',7,'uNyAfXOTG5A',205,1480121023),
	(42,'Dark Souls 3 By Lazy Peon','No description',7,'j6N3yUuXRRA',205,1480121083),
	(43,'FFXV','No description',1,'ODEWcGdOp4g',205,1480622019),
	(45,'test','No description',1,'ADT1imaYZW0',205,1480688893),
	(46,'Why Dark Souls doesn\'t hate you','No description',5,'g4tqmo_mF5U',205,1480734334),
	(47,'The last of us 2','No description',7,'W2Wnvvj33Wo',205,1480833968),
	(48,'MVC','No description',7,'tpQ_l1XHL_g',205,1480867325),
	(49,'이재명 시장','No description',7,'2awkwWmE_U4',205,1480900274),
	(50,'Teenager brains','This is a brainy description',1,'hiduiTq1ei8',205,1480923085),
	(51,'BloodBorne','No description',7,'xksTdvvtN2w',205,1480989488),
	(53,'Breath of the wild lets play video','No description',7,'Na1cIOmfBlU',205,1480989798),
	(54,'Breath of the wild towns and villages','No description',5,'8zWan118_CM',5,1481094754),
	(55,'Socrates','video about the philosopher',2,'fLJBzhcSWTk',5,1481225097),
	(59,'Awesome ai','No description',3,'dcZvhP-IqY4',5,1481275376),
	(60,'This guys a racist?','No description',6,'QGX2mJ6IbS0',5,1481289222),
	(62,'Dominant vs. Recessive Alleles: Bite Sci-zed','No description',1,'Zf2hnFhyJFI',5,1481975952),
	(65,'test','No description',2,'Ym6whrAw8wU',5,1482629072),
	(66,'Heckler gets PWNED','No description',7,'ekoDt_uxb_E',5,1484566484),
	(67,'Dark Souls 3 DLC2 ► Answers in The Ringed City','No description',7,'iACGyZiK27I',229,1485257393),
	(68,'Task...','code:&lt;!DOCTYPE html&gt;<br>&lt;html&gt;<br>&lt;head&gt;<br>&lt;title&gt;Hello World&lt;/title&gt;<br>&lt;body&gt;<br>&lt;h1&gt;Isn\'t today a good day for fishing?&lt;/h1&gt;<br>&lt;p&gt;Lets See our Life style.&lt;/p&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"blue\"&gt;<br>&lt;b&gt;We always work very hard, we never had freedom.&lt;/b&gt;<br>&lt;/font&gt;<br>&lt;h2&gt; What Do We Do? &lt;h2&gt;<br>&lt;ul&gt;<br>&lt;li&gt;Work&lt;/li&gt;<br>&lt;li&gt;Eat Lunch, Supper, Breakfast, Doritos&lt;/li&gt;<br>&lt;li&gt;Sleep For only 5 hours&lt;/li&gt;<br>&lt;img src=\"data:image/jpeg;base64,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\"&gt;<br>&lt;h3&gt;Why Dont We Try To Do Something Active At Freetime?&lt;/h3&gt;<br>&lt;img src=\"<a href=\"http://www.scrubadoo.com/scrubs/wp-content/uploads/2013/01/restless-sleep.jpg\" target=\"_blank\">http://www.scrubadoo.com/scrubs/wp-content/uploads/2013/01/restless-sleep.jpg</a>\"&gt;<br>&lt;h4&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"blue\"&gt;<br>L<br>&lt;/font&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"purple\"&gt;<br>e<br>&lt;/font&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"red\"&gt;<br>t<br>&lt;/font&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"black\"&gt;<br>\'<br>&lt;/font&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"orange\"&gt;<br>s<br>&lt;/font&gt;<br>&lt;font size=\"10\"face=\"arial\"color=\"yellow\"&gt;<br>PLAY!!<br>&lt;/font&gt;<br>&lt;/h4&gt;<br>&lt;img src=\"<a href=\"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRX9RQk6QOuEqTYDxC2U6fwCeBXSrvzIDYX8GJd2pitPncvTUY5\" target=\"_blank\">https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRX9RQk6QOuEqTYDxC2U6fwCeBXSrvzIDYX8GJd2pitPncvTUY5</a>\"&gt;<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>&lt;/body&gt;<br>&lt;/head&gt;<br>&lt;/html&gt;<br>ST2:<a href=\"http://www.sublimetext.com/2\" target=\"_blank\">http://www.sublimetext.com/2</a>',7,'AbR50rMOILw',5,1485737188),
	(69,'Upload this next','No description',7,'W608u6sBFpo',205,1486893788),
	(70,'Eric Schmidt on Structuring Teams and Scaling ','No description',7,'hcRxFRgNpns',205,1486897320),
	(71,'Pigeon','No description',1,'L8Y7Q1eja-E',205,1486897632),
	(72,'Emotional Intelligence by Daniel Goleman!!','good video',7,'n6MRsGwyMuQ',5,1486948339),
	(73,'Nioh Playthrough','Great!',5,'FfH0oeuAjaE',5,1487166982),
	(74,'New Zelda gameplay','',5,'HPY_H4uAqlE',5,1487340834),
	(75,'test','',7,'hf1D0giCECw',5,1487341136),
	(76,'Fire and ice arrows in new zelda','',7,'t0N3NMfX0c4',5,1487341413);

/*!40000 ALTER TABLE `vq_videos` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `vq_videos_after_insert` AFTER INSERT ON `vq_videos` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, rootType, contentId, rootId, uploaderId, timeStamp)
VALUES ('video', 'video', NEW.id, NEW.id, NEW.uploader, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `vq_videos_after_delete` AFTER DELETE ON `vq_videos` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'video' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
