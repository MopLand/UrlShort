SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DELIMITER ;;

DROP PROCEDURE IF EXISTS `count_by_url_hash`;;
CREATE PROCEDURE `count_by_url_hash`(IN `hash` varchar(15))
ThisSP:BEGIN

	-- 查询记录
	SELECT id, clicks INTO @url_id, @clicks FROM urls WHERE segment = hash LIMIT 1;

	-- 没有记录
	IF @url_id IS NULL THEN
		LEAVE ThisSP;
	END IF;

	-- 统计分表
	SET @table = CONCAT( 'stats_', @url_id % 10 );

	-- 独立访客（总数）
	-- SELECT COUNT( DISTINCT ip ) AS visit FROM @table WHERE url_id = @url_id GROUP BY ip;
	SET @stmt := CONCAT('SELECT COUNT( DISTINCT ip ) AS visit FROM ', @table, ' WHERE url_id = ', @url_id, ' GROUP BY ip' );
	PREPARE STMT FROM @stmt;
	EXECUTE STMT;

	-- 来源分布
	-- SELECT IF( referer, referer, '直接访问' ) AS referer, count(*) AS stats FROM @table WHERE url_id = @url_id GROUP BY referer;
	SET @stmt := CONCAT('SELECT IF( referer, referer, \'直接访问\' ) AS referer, count(*) AS stats FROM ',@table,' WHERE url_id = ',@url_id,' GROUP BY referer');
	PREPARE STMT FROM @stmt;
	EXECUTE STMT;

	-- 地区分布
	-- SELECT region, COUNT(*) AS stats FROM @table WHERE url_id = @url_id GROUP BY region;
	SET @stmt := CONCAT('SELECT region, COUNT(*) AS stats FROM ',@table,' WHERE url_id = ',@url_id,' GROUP BY region');
	PREPARE STMT FROM @stmt;
	EXECUTE STMT;

	-- 24小时 访问量/独立访客
	-- SELECT HOUR(clickdate) AS hour, COUNT(*) AS stats FROM `stats` WHERE url_id = @url_id AND clickdate > DATE_ADD( now(), interval -1 day );

	-- **********************************

	SET @h24uv = '';
	SET @h24ip = '';

	-- 写入临时表
	SET @y = 23;

	-- 开始时间
	SELECT DATE_FORMAT(NOW() - INTERVAL @y HOUR, '%y%m%d%H') AS start;

	WHILE @y > 0 DO

		-- 24小时 访问量
		-- SELECT COUNT(*) AS stats INTO @tmp FROM @table WHERE url_id = @url_id AND DATE_FORMAT( clickdate, '%Y%m%d%H' ) = DATE_FORMAT(NOW() - INTERVAL @y HOUR, '%Y%m%d%H');
		SET @stmt := CONCAT('SELECT COUNT(*) AS stats INTO @tmp FROM ',@table,' WHERE url_id = ',@url_id,' AND DATE_FORMAT( clickdate, \'%Y%m%d%H\' ) = DATE_FORMAT(NOW() - INTERVAL ',@y,' HOUR, \'%Y%m%d%H\')');
		PREPARE STMT FROM @stmt;
		EXECUTE STMT;
		SET @h24uv = concat( @h24uv, ',', @tmp );

		-- 24小时 独立访客
		-- SELECT COUNT( DISTINCT ip ) AS stats INTO @tmp FROM @table WHERE url_id = @url_id AND DATE_FORMAT( clickdate, '%Y%m%d%H' ) = DATE_FORMAT(NOW() - INTERVAL @y HOUR, '%Y%m%d%H') GROUP BY ip;
		SET @stmt := CONCAT('SELECT COUNT( DISTINCT ip ) AS stats INTO @tmp FROM ',@table,' WHERE url_id = ',@url_id,' AND DATE_FORMAT( clickdate, \'%Y%m%d%H\' ) = DATE_FORMAT(NOW() - INTERVAL ',@y,' HOUR, \'%Y%m%d%H\') GROUP BY ip');
		PREPARE STMT FROM @stmt;
		EXECUTE STMT;
		SET @h24ip = concat( @h24ip, ',', @tmp );

		SET @y = @y - 1;

	END WHILE;

	-- 查询变量（24小时访问量、24小时独立访客、总访问量）
	SELECT SUBSTRING( @h24uv, 2 ) AS uv, SUBSTRING( @h24ip, 2 ) AS ip, @clicks AS click;

END;;

DELIMITER ;

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


DELIMITER ;;

CREATE TRIGGER `stats_urls_click` AFTER INSERT ON `stats` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;

DELIMITER ;

-- -------------------------------------------

DROP TABLE IF EXISTS `urls`;
CREATE TABLE `urls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(700) NOT NULL,
  `segment` varchar(15) NOT NULL,
  `datetime_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(25) NOT NULL,
  `clicks` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `segment` (`segment`),
  KEY `api` (`api`),
  KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
