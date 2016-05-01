SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `stats` (
`id` int(11) NOT NULL,
  `url_id` int(11) NOT NULL,
  `clickdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(100) NOT NULL,
  `referer` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `urls` (
`id` int(11) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `segment` varchar(15) NOT NULL,
  `datetime_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(25) NOT NULL,
  `num_of_clicks` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `stats`
 ADD PRIMARY KEY (`id`), ADD KEY `url_id` (`url_id`);

ALTER TABLE `urls`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `segment` (`segment`);

ALTER TABLE `stats`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `urls`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `stats`
ADD CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 2016/05/01

ALTER TABLE `stats`
ADD `country` varchar(64) NULL AFTER `clickdate`,
ADD `area` varchar(64) NULL AFTER `country`,
ADD `region` varchar(64) NULL AFTER `area`,
ADD `city` varchar(64) NULL AFTER `region`;

-- 点击统计

DELIMITER ;;
CREATE TRIGGER `stats_urls_click` AFTER INSERT ON `stats` FOR EACH ROW
BEGIN
	UPDATE urls SET num_of_clicks = num_of_clicks + 1 WHERE id = new.url_id;
END;;
DELIMITER ;


-- 统计报告

DELIMITER $$  
CREATE PROCEDURE count_by_url_id(in url_id, out uv int, out referer int, out region int)  
BEGIN
	-- 独立访客
	SELECT count(*) FROM `stats` WHERE url_id = url_id GROUP BY ip INTO uv;
	
	-- 来源分布
	SELECT referer, count(*) FROM `stats` WHERE url_id = url_id GROUP BY referer INTO referer;
	
	-- 地区分布
	SELECT region, count(*) FROM `stats` WHERE url_id = url_id GROUP BY region INTO region;
	
	-- 24小时 访问量/独立访客
	
END $$  
DELIMITER ;