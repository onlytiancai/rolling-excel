CREATE DATABASE `rollingexcel` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE `users` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `open_id` varchar(64) NOT NULL DEFAULT '0',
      `user_type` tinyint(4) NOT NULL DEFAULT '0',
      `username` varchar(32) NOT NULL DEFAULT '',
      `last_login_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      `created_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      `changed_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      PRIMARY KEY (`id`),
      UNIQUE KEY `username` (`username`),
      KEY `open_id` (`open_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `workbooks` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `uuid` varchar(64) NOT NULL DEFAULT '',
      `user_id` int(11) NOT NULL DEFAULT '0',
      `title` varchar(128) NOT NULL DEFAULT '',
      `content` text NOT NULL,
      `share_to` text NOT NULL,
      `status` tinyint(4) NOT NULL DEFAULT '0',
      `created_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      `changed_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      PRIMARY KEY (`id`),
      KEY `user_id` (`user_id`),
      KEY `uuid` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8; 
