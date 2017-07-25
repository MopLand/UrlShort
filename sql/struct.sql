
DROP TABLE IF EXISTS `urls`;
CREATE TABLE `urls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(700) BINARY NOT NULL,
  `segment` varchar(15) NOT NULL,
  `datetime_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `api` tinyint(4) NOT NULL DEFAULT '0',
  `ip` varchar(25) NOT NULL,
  `clicks` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `segment` (`segment`),
  KEY `api` (`api`),
  KEY `url` (`url`),
  KEY `clicks` (`clicks`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -------------------------------------------

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `segment` varchar(15) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `words` varchar(30) NULL,
  PRIMARY KEY (`id`),
  KEY `segment` (`segment`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -------------------------------------------

DROP TABLE IF EXISTS `stats`;
CREATE TABLE `stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `country` varchar(64) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `ip` varchar(100) NOT NULL,
  `referer` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  KEY `clickdate` (`clickdate`),
  KEY `ip` (`ip`),
  KEY `country` (`country`),
  KEY `mobile` (`mobile`),
  CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -------------------------------------------

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

