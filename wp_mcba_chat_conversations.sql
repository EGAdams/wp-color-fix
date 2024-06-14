-- phpMyAdmin SQL Dump

-- version 4.8.3

-- https://www.phpmyadmin.net/

--

-- Host: 127.0.0.1

-- Generation Time: Aug 21, 2019 at 02:36 AM

-- Server version: 10.1.36-MariaDB

-- PHP Version: 7.1.23



SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET AUTOCOMMIT = 0;

START TRANSACTION;

SET time_zone = "+00:00";





/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8mb4 */;



--

-- Database: `wordpress`

--



-- --------------------------------------------------------



--

-- Table structure for table `wp_mcba_chat_conversations`

--



CREATE TABLE `wp_mcba_chat_conversations` (

  `conversation_id` int(11) NOT NULL,

  `user` varchar(50) COLLATE utf8_unicode_ci NOT NULL,

  `admin` varchar(50) COLLATE utf8_unicode_ci NOT NULL,

  `admin_unread_messages` int(11) NOT NULL,

  `user_unread_messages` int(11) NOT NULL

) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



--

-- Dumping data for table `wp_mcba_chat_conversations`

--



INSERT INTO `wp_mcba_chat_conversations` (`conversation_id`, `user`, `admin`, `admin_unread_messages`, `user_unread_messages`) VALUES

(127, 'jack@gmail.com', 'expert@mycustombusinessapp.com', 0, 0),

(128, 'chip@gmail.com', 'expert@mycustombusinessapp.com', 0, 0),

(130, 'jane@gmail.com', 'expert@mycustombusinessapp.com', 0, 0),

(129, 'jane@mail.com', 'expert@mycustombusinessapp.com', 0, 0),

(131, 'jack@gmal.com', 'expert@mycustombusinessapp.com', 0, 0),

(132, 'gail@gmail.com', 'expert@mycustombusinessapp.com', 0, 0),

(133, 'jimjones@gmail.com', 'expert@mycustombusinessapp.com', 0, 0),

(134, 'jackjones@gmail.com', 'expert@mycustombusinessapp.com', 0, 0);



--

-- Indexes for dumped tables

--



--

-- Indexes for table `wp_mcba_chat_conversations`

--

ALTER TABLE `wp_mcba_chat_conversations`

  ADD UNIQUE KEY `conversation_id` (`conversation_id`);



--

-- AUTO_INCREMENT for dumped tables

--



--

-- AUTO_INCREMENT for table `wp_mcba_chat_conversations`

--

ALTER TABLE `wp_mcba_chat_conversations`

  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

