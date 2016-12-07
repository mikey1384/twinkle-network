# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.14)
# Database: twinkle
# Generation Time: 2016-12-07 11:39:53 +0000
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


# Dump of table content_discussions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_discussions`;

CREATE TABLE `content_discussions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `refContentType` varchar(100) DEFAULT NULL,
  `refContentId` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_discussions` WRITE;
/*!40000 ALTER TABLE `content_discussions` DISABLE KEYS */;

INSERT INTO `content_discussions` (`id`, `userId`, `title`, `description`, `refContentType`, `refContentId`, `timeStamp`)
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
	(23,205,'this is a new discussion. hellloooo?',NULL,'video',53,1480993102);

/*!40000 ALTER TABLE `content_discussions` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_discussions_after_insert` AFTER INSERT ON `content_discussions` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, parentContentType, contentId, parentContentId, uploaderId, timeStamp)
VALUES ('discussion', NEW.refContentType, NEW.id, NEW.refContentId, NEW.userId, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_discussions_after_delete` AFTER DELETE ON `content_discussions` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'discussion' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table content_urls
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_urls`;

CREATE TABLE `content_urls` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `url` varchar(1000) DEFAULT NULL,
  `uploader` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `content_urls` WRITE;
/*!40000 ALTER TABLE `content_urls` DISABLE KEYS */;

INSERT INTO `content_urls` (`id`, `title`, `description`, `categoryId`, `url`, `uploader`, `timeStamp`)
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
	(34,'Andrew\'s old student','No description',7,'https://vimeo.com/193898447',205,1480989861),
	(35,'Andrew\'s old student','No description',7,'https://vimeo.com/193898447',205,1480992487);

/*!40000 ALTER TABLE `content_urls` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `content_urls_after_insert` AFTER INSERT ON `content_urls` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, parentContentType, contentId, parentContentId, uploaderId, timeStamp)
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
	(203,218,2,1473864700,NULL,0),
	(204,218,186,1468849612,NULL,0),
	(205,5,2,1481071240,NULL,0),
	(206,5,186,1468679661,NULL,0),
	(207,5,187,1468849599,NULL,0),
	(208,218,187,1468846565,NULL,0),
	(209,5,188,1468678596,NULL,0),
	(210,218,188,1468849612,NULL,0),
	(211,209,2,1470493460,NULL,0),
	(212,209,188,1468675526,NULL,0),
	(213,215,2,1470493231,NULL,0),
	(214,215,187,1468727576,NULL,0),
	(215,218,189,1468849589,NULL,0),
	(216,5,189,1468849601,NULL,0),
	(217,5,190,1469008873,NULL,0),
	(218,218,190,1468850897,NULL,0),
	(219,215,191,1468980414,NULL,0),
	(220,218,191,1468850934,NULL,0),
	(221,5,192,1469008873,NULL,0),
	(222,215,192,1468997475,NULL,0),
	(223,215,193,1468980656,NULL,0),
	(224,215,194,1468980655,NULL,0),
	(225,5,194,1469008796,NULL,0),
	(226,215,195,1468980656,NULL,0),
	(227,220,2,1469108613,NULL,0),
	(228,220,193,1469008881,NULL,0),
	(229,220,194,1469008709,NULL,0),
	(230,220,196,1469009956,NULL,0),
	(231,5,197,1469008874,NULL,0),
	(232,220,197,1469009959,NULL,0),
	(233,5,198,1469111922,NULL,0),
	(234,220,198,1469108619,NULL,0),
	(235,5,199,1474629151,'Mikey Channel!!',0),
	(236,220,199,1469019488,NULL,0),
	(237,220,200,1469108618,NULL,0),
	(238,5,200,1469408786,NULL,1),
	(239,218,199,1470493306,NULL,0),
	(240,5,201,1475136681,NULL,0),
	(241,218,201,1469798515,NULL,0),
	(242,5,202,1474606104,'It worked :)',0),
	(243,5,203,1475136672,NULL,0),
	(244,218,203,1473864713,NULL,0),
	(245,210,2,1469798539,NULL,0),
	(246,210,203,1469798537,NULL,0),
	(247,210,202,1469415719,NULL,0),
	(248,221,2,1469521533,NULL,0),
	(249,221,204,1469521607,NULL,0),
	(250,5,204,1475137207,NULL,0),
	(251,5,205,1475136679,NULL,0),
	(252,222,2,1469591598,NULL,0),
	(253,218,206,1469604287,NULL,0),
	(254,5,207,1479699460,NULL,0),
	(255,218,207,1469794644,NULL,0),
	(256,5,208,1473585426,NULL,0),
	(257,210,207,1470147795,NULL,0),
	(258,210,208,1470147804,NULL,0),
	(259,5,209,1481091273,NULL,0),
	(260,5,210,1471259741,NULL,1),
	(261,5,211,1475136677,NULL,0),
	(262,205,2,1480998383,NULL,0),
	(263,205,209,1481071218,NULL,0),
	(264,205,212,1479474564,NULL,0),
	(265,209,212,1470482869,NULL,0),
	(266,5,213,1473585562,NULL,0),
	(267,209,213,1470493454,NULL,0),
	(268,215,214,1470493298,NULL,0),
	(269,218,215,1473864693,NULL,0),
	(270,208,2,1470493508,NULL,0),
	(271,208,211,1473585121,NULL,0),
	(272,209,215,1470493483,NULL,0),
	(273,209,214,1470493455,NULL,0),
	(274,208,216,1473585063,NULL,0),
	(275,212,2,1473661185,NULL,0),
	(276,5,219,1473586213,NULL,0),
	(277,212,220,1473848213,NULL,0),
	(278,5,220,1476617057,NULL,0),
	(279,225,2,1475388829,NULL,0),
	(280,225,221,1475391391,NULL,0),
	(281,5,221,1476617057,NULL,0),
	(282,205,217,1479702851,NULL,0),
	(283,205,222,1479702849,NULL,0),
	(284,205,223,1479991523,NULL,0),
	(285,5,223,1479701120,NULL,0),
	(286,205,224,1480174721,NULL,0);

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
	(317,2,0,NULL),
	(545,198,5,NULL),
	(547,198,218,NULL),
	(568,199,5,NULL),
	(569,199,218,NULL),
	(571,199,207,NULL),
	(573,200,220,NULL),
	(574,200,5,NULL),
	(575,198,220,NULL),
	(576,198,219,NULL),
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
	(592,207,5,NULL),
	(593,207,219,NULL),
	(594,207,218,NULL),
	(595,207,222,NULL),
	(596,207,210,NULL),
	(597,199,206,NULL),
	(598,199,221,NULL),
	(599,208,5,NULL),
	(600,208,210,NULL),
	(601,209,5,NULL),
	(602,209,205,NULL),
	(603,210,5,NULL),
	(604,210,206,NULL),
	(605,211,5,NULL),
	(606,211,208,NULL),
	(607,212,209,NULL),
	(608,212,205,NULL),
	(609,213,209,NULL),
	(610,213,5,NULL),
	(611,214,209,NULL),
	(612,214,215,NULL),
	(613,215,209,NULL),
	(614,215,218,NULL),
	(615,216,209,NULL),
	(616,216,208,NULL),
	(617,217,205,NULL),
	(618,217,206,NULL),
	(619,217,208,NULL),
	(622,220,5,NULL),
	(623,220,212,NULL),
	(624,221,225,NULL),
	(625,221,5,NULL),
	(626,207,6,NULL),
	(627,222,205,NULL),
	(628,222,226,NULL),
	(629,223,205,NULL),
	(630,223,5,NULL),
	(631,223,206,NULL),
	(632,224,205,NULL),
	(633,224,219,NULL),
	(634,224,226,NULL);

/*!40000 ALTER TABLE `msg_channel_members` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_channels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_channels`;

CREATE TABLE `msg_channels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `twoPeople` tinyint(11) unsigned DEFAULT '0',
  `channelName` varchar(200) DEFAULT NULL,
  `memberOne` int(11) unsigned DEFAULT NULL,
  `memberTwo` int(11) unsigned DEFAULT NULL,
  `creator` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_channels` WRITE;
/*!40000 ALTER TABLE `msg_channels` DISABLE KEYS */;

INSERT INTO `msg_channels` (`id`, `twoPeople`, `channelName`, `memberOne`, `memberTwo`, `creator`)
VALUES
	(2,0,'General',NULL,NULL,NULL),
	(199,0,'Test Channel',NULL,NULL,5),
	(200,1,NULL,220,5,NULL),
	(201,1,NULL,5,218,NULL),
	(202,0,'User And Micky',NULL,NULL,5),
	(203,0,'Testing!',NULL,NULL,5),
	(204,1,NULL,221,5,NULL),
	(205,1,NULL,5,219,NULL),
	(206,1,NULL,218,219,NULL),
	(207,0,'hello world',NULL,NULL,5),
	(208,1,NULL,5,210,NULL),
	(209,1,NULL,5,205,NULL),
	(210,1,NULL,5,206,NULL),
	(211,1,NULL,5,208,NULL),
	(212,1,NULL,209,205,NULL),
	(213,1,NULL,209,5,NULL),
	(214,1,NULL,209,215,NULL),
	(215,1,NULL,209,218,NULL),
	(216,1,NULL,209,208,NULL),
	(217,0,'mikey not allowed',NULL,NULL,205),
	(218,1,NULL,222,223,NULL),
	(220,1,NULL,5,212,NULL),
	(221,1,NULL,225,5,NULL),
	(222,1,NULL,205,226,NULL),
	(223,0,'long long long chat room name that overflows like mother.',NULL,NULL,205),
	(224,0,'channel name with &amp;',NULL,NULL,205);

/*!40000 ALTER TABLE `msg_channels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table msg_chats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `msg_chats`;

CREATE TABLE `msg_chats` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channelId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `content` varchar(20000) DEFAULT NULL,
  `timeStamp` bigint(11) unsigned DEFAULT NULL,
  `isNotification` tinyint(11) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `msg_chats` WRITE;
/*!40000 ALTER TABLE `msg_chats` DISABLE KEYS */;

INSERT INTO `msg_chats` (`id`, `channelId`, `userId`, `content`, `timeStamp`, `isNotification`)
VALUES
	(1043,198,5,'Created channel \"Antonio and Andrew\"',1469015174,1),
	(1044,198,220,'Left the channel',1469015179,1),
	(1045,198,5,'Invited antonio to the channel',1469015321,1),
	(1046,198,220,'Left the channel',1469015330,1),
	(1047,198,5,'Invited antonio to the channel',1469015540,1),
	(1048,198,220,'Left the channel',1469015559,1),
	(1049,198,5,'Invited antonio to the channel',1469015661,1),
	(1050,198,220,'Left the channel',1469015725,1),
	(1051,198,5,'Invited antonio to the channel',1469015819,1),
	(1052,198,220,'Left the channel',1469015846,1),
	(1053,198,5,'Invited antonio to the channel',1469015937,1),
	(1054,198,220,'Left the channel',1469015946,1),
	(1055,198,5,'Invited antonio to the channel',1469016205,1),
	(1056,198,220,'Left the channel',1469016211,1),
	(1057,198,5,'Invited antonio to the channel',1469016338,1),
	(1058,198,220,'Left the channel',1469016343,1),
	(1059,198,5,'Invited antonio to the channel',1469016496,1),
	(1060,198,220,'Left the channel',1469016500,1),
	(1061,198,5,'Invited antonio to the channel',1469016881,1),
	(1062,198,220,'Left the channel',1469016888,1),
	(1063,198,5,'Invited antonio to the channel',1469017749,1),
	(1064,198,220,'Left the channel',1469017757,1),
	(1065,198,5,'Invited antonio to the channel',1469017917,1),
	(1066,198,220,'Left the channel',1469017924,1),
	(1067,198,5,'Invited antonio to the channel',1469018360,1),
	(1068,198,220,'Left the channel',1469018366,1),
	(1069,198,5,'Invited antonio to the channel',1469018413,1),
	(1070,198,220,'Left the channel',1469018419,1),
	(1071,198,5,'Invited antonio to the channel',1469018646,1),
	(1072,198,220,'Left the channel',1469018654,1),
	(1073,198,5,'Invited antonio to the channel',1469018775,1),
	(1074,198,220,'Left the channel',1469018779,1),
	(1075,198,5,'Invited antonio to the channel',1469018908,1),
	(1076,198,220,'Left the channel',1469018913,1),
	(1077,198,5,'Invited antonio to the channel',1469018995,1),
	(1078,198,220,'Left the channel',1469019000,1),
	(1079,198,5,'Invited antonio to the channel',1469019099,1),
	(1080,198,220,'Left the channel',1469019103,1),
	(1081,198,5,'Invited antonio to the channel',1469019185,1),
	(1082,198,220,'Left the channel',1469019192,1),
	(1083,198,5,'Invited antonio to the channel',1469019248,1),
	(1084,198,220,'Left the channel',1469019253,1),
	(1085,199,5,'Created channel \"Test Channel\"',1469019380,1),
	(1086,199,220,'Left the channel',1469019390,1),
	(1087,199,5,'Invited antonio to the channel',1469019482,1),
	(1088,199,220,'Left the channel',1469019491,1),
	(1089,200,220,'hello',1469087884,0),
	(1090,2,220,'hey',1469087897,0),
	(1091,2,5,'hi',1469087935,0),
	(1092,198,5,'Invited antonio to the channel',1469108407,1),
	(1093,198,5,'Invited jimmy to the channel',1469111922,1),
	(1094,201,5,'yo hear me out',1469113724,0),
	(1095,2,5,'hello',1469187985,0),
	(1096,2,5,'hi',1469187998,0),
	(1097,2,5,'hello',1469188028,0),
	(1098,2,5,'hi',1469188030,0),
	(1099,2,5,'hello',1469188084,0),
	(1100,2,5,'hi',1469188085,0),
	(1101,201,5,'wsup',1469188088,0),
	(1102,199,5,'hihi',1469188147,0),
	(1103,199,5,'another message',1469188213,0),
	(1104,199,5,'hello',1469188215,0),
	(1105,199,5,'hi',1469188216,0),
	(1106,201,5,'whats up',1469188219,0),
	(1107,201,218,'hi',1469188236,0),
	(1108,201,5,'hello',1469188240,0),
	(1109,202,5,'Created channel \"User And Micky\"',1469198523,1),
	(1110,201,218,'hey',1469364556,0),
	(1111,201,218,'yo',1469365582,0),
	(1112,201,5,'hi',1469365815,0),
	(1113,201,218,'yo',1469366270,0),
	(1114,201,218,'yoyo',1469366406,0),
	(1115,203,5,'Created channel \"Testing!\"',1469409014,1),
	(1116,203,218,'wow!',1469409036,0),
	(1117,203,5,':)',1469409042,0),
	(1118,203,5,'hi',1469409047,0),
	(1119,203,218,'hello!',1469409055,0),
	(1120,203,218,'hi!',1469409067,0),
	(1121,203,5,'hello!',1469409078,0),
	(1122,203,5,'ehll',1469409231,0),
	(1123,203,5,'hi',1469409233,0),
	(1124,203,5,'hello',1469409234,0),
	(1125,2,5,'one',1469410334,0),
	(1126,2,5,'more',1469410334,0),
	(1127,2,5,'time',1469410335,0),
	(1128,2,5,'for',1469410338,0),
	(1129,2,5,'load',1469410339,0),
	(1130,2,5,'more',1469410340,0),
	(1131,2,5,'button',1469410341,0),
	(1132,2,5,'one',1469410348,0),
	(1133,2,5,'two',1469410348,0),
	(1134,2,5,'three',1469410349,0),
	(1135,2,5,'four',1469410351,0),
	(1136,2,5,'five',1469410352,0),
	(1137,2,5,'six',1469410359,0),
	(1138,2,5,'seven',1469410360,0),
	(1139,2,5,'eight',1469410361,0),
	(1140,2,5,'nine',1469410362,0),
	(1141,201,218,'hi',1469411010,0),
	(1142,201,5,'hello!',1469411018,0),
	(1143,201,5,'hi',1469411026,0),
	(1144,201,218,'hihi',1469411031,0),
	(1145,201,5,'hello',1469413529,0),
	(1146,201,5,'hi',1469413533,0),
	(1147,201,5,'hello',1469413540,0),
	(1148,199,5,'hello',1469413558,0),
	(1149,199,5,'hi',1469413611,0),
	(1150,199,5,'hello',1469413720,0),
	(1151,199,5,'hi',1469413733,0),
	(1152,199,5,'wsup',1469413750,0),
	(1153,199,5,'hello',1469413838,0),
	(1154,201,5,'marking my message as read all the time',1469414288,0),
	(1155,199,5,'hi',1469414298,0),
	(1156,199,5,'hello',1469435167,0),
	(1157,199,5,'howd',1469435170,0),
	(1158,199,218,'howdy',1469435204,0),
	(1159,199,5,'yea',1469435213,0),
	(1160,199,218,'cool',1469435219,0),
	(1161,199,218,'awesome',1469435225,0),
	(1162,201,218,'okay',1469435277,0),
	(1163,201,5,'testing',1469437514,0),
	(1164,201,5,'another test',1469437669,0),
	(1165,201,5,'test',1469437750,0),
	(1166,201,5,'test',1469437765,0),
	(1167,201,5,'another test',1469437776,0),
	(1168,201,218,'new test',1469437800,0),
	(1169,201,218,'other test',1469437811,0),
	(1170,201,218,'hello',1469437819,0),
	(1171,201,218,'test',1469437863,0),
	(1172,201,5,'test in response',1469437877,0),
	(1173,2,221,'hi',1469521496,0),
	(1174,204,221,'hello',1469521540,0),
	(1175,204,221,'hi',1469521605,0),
	(1176,204,5,'hello',1469521862,0),
	(1177,205,5,'hello!',1469521878,0),
	(1178,205,5,'how are you',1469521881,0),
	(1179,205,5,'testing',1469521891,0),
	(1180,205,5,'test',1469522065,0),
	(1181,205,5,'test',1469522092,0),
	(1182,201,5,'test',1469604212,0),
	(1183,201,5,'new msg',1469604215,0),
	(1184,199,5,'hello world',1469604220,0),
	(1185,199,218,'So this is why you need unit testing',1469604248,0),
	(1186,199,218,'i c now',1469604254,0),
	(1187,201,218,'dang',1469604262,0),
	(1188,201,218,'hello world',1469604269,0),
	(1189,206,218,'hello jim',1469604284,0),
	(1190,201,5,'hihi',1469621279,0),
	(1191,201,5,'test',1469621280,0),
	(1192,201,5,'one ',1469621282,0),
	(1193,201,5,'two ',1469621283,0),
	(1194,201,5,'three',1469621284,0),
	(1195,199,5,'test',1469621387,0),
	(1196,199,5,'one',1469621388,0),
	(1197,199,5,'two',1469621389,0),
	(1198,199,218,'hi',1469623992,0),
	(1199,199,218,'hello',1469623993,0),
	(1200,199,218,'hi ',1469623994,0),
	(1201,199,5,'hello',1469623998,0),
	(1202,207,5,'Created channel \"hello world\"',1469632390,1),
	(1203,207,5,'Invited helloworld and micky to the channel',1469632610,1),
	(1204,199,5,'hihi',1469672738,0),
	(1205,199,5,'hello',1469692548,0),
	(1206,207,218,'hey',1469753414,0),
	(1207,207,218,'hello',1469753444,0),
	(1208,201,5,'fdsaf',1469794572,0),
	(1209,201,5,'fdsa',1469794572,0),
	(1210,201,5,'fdas',1469794573,0),
	(1211,201,5,'fdsa',1469794573,0),
	(1212,201,5,'fdsa',1469794573,0),
	(1213,201,5,'f',1469794574,0),
	(1214,201,5,'dsadf',1469794574,0),
	(1215,201,5,'ds',1469794574,0),
	(1216,201,5,'af',1469794574,0),
	(1217,201,5,'dsaf',1469794575,0),
	(1218,201,5,'sda',1469794575,0),
	(1219,201,5,'fd',1469794575,0),
	(1220,201,5,'sa',1469794575,0),
	(1221,201,5,'f',1469794575,0),
	(1222,201,218,'hey',1469794648,0),
	(1223,199,5,'Invited user and jinny to the channel',1469796901,1),
	(1224,199,5,'hello',1469798461,0),
	(1225,208,5,'hey',1469798468,0),
	(1226,208,5,'man',1469798472,0),
	(1227,208,5,'please work',1469798474,0),
	(1228,208,5,'haha',1469798475,0),
	(1229,208,5,'good',1469798478,0),
	(1230,208,5,'this is',1469798479,0),
	(1231,208,5,'working',1469798481,0),
	(1232,208,5,'yay',1469798483,0),
	(1233,208,5,'wow',1469798492,0),
	(1234,208,210,'good',1469798548,0),
	(1235,208,210,'hey',1469798553,0),
	(1236,208,210,'yoyo',1469798560,0),
	(1237,209,5,'hello',1469798810,0),
	(1238,209,5,'world',1469798811,0),
	(1239,209,5,'charlie',1469798813,0),
	(1240,209,5,'testing',1469798814,0),
	(1241,209,5,'hih',1469798823,0),
	(1242,210,5,'yo user,',1469799419,0),
	(1243,210,5,'hello',1469799421,0),
	(1244,210,5,'let\'s work',1469799913,0),
	(1245,210,5,'hi',1469799917,0),
	(1246,211,5,'hello',1469799927,0),
	(1247,211,5,'this is test',1469799931,0),
	(1248,211,5,'hi',1469799933,0),
	(1249,208,210,'hey',1470017920,0),
	(1250,208,210,'yoyo',1470017924,0),
	(1251,208,210,'yo',1470017941,0),
	(1252,208,210,'yoyo',1470017980,0),
	(1253,208,210,'hii',1470018009,0),
	(1254,208,210,'hello',1470144397,0),
	(1255,208,5,'hi',1470144402,0),
	(1256,208,210,'yo',1470144413,0),
	(1257,208,210,'hi',1470144520,0),
	(1258,208,5,'yo',1470144549,0),
	(1259,208,5,'hhi',1470144882,0),
	(1260,208,210,'hello',1470144885,0),
	(1261,208,210,'yo',1470144886,0),
	(1262,208,5,'good',1470144890,0),
	(1263,208,5,'this is working',1470144894,0),
	(1264,208,210,'yes',1470144902,0),
	(1265,208,210,'hopefully this keeps working',1470144907,0),
	(1266,208,5,'hey',1470144958,0),
	(1267,208,210,'this should work',1470144962,0),
	(1268,208,5,'hello',1470147793,0),
	(1269,208,5,'hi',1470147797,0),
	(1270,208,210,'yeah',1470147804,0),
	(1271,212,209,'hey',1470480957,0),
	(1272,2,5,'gen',1470482886,0),
	(1273,213,209,'yo',1470482893,0),
	(1274,213,5,'hey',1470482898,0),
	(1275,214,209,'hey',1470493225,0),
	(1276,215,209,'yo',1470493316,0),
	(1277,216,209,'hey',1470493504,0),
	(1278,210,5,'hello',1470497506,0),
	(1279,211,208,'yo',1473585034,0),
	(1280,216,208,'hi',1473585063,0),
	(1281,211,208,'yoyo',1473585070,0),
	(1282,211,5,'hihi',1473585098,0),
	(1285,220,5,'hello world',1473586299,0),
	(1286,220,212,'hi',1473586306,0),
	(1287,2,212,'yoyo',1473586605,0),
	(1288,204,5,'hi',1473586630,0),
	(1289,203,5,'hi',1473586632,0),
	(1290,202,5,'hi',1473586633,0),
	(1291,2,212,'uafdsa',1473586640,0),
	(1292,220,212,'hello',1473661095,0),
	(1293,220,5,'ho',1473661107,0),
	(1294,220,212,'yoyo',1473661125,0),
	(1295,220,212,'to',1473661134,0),
	(1296,220,212,'hi',1473661138,0),
	(1297,220,212,'hello',1473661163,0),
	(1298,220,212,'yo',1473661167,0),
	(1299,220,212,'hi',1473661178,0),
	(1300,220,212,'wassup',1473661183,0),
	(1301,220,5,'nada',1473661193,0),
	(1302,220,5,'haha',1473661202,0),
	(1303,220,212,'sup',1473661213,0),
	(1304,220,212,'cool',1473661215,0),
	(1305,220,212,'yoyo',1473848213,0),
	(1306,220,5,'fdas',1475136219,0),
	(1307,220,5,'fdsa',1475136220,0),
	(1308,220,5,'fdas',1475136220,0),
	(1309,220,5,'fdas',1475136220,0),
	(1310,220,5,'fd',1475136221,0),
	(1311,220,5,'as',1475136221,0),
	(1312,220,5,'fds',1475136221,0),
	(1313,220,5,'afdd',1475136222,0),
	(1314,220,5,'a',1475136222,0),
	(1315,220,5,'d',1475136222,0),
	(1316,220,5,'sf',1475136222,0),
	(1317,220,5,'a',1475136222,0),
	(1318,204,5,'1',1475136539,0),
	(1319,204,5,'2',1475136539,0),
	(1320,204,5,'3',1475136540,0),
	(1321,204,5,'4',1475136540,0),
	(1322,204,5,'5',1475136541,0),
	(1323,204,5,'6',1475136541,0),
	(1324,204,5,'7',1475136542,0),
	(1325,204,5,'8',1475136542,0),
	(1326,204,5,'9',1475136543,0),
	(1327,204,5,'0',1475136543,0),
	(1328,204,5,'11',1475136545,0),
	(1329,204,5,'1',1475136546,0),
	(1330,204,5,'2',1475136547,0),
	(1331,204,5,'3',1475136548,0),
	(1332,204,5,'44',1475136560,0),
	(1333,204,5,'55',1475136560,0),
	(1334,204,5,'66',1475136561,0),
	(1335,204,5,'77',1475136562,0),
	(1336,204,5,'8',1475136562,0),
	(1337,204,5,'88',1475136564,0),
	(1338,204,5,'99',1475136565,0),
	(1339,204,5,'00',1475136566,0),
	(1340,207,5,'1',1475136686,0),
	(1341,207,5,'2',1475136687,0),
	(1342,207,5,'3',1475136687,0),
	(1343,207,5,'4',1475136688,0),
	(1344,207,5,'5',1475136688,0),
	(1345,207,5,'6',1475136689,0),
	(1346,207,5,'7',1475136690,0),
	(1347,207,5,'8',1475136691,0),
	(1348,207,5,'9',1475136691,0),
	(1349,207,5,'10',1475136693,0),
	(1350,207,5,'11',1475136694,0),
	(1351,207,5,'12',1475136695,0),
	(1352,207,5,'13',1475136696,0),
	(1353,207,5,'14',1475136696,0),
	(1354,207,5,'15',1475136697,0),
	(1355,207,5,'16',1475136698,0),
	(1356,207,5,'17',1475136699,0),
	(1357,207,5,'18',1475136700,0),
	(1358,207,5,'19',1475136701,0),
	(1359,207,5,'20',1475136702,0),
	(1360,207,5,'21',1475136703,0),
	(1361,207,5,'22',1475136704,0),
	(1362,207,5,'23',1475136705,0),
	(1363,207,5,'24',1475136706,0),
	(1364,207,5,'25',1475136707,0),
	(1365,207,5,'26',1475136708,0),
	(1366,207,5,'27',1475136709,0),
	(1367,207,5,'28',1475136710,0),
	(1368,207,5,'29',1475136711,0),
	(1369,207,5,'30',1475136712,0),
	(1370,207,5,'31',1475136713,0),
	(1371,207,5,'32',1475136714,0),
	(1372,207,5,'33',1475136715,0),
	(1373,207,5,'34',1475136716,0),
	(1374,207,5,'35',1475136717,0),
	(1375,207,5,'36',1475136718,0),
	(1376,207,5,'37',1475136719,0),
	(1377,207,5,'38',1475136720,0),
	(1378,207,5,'39',1475136721,0),
	(1379,207,5,'40',1475136723,0),
	(1380,207,5,'41',1475136724,0),
	(1381,207,5,'42',1475136725,0),
	(1382,207,5,'43',1475136726,0),
	(1383,207,5,'44',1475136726,0),
	(1384,207,5,'45',1475136727,0),
	(1385,207,5,'46',1475136728,0),
	(1386,221,225,'hello',1475388836,0),
	(1387,221,225,'yoyo',1475388837,0),
	(1388,221,225,'haha',1475388863,0),
	(1389,221,225,'yoyo',1475389049,0),
	(1390,221,225,'yaya',1475389106,0),
	(1391,221,225,'hihi',1475389174,0),
	(1392,221,225,'ok',1475389180,0),
	(1393,221,225,'why',1475389185,0),
	(1394,221,225,'yes',1475389194,0),
	(1395,221,225,'hello',1475389229,0),
	(1396,221,225,'hi',1475389235,0),
	(1397,221,225,'hello',1475389352,0),
	(1398,221,225,'haha',1475389729,0),
	(1399,221,225,'yoy',1475389829,0),
	(1400,221,225,'haha',1475389835,0),
	(1401,221,225,'tada',1475389846,0),
	(1402,221,225,'aha',1475389848,0),
	(1403,221,225,'hello',1475391376,0),
	(1404,221,225,'hi',1475391391,0),
	(1405,209,205,'hihi',1475663635,0),
	(1406,209,205,'yo',1475663648,0),
	(1407,209,205,'hihi',1475663653,0),
	(1408,209,205,'yo',1475663968,0),
	(1409,209,205,'hi',1475663969,0),
	(1410,222,205,'hello there',1479474562,0),
	(1411,2,205,'fdas',1479629176,0),
	(1412,2,205,'fdas',1479629177,0),
	(1413,2,205,'dfas',1479629177,0),
	(1414,2,205,'fdas',1479629178,0),
	(1415,2,205,'fdsaf',1479629219,0),
	(1416,2,205,'fdsa',1479629220,0),
	(1417,2,205,'fd',1479629220,0),
	(1418,2,205,'sf',1479629220,0),
	(1419,2,205,'saf',1479629220,0),
	(1420,2,205,'s',1479629220,0),
	(1421,2,205,'f',1479629221,0),
	(1422,2,205,'dsa',1479629221,0),
	(1423,2,205,'f',1479629221,0),
	(1424,2,205,'sdaf',1479629221,0),
	(1425,2,205,'dsa',1479629221,0),
	(1426,2,205,'f',1479629222,0),
	(1427,222,205,'fdas',1479629233,0),
	(1428,222,205,'f',1479629233,0),
	(1429,222,205,'s',1479629233,0),
	(1430,222,205,'f1',1479629237,0),
	(1431,222,205,'2',1479629237,0),
	(1432,222,205,'3',1479629237,0),
	(1433,222,205,'4',1479629238,0),
	(1434,222,205,'56',1479629238,0),
	(1435,222,205,'7',1479629239,0),
	(1436,222,205,'8',1479629239,0),
	(1437,222,205,'9',1479629240,0),
	(1438,222,205,'543',1479629240,0),
	(1439,222,205,'57',1479629242,0),
	(1440,222,205,'6867',1479629243,0),
	(1441,222,205,'234',1479629244,0),
	(1442,222,205,'654',1479629244,0),
	(1443,222,205,'253',1479629245,0),
	(1444,222,205,'243',1479629246,0),
	(1445,222,205,'231',1479629247,0),
	(1446,222,205,'4',1479629247,0),
	(1447,222,205,'523',1479629247,0),
	(1448,222,205,'156',1479629247,0),
	(1449,222,205,'346',1479629248,0),
	(1450,222,205,'4',1479629248,0),
	(1451,222,205,'262',1479629248,0),
	(1452,222,205,'632',1479629249,0),
	(1453,222,205,'62',1479629249,0),
	(1454,222,205,'3',1479629250,0),
	(1455,223,205,'Created channel \"long long long chat room name that overflows like mother.\"',1479698140,1),
	(1456,223,5,'hi',1479699464,0),
	(1457,223,5,'hello',1479699679,0),
	(1458,223,5,'fsdafdsafdsa fds fdsa f fdsjk  asjdkla jkfdsja f jaksl jklsaf jlkfjlk asjfkljas klfjsa lksf jksfal jklfasj lkfaj klsjfdlk jaklf jklfj klsajf',1479700594,0),
	(1459,223,5,'super lonfdsafjk fjsaf j fdskl fkls fjsa fkl asfsdafdsafdsa fds fdsa f fdsjk  asjdkla jkfdsja f jaksl jklsaf jlkfjlk asjfkljas klfjsa lksf jksfal jklfasj lkfaj klsjfdlk jaklf jklfj klsajf',1479700932,0),
	(1460,223,5,'what do you want to do when you grow up?',1479701120,0),
	(1461,224,205,'Created channel \"channel name with &amp;\"',1479703251,1),
	(1462,224,205,'v',1479991519,0),
	(1463,224,205,'xc',1479991519,0),
	(1464,224,205,'v',1479991521,0),
	(1465,224,205,'x',1479991521,0),
	(1466,224,205,'vc',1479991521,0),
	(1467,224,205,'cx',1479991521,0),
	(1468,224,205,'vc',1479991521,0),
	(1469,209,5,'INSERT INTO noti_feeds (type, contentId, parentContentType, parentContentId, uploaderId, timeStamp) <br>SELECT type, contentId, parentContentType, parentContentId, uploaderId, timeStamp FROM (<br>	SELECT \'comment\' AS type, id AS contentId, \'video\' AS parentContentType, videoId AS parentContentId, userId AS uploaderId, timeStamp <br>	FROM vq_comments <br>	UNION <br>	SELECT \'video\', id, \'video\', id, uploader, timeStamp FROM vq_videos <br>	UNION<br>	SELECT \'url\', id, \'url\', id, uploader, timeStamp FROM content_urls <br>	UNION<br>	SELECT \'discussion\', id, refContentType, refContentId, userId, timeStamp FROM content_discussions <br>	ORDER BY timeStamp<br>) AS data',1481090399,0);

/*!40000 ALTER TABLE `msg_chats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table noti_feeds
# ------------------------------------------------------------

DROP TABLE IF EXISTS `noti_feeds`;

CREATE TABLE `noti_feeds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  `parentContentType` varchar(100) DEFAULT NULL,
  `parentContentId` int(11) DEFAULT NULL,
  `uploaderId` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `noti_feeds` WRITE;
/*!40000 ALTER TABLE `noti_feeds` DISABLE KEYS */;

INSERT INTO `noti_feeds` (`id`, `type`, `contentId`, `parentContentType`, `parentContentId`, `uploaderId`, `timeStamp`)
VALUES
	(1,'video',3,'video',3,5,NULL),
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
	(136,'url',35,'url',35,205,1480992487),
	(139,'discussion',23,'video',53,205,1480993102),
	(163,'comment',650,'video',53,205,1481032132),
	(164,'comment',651,'video',53,205,1481032144),
	(166,'comment',653,'video',50,205,1481039583),
	(169,'comment',656,'video',53,205,1481040333),
	(170,'comment',657,'video',53,205,1481040343),
	(171,'video',54,'video',54,5,1481094754);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `realName`, `class`, `email`, `userType`, `joinDate`, `password`, `lastChannelId`)
VALUES
	(5,'mikey','',NULL,'twinkle.mikey@gmail.com','master',NULL,'sha1$a1b4e5d8$1$9d276b32dfd2bd1aeabbde0c7d9f4b40820f16a8',209),
	(205,'charlie','Charlie Shin',NULL,'twinkle.teacher@gmail.com','teacher',1459947370,'sha1$bb97bb36$1$bf37ba395a3a281fe6f60dac9df35700926cc0c2',209),
	(206,'user','mike Ser',NULL,NULL,'user',1459947427,'sha1$7d1504e0$1$853f1b45bbe54f120bdef7a7c187edd992ae8dd3',NULL),
	(208,'testingsignup','Testing Signup',NULL,'twinkle.contact@gmail.com','teacher',1461661347,'sha1$bd66bf25$1$e7eab82f167ef1ab1fac89b357484d234d600627',211),
	(209,'student','Studious Lee',NULL,'','user',1463215894,'sha1$eaa3076d$1$f20549e534f34cf04fe4a3c7110ab4e959f76825',216),
	(210,'micky','Micky Kim',NULL,'twinkle.teacher@gmail.com','teacher',1463216295,'sha1$f0bf8d2f$1$1b7c86637ad83c47467ed6a532c9f3bff9c9bc2c',208),
	(211,'trulynewaccount','New Teacher',NULL,NULL,'teacher',1463216636,'sha1$d990a2ab$1$37311f327f2bae2a1e97a5f05cd3cd8c6d0bcc5a',NULL),
	(212,'mikey1384','Test Mikey',NULL,NULL,'teacher',1463375011,'sha1$fccb3959$1$5c769a8b5161fb4f74bfa77bdff0166991b62111',220),
	(214,'lowercase','Case Lower',NULL,'twinkle.andrew@gmail.com','teacher',1463467858,'sha1$739999fa$1$c7f9de1822a227665dcbce493dd45b19ce196701',NULL),
	(215,'tommy','Tommy Lee',NULL,NULL,'master',1463720113,'sha1$45181260$1$79c47e8a461e327eabf5724710beb3cfb51bf12c',214),
	(216,'testoalgobony','Testo Algoboni',NULL,NULL,'master',1465222454,'sha1$0af2b53e$1$bd9920873fb06b463f76d32c44a942a19e5d4fe5',NULL),
	(217,'newtoken','Token New',NULL,NULL,'user',1465399275,'sha1$a14b53a5$1$1f602cb292419192af2c5a1acb107ed233ff32e2',NULL),
	(218,'andrew','Andrew Park',NULL,'twinkle.andrew@gmail.com','teacher',1466181267,'sha1$a0a00e01$1$7813f8108d1bfed1cf13a6a65c45bd11c5b6135d',203),
	(219,'jimmy','Jimmy Kim',NULL,NULL,'user',1466957452,'sha1$23ccc837$1$60e45a47faef694cbd27456d8d1d21b75015280c',109),
	(221,'jinny','Jinny Lee',NULL,NULL,'user',1469521492,'sha1$ba8569ae$1$0255f65abc764e871be9d8e432a04752bd9a7689',204),
	(222,'helloworld','Hello World',NULL,NULL,'user',1469591201,'sha1$9738233b$1$1fe2c8b44224f41bd9377d1bf6029f7372dcef59',NULL),
	(223,'kate','Kate Brown',NULL,'twinkle.kate@gmail.com','teacher',1469592069,'sha1$6680a2be$1$9e49f1d6c39cee4793f4bf99a92a4d0a313549fd',NULL),
	(224,'random','Ran Dom',NULL,NULL,'user',1474323175,'sha1$e4294f00$1$e5eb5a445be946a909b349975fd2fb5d274680f1',NULL),
	(225,'comment','Com Ment',NULL,NULL,'user',1474323219,'sha1$9477a254$1$e023f009caa41a3c2d666cd72d015d08822cbea7',221),
	(226,'sonic','Sonic Shin',NULL,NULL,'user',1475968564,'sha1$9ea15458$1$acd6490023ff2d0e6ccefefdd7bd5639b9799fe5',NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_comments`;

CREATE TABLE `vq_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `content` varchar(20000) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  `videoId` int(11) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `replyId` int(11) DEFAULT NULL,
  `debateId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_comments` WRITE;
/*!40000 ALTER TABLE `vq_comments` DISABLE KEYS */;

INSERT INTO `vq_comments` (`id`, `userId`, `content`, `timeStamp`, `videoId`, `commentId`, `replyId`, `debateId`)
VALUES
	(2,5,'This is the first comment!',1475587469,1,NULL,NULL,NULL),
	(586,205,'comment number 586',1479792644,30,NULL,NULL,NULL),
	(593,205,'one',1479793901,30,586,NULL,NULL),
	(594,205,'two',1479793904,30,586,NULL,NULL),
	(595,205,'three',1479793907,30,586,NULL,NULL),
	(596,205,'four',1479793946,30,586,NULL,NULL),
	(597,205,'five',1479809439,30,586,NULL,NULL),
	(598,205,'six',1479809442,30,586,NULL,NULL),
	(599,205,'seven',1479809449,30,586,NULL,NULL),
	(600,205,'eight',1479809454,30,586,NULL,NULL),
	(601,205,'nine',1479809457,30,586,NULL,NULL),
	(602,205,'ten',1479809460,30,586,NULL,NULL),
	(603,205,'eleven',1479809463,30,586,NULL,NULL),
	(604,205,'twelve',1479809466,30,586,NULL,NULL),
	(605,205,'test',1479816660,30,NULL,NULL,16),
	(606,205,'one',1479816663,30,605,NULL,16),
	(607,205,'two',1479816672,30,605,NULL,16),
	(608,205,'three',1479816674,30,605,NULL,16),
	(609,205,'four',1479816677,30,605,NULL,16),
	(610,205,'another',1479816691,30,NULL,NULL,16),
	(619,205,'i can play this all day long',1480002885,31,NULL,NULL,NULL),
	(620,5,'tes',1480036622,31,619,NULL,NULL),
	(621,5,'comment',1480038879,33,NULL,NULL,NULL),
	(622,5,'reply',1480038883,33,621,NULL,NULL),
	(650,205,'hi!!',1481032132,53,NULL,NULL,23),
	(651,205,'hey...',1481032144,53,650,NULL,23),
	(653,205,'Testing comment',1481039583,50,NULL,NULL,NULL),
	(656,205,'please work',1481040333,53,NULL,NULL,23),
	(657,205,'yaa!',1481040343,53,NULL,NULL,NULL);

/*!40000 ALTER TABLE `vq_comments` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `vq_comments_after_insert` AFTER INSERT ON `vq_comments` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, parentContentType, contentId, parentContentId, uploaderId, timeStamp)
VALUES ('comment', 'video', NEW.id, NEW.videoId, NEW.userId, NEW.timeStamp);

END */;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `vq_comments_after_delete` AFTER DELETE ON `vq_comments` FOR EACH ROW BEGIN

DELETE FROM noti_feeds WHERE type = 'comment' AND contentId = OLD.id;

END */;;
DELIMITER ;
/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;


# Dump of table vq_commentupvotes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_commentupvotes`;

CREATE TABLE `vq_commentupvotes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_commentupvotes` WRITE;
/*!40000 ALTER TABLE `vq_commentupvotes` DISABLE KEYS */;

INSERT INTO `vq_commentupvotes` (`id`, `commentId`, `userId`)
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
	(223,625,205);

/*!40000 ALTER TABLE `vq_commentupvotes` ENABLE KEYS */;
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
	(1,4),
	(2,2),
	(3,1);

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
	(2,'two','No description',5,NULL),
	(3,'three','No description',5,NULL),
	(4,'four','No description',5,NULL),
	(5,'five','No description',5,NULL);

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
	(6,2,6),
	(7,2,7),
	(8,2,9),
	(9,3,3),
	(10,3,2),
	(11,3,1),
	(12,4,6),
	(13,4,4),
	(14,4,3),
	(15,5,7),
	(16,5,1),
	(17,5,4);

/*!40000 ALTER TABLE `vq_playlistvideos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_questions`;

CREATE TABLE `vq_questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `videoId` int(11) unsigned DEFAULT NULL,
  `title` varchar(2000) DEFAULT NULL,
  `choice1` varchar(2000) DEFAULT NULL,
  `choice2` varchar(2000) DEFAULT NULL,
  `choice3` varchar(2000) DEFAULT NULL,
  `choice4` varchar(2000) DEFAULT NULL,
  `choice5` varchar(2000) DEFAULT NULL,
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
	(21,309,'test<br><br><br>testetsadf<br>dsfa','fdas','fdsa',NULL,NULL,NULL,1,5,0);

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
	(223,4,5),
	(228,6,5),
	(234,18,5),
	(235,26,205),
	(236,31,5),
	(240,33,205),
	(243,42,205);

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
	(91,54,5,1481094823);

/*!40000 ALTER TABLE `vq_video_views` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vq_videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vq_videos`;

CREATE TABLE `vq_videos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `videoCode` varchar(300) DEFAULT NULL,
  `uploader` int(11) DEFAULT NULL,
  `timeStamp` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `vq_videos` WRITE;
/*!40000 ALTER TABLE `vq_videos` DISABLE KEYS */;

INSERT INTO `vq_videos` (`id`, `title`, `description`, `categoryId`, `videoCode`, `uploader`, `timeStamp`)
VALUES
	(1,'Best Plays','No description',NULL,'K8g_OnF-Vuc',5,1475581972),
	(2,'Environmental Kills are Fun','No description',NULL,'2Hm6OL5WaUc',5,1475583781),
	(3,'The Zen Master','No description',NULL,'TquQe7Id9-4',5,NULL),
	(4,'SNES Code Injection -- Flappy Bird in SMW','No description',NULL,'hB6eY73sLV0',5,1475588062),
	(6,'Cause and effect real?','No description',NULL,'3AMCcYnAsdQ',5,1475793988),
	(7,'Blow Your Mind!','No description',NULL,'I31pi-6NgqM',5,1475840404),
	(9,'test','No description',NULL,'OQZKh8Bjdv0',226,1475968575),
	(11,'tests','testa',5,'VXoRbyHmT5E',5,1476355252),
	(12,'Dark Souls Video','Test',5,'H6hW98hY_bI',5,1476359033),
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
	(54,'Breath of the wild towns and villages','No description',5,'8zWan118_CM',5,1481094754);

/*!40000 ALTER TABLE `vq_videos` ENABLE KEYS */;
UNLOCK TABLES;

DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `vq_videos_after_insert` AFTER INSERT ON `vq_videos` FOR EACH ROW BEGIN

INSERT INTO noti_feeds (type, parentContentType, contentId, parentContentId, uploaderId, timeStamp)
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
