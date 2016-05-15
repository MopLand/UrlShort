CREATE TABLE `stats_0` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_5` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_6` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_7` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_8` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stats_9` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `referer` varchar(255) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `referer` (`referer`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DELIMITER ;;
CREATE TRIGGER `stats_0_click` AFTER INSERT ON `stats_0` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_1_click` AFTER INSERT ON `stats_1` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_2_click` AFTER INSERT ON `stats_2` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_3_click` AFTER INSERT ON `stats_3` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_4_click` AFTER INSERT ON `stats_4` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_5_click` AFTER INSERT ON `stats_5` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_6_click` AFTER INSERT ON `stats_6` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_7_click` AFTER INSERT ON `stats_7` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_8_click` AFTER INSERT ON `stats_8` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `stats_9_click` AFTER INSERT ON `stats_9` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;
