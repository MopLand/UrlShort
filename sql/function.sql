SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DELIMITER ;;

DROP PROCEDURE IF EXISTS `clean_old_url_data`;;
CREATE PROCEDURE `clean_old_url_data`()
BEGIN

	-- 定义字段
	DECLARE furl_id INT;
	DECLARE fsegment VARCHAR(15);

	--

	-- 完成标记
	DECLARE done INT DEFAULT FALSE;

	-- 定义游标，6个月前的过期数据
	DECLARE curs CURSOR FOR SELECT id, segment FROM urls WHERE api < 2 AND datetime_added < CURDATE() - INTERVAL 6 MONTH ORDER BY id ASC;

	-- 完成标记
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	--
	
	-- 数据数量
	SET @count = 0;

	OPEN curs;	loop_label: LOOP

		FETCH curs INTO furl_id, fsegment;

		IF done THEN
			LEAVE loop_label;
		ELSE
		
			-- 统计分表
			SET @table = CONCAT( 'stats_', furl_id % 10 );

			-- 删除统计数据
			-- DELETE FROM stats_3 WHERE url_id = furl_id;
			SET @stmt := CONCAT('DELETE FROM ', @table, ' WHERE url_id = ', furl_id );
			PREPARE STMT FROM @stmt;
			EXECUTE STMT;

			-- 删除商品数据
			DELETE FROM goods WHERE segment = fsegment;

			-- 删除当前记录
			DELETE FROM urls WHERE id = furl_id;

		END IF;

	END LOOP;	CLOSE curs;

	-- 写入日志
	INSERT INTO `task` (`task`,`count`,`dateline`,`datetime`) VALUES('clean_old_url_data', @count, UNIX_TIMESTAMP(), NOW());

END;;

DROP EVENT IF EXISTS `clean_expired_data`;;
CREATE EVENT `clean_expired_data` ON SCHEDULE EVERY 1 DAY STARTS '2016-08-01 01:01:00' ON COMPLETION PRESERVE ENABLE DO BEGIN
     CALL clean_old_url_data();
END;;

-- -------------------------------------------

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
	SET @stmt := CONCAT('SELECT COALESCE( referer, \'直接访问\' ) AS referer, count(*) AS stats FROM ',@table,' WHERE url_id = ',@url_id,' GROUP BY referer');
	PREPARE STMT FROM @stmt;
	EXECUTE STMT;

	-- 地区分布
	-- SELECT region, COUNT(*) AS stats FROM @table WHERE url_id = @url_id GROUP BY region;
	SET @stmt := CONCAT('SELECT COALESCE( region, \'未知地区\' ) AS region, COUNT(*) AS stats FROM ',@table,' WHERE url_id = ',@url_id,' GROUP BY region');
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

	-- 写入日志
	INSERT INTO `task` (`task`,`dateline`,`datetime`) VALUES('count_by_url_hash', @url_id, UNIX_TIMESTAMP(), NOW());

END;;

DELIMITER ;

-- -------------------------------------------

DELIMITER ;;

CREATE TRIGGER `stats_urls_click` AFTER INSERT ON `stats` FOR EACH ROW
BEGIN
	UPDATE urls SET clicks = clicks + 1 WHERE id = new.url_id;
END;;

DELIMITER ;

-- -------------------------------------------

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

