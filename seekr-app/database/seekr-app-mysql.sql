-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2025 at 07:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seekrapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `notification_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`notification_id`, `message`, `status`, `created_at`) VALUES
(1, 'Found report ID #1 has been approved and tagged as missing.', 'read', '2025-12-02 11:54:29'),
(2, 'Found report ID #1 has been successfully returned to its owner.', 'read', '2025-12-02 11:54:50'),
(3, 'Lost report ID #1 has been successfully returned to its owner.', 'read', '2025-12-02 11:54:50'),
(4, 'Found report ID #2 has been approved and tagged as missing.', 'read', '2025-12-02 12:03:23'),
(5, 'Found report ID #2 has been successfully returned to its owner.', 'read', '2025-12-02 12:03:44'),
(6, 'Lost report ID #2 has been successfully returned to its owner.', 'read', '2025-12-02 12:03:44'),
(7, 'Found report ID #3 has been approved and tagged as missing.', 'read', '2025-12-02 12:06:53'),
(8, 'Found report ID #3 has been successfully returned to its owner.', 'read', '2025-12-02 12:07:11'),
(9, 'Lost report ID #3 has been successfully returned to its owner.', 'read', '2025-12-02 12:07:11'),
(10, 'Found report ID #4 has been approved and tagged as missing.', 'read', '2025-12-02 12:10:53'),
(11, 'Found report ID #4 has been successfully returned to its owner.', 'read', '2025-12-02 12:11:11'),
(12, 'Lost report ID #4 has been successfully returned to its owner.', 'read', '2025-12-02 12:11:11'),
(13, 'Found report ID #5 has been approved and tagged as missing.', 'read', '2025-12-02 12:13:12'),
(14, 'Found report ID #5 has been successfully returned to its owner.', 'read', '2025-12-02 12:13:37'),
(15, 'Lost report ID #5 has been successfully returned to its owner.', 'read', '2025-12-02 12:13:37'),
(16, 'Lost report ID #12 was tagged as rejected due to Already found', 'read', '2025-12-02 13:28:37'),
(17, 'Lost report ID #11 was tagged as rejected due to Left in their house', 'read', '2025-12-02 13:28:49'),
(18, 'Lost report ID #10 was tagged as rejected due to multiple entry', 'read', '2025-12-02 13:30:22'),
(19, 'Found report ID #6 has been rejected due to duplicate entry.', 'read', '2025-12-02 13:36:16'),
(20, 'Found report ID #11 has been rejected due to has been found by their classmates.', 'read', '2025-12-02 13:43:01'),
(21, 'Found report ID #10 has been rejected due to left in their own home.', 'read', '2025-12-02 13:43:13'),
(22, 'Found report ID #9 has been rejected due to found inside their classroom.', 'read', '2025-12-02 13:44:09'),
(23, 'Found report ID #8 has been rejected due to found inside the mac lab.', 'read', '2025-12-02 13:44:23'),
(24, 'Found report ID #7 has been rejected due to duplicate entry.', 'read', '2025-12-02 13:44:31'),
(25, 'Found report ID #12 has been rejected due to false alarm.', 'read', '2025-12-02 13:59:15'),
(26, 'Found report ID #13 has been rejected due to duplicate entry.', 'read', '2025-12-02 13:59:31'),
(27, 'Found report ID #14 has been approved and tagged as missing.', 'read', '2025-12-02 14:11:44'),
(28, 'Found report ID #15 has been approved and tagged as missing.', 'read', '2025-12-02 14:11:47'),
(29, 'Found report ID #16 has been approved and tagged as missing.', 'read', '2025-12-02 14:11:51'),
(30, 'Found report ID #17 has been approved and tagged as missing.', 'read', '2025-12-02 14:11:54'),
(31, 'Found report ID #18 has been approved and tagged as missing.', 'read', '2025-12-02 14:11:58'),
(32, 'Found report ID #19 has been approved and tagged as missing.', 'read', '2025-12-02 14:12:00'),
(33, 'Found report ID #20 has been approved and tagged as missing.', 'read', '2025-12-02 14:12:03'),
(34, 'Found report ID #26 has been rejected due to already been found in their car.', 'read', '2025-12-02 16:23:00'),
(35, 'Found report ID #26 has been rejected due to duplicate entry.', 'read', '2025-12-02 16:30:02'),
(36, 'Found report ID #26 has been rejected due to duplicate info.', 'read', '2025-12-02 16:33:03'),
(37, 'Found report ID #26 has been rejected due to duplicate.', 'read', '2025-12-02 16:37:28'),
(38, 'Found report ID #26 has been rejected due to duplicate.', 'read', '2025-12-02 16:48:36'),
(39, 'Found report ID #26 has been approved and tagged as missing.', 'read', '2025-12-02 16:49:08'),
(40, 'Lost report ID #8 was tagged as rejected due to already been found', 'read', '2025-12-02 16:51:23'),
(41, 'Found report ID #26 has been successfully returned to its owner.', 'read', '2025-12-02 16:53:31'),
(42, 'Lost report ID #9 has been successfully returned to its owner.', 'read', '2025-12-02 16:53:31'),
(43, 'Found report ID #27 has been approved and tagged as missing.', 'read', '2025-12-02 16:58:48'),
(44, 'Found report ID #27 has been successfully returned to its owner.', 'read', '2025-12-02 16:59:19'),
(45, 'Lost report ID #10 has been successfully returned to its owner.', 'read', '2025-12-02 16:59:19'),
(46, 'Found report ID #28 has been approved and tagged as missing.', 'read', '2025-12-02 17:10:39'),
(47, 'Found report ID #28 has been successfully returned to its owner.', 'read', '2025-12-02 17:11:01'),
(48, 'Lost report ID #11 has been successfully returned to its owner.', 'read', '2025-12-02 17:11:01'),
(49, 'Lost report ID #14 was tagged as rejected due to wrong location', 'read', '2025-12-02 18:35:00'),
(50, 'Lost report ID #13 was tagged as rejected due to wrong description', 'read', '2025-12-02 18:36:33'),
(51, 'Lost report ID #13 was tagged as rejected due to multiple entry', 'read', '2025-12-02 18:45:28'),
(52, 'Lost report ID #13 was tagged as rejected due to redundant report', 'read', '2025-12-02 18:46:53'),
(53, 'Lost report ID #13 was tagged as rejected due to multiple entry', 'read', '2025-12-02 18:54:09'),
(54, 'Found report ID #29 has been rejected due to duplicate entry.', 'read', '2025-12-02 18:59:16'),
(55, 'Found report ID #30 has been approved and tagged as missing.', 'read', '2025-12-02 18:59:52'),
(56, 'Found report ID #30 has been successfully returned to its owner.', 'read', '2025-12-02 19:00:16'),
(57, 'Lost report ID #15 has been successfully returned to its owner.', 'read', '2025-12-02 19:00:16'),
(58, 'Lost report ID #16 was tagged as rejected due to Wrong location', 'read', '2025-12-02 19:02:26'),
(59, 'Lost report ID #17 was tagged as rejected due to wrong location', 'read', '2025-12-02 19:22:25'),
(60, 'Found report ID #31 has been approved and tagged as missing.', 'read', '2025-12-02 19:25:23'),
(61, 'Found report ID #31 has been successfully returned to its owner.', 'unread', '2025-12-02 19:25:54'),
(62, 'Lost report ID #18 has been successfully returned to its owner.', 'read', '2025-12-02 19:25:54'),
(63, 'Lost report ID #19 was tagged as rejected due to False', 'unread', '2025-12-02 19:44:29'),
(64, 'Found report ID #32 has been approved and tagged as missing.', 'unread', '2025-12-02 19:44:53'),
(65, 'Found report ID #32 has been successfully returned to its owner.', 'unread', '2025-12-02 19:45:14'),
(66, 'Lost report ID #19 has been successfully returned to its owner.', 'unread', '2025-12-02 19:45:14'),
(67, 'Found report ID #21 has been rejected due to founded already.', 'unread', '2025-12-02 19:47:25'),
(68, 'Found report ID #25 has been approved and tagged as missing.', 'unread', '2025-12-02 19:47:38'),
(69, 'Found report ID #34 has been approved and tagged as missing.', 'unread', '2025-12-02 19:55:29'),
(70, 'Found report ID #33 has been approved and tagged as missing.', 'unread', '2025-12-03 01:37:28'),
(71, 'Found report ID #35 has been rejected due to false report.', 'unread', '2025-12-03 01:38:18'),
(72, 'Found report ID #36 has been approved and tagged as missing.', 'unread', '2025-12-03 01:41:40'),
(73, 'Found report ID #36 has been successfully returned to its owner.', 'unread', '2025-12-03 01:42:13'),
(74, 'Lost report ID #23 has been successfully returned to its owner.', 'unread', '2025-12-03 01:42:13'),
(75, 'Lost report ID #22 was tagged as rejected due to duplicate report from Laedy Bedonia', 'unread', '2025-12-03 01:43:38'),
(76, 'Lost report ID #20 was tagged as rejected due to duplicate entry', 'unread', '2025-12-03 04:45:36'),
(77, 'Found report ID #38 has been approved and tagged as missing.', 'unread', '2025-12-03 05:06:00'),
(78, 'Found report ID #38 has been successfully returned to its owner.', 'unread', '2025-12-03 05:07:09'),
(79, 'Lost report ID #24 has been successfully returned to its owner.', 'unread', '2025-12-03 05:07:09'),
(80, 'Found report ID #39 has been rejected due to duplicate entry.', 'unread', '2025-12-03 06:43:54'),
(81, 'Lost report ID #25 was tagged as rejected due to no updates', 'unread', '2025-12-03 06:44:54'),
(82, 'Found report ID #37 has been approved and tagged as missing.', 'unread', '2025-12-03 06:45:36'),
(83, 'Found report ID #40 has been approved and tagged as missing.', 'unread', '2025-12-03 06:49:14'),
(84, 'Found report ID #40 has been successfully returned to its owner.', 'unread', '2025-12-03 06:50:27'),
(85, 'Lost report ID #26 has been successfully returned to its owner.', 'unread', '2025-12-03 06:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE `color` (
  `color_id` int(11) NOT NULL,
  `color_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `color`
--

INSERT INTO `color` (`color_id`, `color_name`) VALUES
(1, 'Red'),
(2, 'Orange'),
(3, 'Yellow'),
(4, 'Green'),
(5, 'Blue'),
(6, 'Indigo'),
(7, 'Violet'),
(8, 'Others');

-- --------------------------------------------------------

--
-- Table structure for table `external_users`
--

CREATE TABLE `external_users` (
  `external_id` int(11) NOT NULL,
  `fname_ext` varchar(100) NOT NULL,
  `mname_ext` varchar(100) DEFAULT NULL,
  `lname_ext` varchar(100) NOT NULL,
  `email_ext` varchar(255) NOT NULL,
  `occupation_ext` varchar(150) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `external_users`
--

INSERT INTO `external_users` (`external_id`, `fname_ext`, `mname_ext`, `lname_ext`, `email_ext`, `occupation_ext`, `date_created`) VALUES
(1, 'Angel', 'Mae', 'Senarpida', 'angelsenarpida@gmail.com', 'Visitors', '2025-12-02 13:45:52'),
(2, 'Reynmar', 'Cruz', 'Matuba', 'reynmarmatuba@gmail.com', 'Parents', '2025-12-02 13:58:35'),
(3, 'Jasmine', 'Heather', 'Ayuson', 'jasmineayuson@gmail.com', 'Guest Speaker', '2025-12-02 14:00:59'),
(4, 'Joshua', 'Matthew', 'Cayaban', 'joshuacayaban@gmail.com', 'Alumni', '2025-12-02 14:02:53'),
(5, 'Francheska', 'Gian', 'Cruz', 'francheskacruz@gmail.com', 'Visitors', '2025-12-02 14:04:16'),
(6, 'Vienne', 'Torejas', 'Vergara', 'viennevergara@gmail.com', 'Guest Speaker', '2025-12-02 14:29:45'),
(7, 'Francine', 'Jyde', 'Valera', 'francinevalera@gmail.com', 'Visitors', '2025-12-02 14:31:00'),
(8, 'Nicole', 'Angela', 'De Pedro', 'nicoledepedro@gmail.com', 'Others', '2025-12-02 19:24:26'),
(9, 'Klarisse', 'Oledan', 'Verdejo', 'klarisseverdejo@gmail.com', 'Guest Speaker', '2025-12-02 19:54:36'),
(10, 'Laedy', 'Mae', 'Bedonia', 'laedybedonia@gmail.com', 'Alumni', '2025-12-03 01:40:23'),
(11, 'Jessa', 'Mae', 'Ajero', 'jessaajero@gmail.com', 'Alumni', '2025-12-03 01:41:26'),
(12, 'Strawberry Pink', 'Julianda', 'Balasbas', 'strawberry.balasbas@gmail.com', 'Others', '2025-12-03 05:02:53'),
(13, 'Alejandra', NULL, 'Pormanes', 'jandra.pormanes@gmail.com', 'Others', '2025-12-03 05:05:18'),
(14, 'Bea', NULL, 'Tolentino', 'beatolentino@gmail.com', 'Alumni', '2025-12-03 06:48:15');

-- --------------------------------------------------------

--
-- Table structure for table `found_reports`
--

CREATE TABLE `found_reports` (
  `report_id` int(11) NOT NULL,
  `founded_user` int(11) DEFAULT NULL,
  `external_founded_id` int(11) DEFAULT NULL,
  `item_found` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `brand_found` varchar(100) DEFAULT NULL,
  `date_reported` datetime NOT NULL DEFAULT current_timestamp(),
  `location_id` int(11) DEFAULT NULL,
  `location_description` text DEFAULT NULL,
  `status` enum('Pending','Rejected','Missing','Returned') DEFAULT 'Pending',
  `modified_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_returned` date DEFAULT NULL,
  `claimed_by` int(11) DEFAULT NULL,
  `claimed_by_name` varchar(100) DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `found_reports`
--

INSERT INTO `found_reports` (`report_id`, `founded_user`, `external_founded_id`, `item_found`, `description`, `color_id`, `brand_found`, `date_reported`, `location_id`, `location_description`, `status`, `modified_time`, `date_returned`, `claimed_by`, `claimed_by_name`, `reviewed_by`, `reason`, `media_id`) VALUES
(1, 6, NULL, 'Tumbler', '2025 Edition', 6, 'Starbucks', '2025-12-02 19:54:50', 1, 'In the benches', 'Returned', '2025-12-02 12:31:46', '2025-12-03', 3, NULL, 1, NULL, 2),
(2, 8, NULL, 'Neck Pillow', 'None', 5, 'Pop Mart', '2025-12-02 20:03:44', 19, 'First Floor', 'Returned', '2025-12-02 12:36:05', '2025-12-02', 7, NULL, 1, NULL, 5),
(3, 3, NULL, 'Hirono', 'With box', 8, 'Pop Mart', '2025-12-02 20:07:11', 4, 'Pericos', 'Returned', '2025-12-02 12:36:25', '2025-12-02', 7, NULL, 1, NULL, 6),
(4, 17, NULL, 'Aviary Book', 'With cover', 4, 'NBS', '2025-12-02 20:11:11', 2, 'Near the guard', 'Returned', '2025-12-02 12:36:52', '2025-12-02', 15, NULL, 2, NULL, 8),
(5, 14, NULL, 'Smartwatch', 'None', 8, 'Apple', '2025-12-02 20:13:37', 17, 'Near the 2nd Floor', 'Returned', '2025-12-02 12:37:01', '2025-12-02', 16, NULL, 4, NULL, 10),
(6, 3, NULL, 'Tumbler', 'With stickers', 6, 'Starbucks', '2025-12-02 20:15:12', 1, 'Near the benches', 'Rejected', '2025-12-02 13:47:42', NULL, NULL, NULL, 1, 'duplicate entry', 18),
(7, 6, NULL, 'Smartwatch', 'With case', 8, 'Apple', '2025-12-02 20:30:02', 1, 'Near the bookstore', 'Rejected', '2025-12-02 13:47:53', NULL, NULL, NULL, 2, 'duplicate entry', 19),
(8, 10, NULL, 'Headphones', 'With stickers', 8, 'Razer', '2025-12-02 20:31:59', 1, 'Near the bookstore', 'Rejected', '2025-12-02 13:48:03', NULL, NULL, NULL, 2, 'found inside the mac lab', 20),
(9, 10, NULL, 'Pencil Case', 'With pencils and pens', 8, 'Miniso', '2025-12-02 20:45:10', 1, 'Near the fountain', 'Rejected', '2025-12-02 13:48:11', NULL, NULL, NULL, 2, 'found inside their classroom', 21),
(10, 10, NULL, 'Plushie', 'With red patch and stitches', 8, 'Miniso', '2025-12-02 20:50:34', 3, 'Near the fiction section', 'Rejected', '2025-12-02 13:48:20', NULL, NULL, NULL, 1, 'left in their own home', 22),
(11, 23, NULL, 'Phone', 'Note 12 Pro Plus 5G', 4, 'Redmi Xiaomi', '2025-12-02 21:10:00', 22, 'First floor', 'Rejected', '2025-12-02 13:48:26', NULL, NULL, NULL, 1, 'has been found by their classmates', 23),
(12, NULL, 1, 'Tumbler', 'With cute stickers', 7, 'Sunnies', '2025-12-02 21:15:05', 22, 'First floor of Tytana', 'Rejected', '2025-12-02 14:12:14', NULL, NULL, NULL, 1, 'false alarm', 24),
(13, NULL, 2, 'Plastic Envelope', 'With personal documents inside', 8, 'Adventure', '2025-12-02 21:30:55', 10, 'At the claiming area', 'Rejected', '2025-12-02 14:12:27', NULL, NULL, NULL, 1, 'duplicate entry', 25),
(14, NULL, 3, 'Mouse', 'With stickers', 8, 'Attack Shark', '2025-12-02 21:40:12', 22, 'At the tech booth', 'Missing', '2025-12-02 14:32:50', NULL, NULL, NULL, 4, NULL, 26),
(15, NULL, 4, 'Mouse', 'With box', 8, 'Attack Shark', '2025-12-02 21:45:38', 20, 'In the podium', 'Missing', '2025-12-02 14:32:59', NULL, NULL, NULL, 4, NULL, 27),
(16, NULL, 5, 'Notebook', 'Front cover saying from STEM 12 - Burgos', 8, 'Deli', '2025-12-02 21:51:02', 1, 'Near the library', 'Missing', '2025-12-02 14:33:11', NULL, NULL, NULL, 4, NULL, 28),
(17, 17, NULL, 'Laptop', 'With stickers', 8, 'Acer', '2025-12-02 22:00:59', 7, 'Near the computer laboratory 2', 'Missing', '2025-12-02 14:33:21', NULL, NULL, NULL, 4, NULL, 29),
(18, 17, NULL, 'Headphones', 'With minimal scratches', 5, 'Beats', '2025-12-02 22:03:20', 1, 'Near the canteen benches', 'Missing', '2025-12-02 14:33:29', NULL, NULL, NULL, 4, NULL, 30),
(19, 4, NULL, 'Umbrella', 'With keychains', 8, 'Fibrella', '2025-12-02 22:10:50', 2, 'Near the SASD office', 'Missing', '2025-12-02 14:33:40', NULL, NULL, NULL, 4, NULL, 31),
(20, 1, NULL, 'Tumbler', 'With padayon stickers', 5, 'Aquaflask', '2025-12-02 22:11:20', 4, 'Pericos', 'Missing', '2025-12-02 14:33:50', NULL, NULL, NULL, 4, NULL, 32),
(21, 13, NULL, 'Jacket', 'Black', 8, 'Adidas', '2025-12-02 22:15:22', 8, 'Fundamental Laboratory 2', 'Rejected', '2025-12-02 19:47:25', NULL, NULL, NULL, 1, 'founded already', 33),
(22, 14, NULL, 'Jacket', 'Color white', 8, 'Nike', '2025-12-02 22:16:42', 2, 'Near the stairs', 'Pending', '2025-12-02 14:16:42', NULL, NULL, NULL, NULL, NULL, 34),
(23, 20, NULL, 'iPhone 17', 'Brand new with transparent case', 3, 'Apple', '2025-12-02 22:18:21', 5, 'At the 7th floor', 'Pending', '2025-12-02 14:18:21', NULL, NULL, NULL, NULL, NULL, 35),
(24, 6, NULL, 'iPhone 15 Pro Max', 'With case', 8, 'Apple', '2025-12-02 22:22:37', 15, 'CAS', 'Pending', '2025-12-02 14:22:37', NULL, NULL, NULL, NULL, NULL, 37),
(25, 11, NULL, 'Bag', 'With stuff inside', 8, 'Nike', '2025-12-02 22:27:33', 18, 'At the 3rd floor', 'Missing', '2025-12-02 19:47:38', NULL, NULL, NULL, 1, NULL, 39),
(26, NULL, 7, 'Bag', 'With makeup inside', 7, 'Jansport', '2025-12-02 22:34:00', 13, 'Girl\'s CR', 'Returned', '2025-12-02 17:01:02', '2025-12-03', 25, NULL, 1, NULL, 41),
(27, 24, NULL, 'Calculator', 'With stickers and case', 8, 'Casio', '2025-12-03 00:58:18', 5, 'Inside the basketball court', 'Returned', '2025-12-02 16:59:19', '2025-12-03', 25, NULL, 1, NULL, 44),
(28, 11, NULL, 'Lunchbox', 'none', 8, 'Kleen Kanteen', '2025-12-03 01:09:58', 4, 'Pericos', 'Returned', '2025-12-02 17:11:01', '2025-12-03', 6, NULL, 1, NULL, 46),
(29, 13, NULL, 'Earbuds', 'with scratches', 4, 'Soundcore', '2025-12-03 02:57:47', 7, 'Computer Laboratory 1', 'Rejected', '2025-12-02 18:59:16', NULL, NULL, NULL, 1, 'duplicate entry', 51),
(30, 13, NULL, 'Earbuds', 'With scratches', 4, 'Soundcore', '2025-12-02 02:58:29', 7, 'Computer Laboratory 1', 'Returned', '2025-12-02 19:00:16', '2025-12-03', 12, NULL, 1, NULL, 52),
(31, NULL, 8, 'Airpods', 'With case', 8, 'Apple', '2025-12-03 03:24:26', 6, 'Near the guard', 'Returned', '2025-12-02 19:25:54', '2025-12-03', 1, NULL, 1, NULL, 60),
(32, 2, NULL, 'Keyboard', 'Aula F75', 8, 'Aula', '2025-12-02 03:42:23', 12, 'Inside the office', 'Returned', '2025-12-02 19:45:14', '2025-12-03', 1, NULL, 1, NULL, 62),
(33, 20, NULL, 'Speaker', 'JBL Xtreme', 8, 'JBL', '2025-12-03 03:51:19', 15, 'MDCON', 'Missing', '2025-12-03 01:37:28', NULL, NULL, NULL, 1, NULL, 64),
(34, NULL, 9, 'iPad', 'iPad 10th Generation with Case', 8, 'Apple', '2025-12-03 03:54:36', 25, 'Room 406', 'Missing', '2025-12-02 19:55:29', NULL, NULL, NULL, 4, NULL, 66),
(35, 22, NULL, 'Laptop', 'With stickers', 8, 'Asus', '2025-12-02 09:35:12', 19, 'First floor', 'Rejected', '2025-12-03 01:38:18', NULL, NULL, NULL, 1, 'false report', 68),
(36, NULL, 11, 'Basketball', 'with CAS name', 8, 'Molten', '2025-12-03 09:41:26', 5, 'basketball court', 'Returned', '2025-12-03 01:42:13', '2025-12-03', NULL, 'Laedy Bedonia', 1, NULL, 70),
(37, 3, NULL, 'Charger', '120 Watts Charger', 8, 'Xiaomi', '2025-12-03 12:22:11', 1, 'One of the sockets near the stairs', 'Missing', '2025-12-03 06:45:36', NULL, NULL, NULL, 1, NULL, 71),
(38, NULL, 13, 'Watch', 'silver, may design na black', 8, 'Rolex', '2025-12-03 13:05:18', 7, 'nasa ilalim ng PC1', 'Returned', '2025-12-03 05:07:09', '2025-12-03', NULL, 'Strawberry Pink Balasbas', 4, NULL, 73),
(39, 3, NULL, 'Glasses', 'With case', 8, 'Sunnies Studios', '2025-12-03 14:41:17', 3, 'College Library', 'Rejected', '2025-12-03 06:43:54', NULL, NULL, NULL, 1, 'duplicate entry', 75),
(40, 1, NULL, 'Mouse', 'With stickers', 8, 'Rapoo', '2025-12-03 14:49:00', 1, 'Near the stairs', 'Returned', '2025-12-03 06:50:27', '2025-12-03', 22, NULL, 1, NULL, 77);

--
-- Triggers `found_reports`
--
DELIMITER $$
CREATE TRIGGER `notify_found_report_missing` AFTER UPDATE ON `found_reports` FOR EACH ROW BEGIN
    -- ONLY send notification if founded_user is NOT NULL (internal user)
    IF NEW.status = 'missing' 
       AND OLD.status <> 'missing' 
       AND NEW.founded_user IS NOT NULL THEN
        
        INSERT INTO notifications (user_id, message, status, created_at)
        VALUES (
            NEW.founded_user,
            CONCAT('Your found report with the tagged Report ID #', NEW.report_id, ' has been approved and tagged as missing.'),
            'Unread',
            NOW()
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_found_report_rejected` AFTER UPDATE ON `found_reports` FOR EACH ROW BEGIN
    -- ONLY send notification if founded_user is NOT NULL (internal user)
    IF NEW.status = 'rejected' 
       AND OLD.status <> 'rejected' 
       AND NEW.founded_user IS NOT NULL THEN
        
        INSERT INTO notifications (user_id, message, status, created_at)
        VALUES (
            NEW.founded_user,
            CONCAT('Your found report with the tagged Report ID #', NEW.report_id, ' has been rejected due to ', IFNULL(NEW.reason, 'No reason provided')),
            'Unread',
            NOW()
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_found_report_returned` AFTER UPDATE ON `found_reports` FOR EACH ROW BEGIN
    -- ONLY send notification if founded_user is NOT NULL (internal user)
    IF NEW.status = 'returned' 
       AND OLD.status <> 'returned' 
       AND NEW.founded_user IS NOT NULL THEN
        
        INSERT INTO notifications (user_id, message, status, created_at)
        VALUES (
            NEW.founded_user,
            CONCAT('Your found report with the tagged Report ID #', NEW.report_id, ' has been successfully returned.'),
            'Unread',
            NOW()
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_found_status_notification` AFTER UPDATE ON `found_reports` FOR EACH ROW BEGIN
    -- Only run when status actually changes
    IF NEW.status <> OLD.status THEN

        -- Status: Rejected
        IF NEW.status = 'Rejected' THEN
            INSERT INTO admin_notifications (message, status, created_at)
            VALUES (
                CONCAT(
                    'Found report ID #', NEW.report_id,
                    ' has been rejected due to ', NEW.reason, '.'
                ),
                'unread',
                NOW()
            );
        END IF;

        -- Status: Returned
        IF NEW.status = 'Returned' THEN
            INSERT INTO admin_notifications (message, status, created_at)
            VALUES (
                CONCAT(
                    'Found report ID #', NEW.report_id,
                    ' has been successfully returned to its owner.'
                ),
                'unread',
                NOW()
            );
        END IF;

        -- Status: Missing (approved as missing)
        IF NEW.status = 'Missing' THEN
            INSERT INTO admin_notifications (message, status, created_at)
            VALUES (
                CONCAT(
                    'Found report ID #', NEW.report_id,
                    ' has been approved and tagged as missing.'
                ),
                'unread',
                NOW()
            );
        END IF;

    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `item_media`
--

CREATE TABLE `item_media` (
  `media_id` int(11) NOT NULL,
  `media_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_media`
--

INSERT INTO `item_media` (`media_id`, `media_path`, `uploaded_at`) VALUES
(1, '1764676320809.jpg', '2025-12-02 11:52:00'),
(2, '1764676412798.jpg', '2025-12-02 11:53:32'),
(3, '1764676576355.jpg', '2025-12-02 11:56:16'),
(4, '1764676739733.jpg', '2025-12-02 11:58:59'),
(5, '1764676922680.jpg', '2025-12-02 12:02:02'),
(6, '1764677198931.jpg', '2025-12-02 12:06:38'),
(7, '1764677358048.jpg', '2025-12-02 12:09:18'),
(8, '1764677428241.jpg', '2025-12-02 12:10:28'),
(9, '1764677527301.jpg', '2025-12-02 12:12:07'),
(10, '1764677572655.jpg', '2025-12-02 12:12:52'),
(11, '1764681558378.jpg', '2025-12-02 13:19:18'),
(12, '1764681664537.jpg', '2025-12-02 13:21:04'),
(13, '1764681758424.jpg', '2025-12-02 13:22:38'),
(14, '1764681829119.jpg', '2025-12-02 13:23:49'),
(15, '1764681867869.jpg', '2025-12-02 13:24:27'),
(16, '1764681903855.jpg', '2025-12-02 13:25:03'),
(17, '1764681951784.jpg', '2025-12-02 13:25:51'),
(18, '1764682542562.jpg', '2025-12-02 13:35:42'),
(19, '1764682783688.jpg', '2025-12-02 13:39:43'),
(20, '1764682826960.jpg', '2025-12-02 13:40:26'),
(21, '1764682862579.jpg', '2025-12-02 13:41:02'),
(22, '1764682900545.jpg', '2025-12-02 13:41:40'),
(23, '1764682950156.jpg', '2025-12-02 13:42:30'),
(24, '1764683152545-876688002.jpg', '2025-12-02 13:45:52'),
(25, '1764683915863-709747598.jpg', '2025-12-02 13:58:35'),
(26, '1764684059184-113692908.jpg', '2025-12-02 14:00:59'),
(27, '1764684173104-628716592.jpg', '2025-12-02 14:02:53'),
(28, '1764684256824-426246860.jpg', '2025-12-02 14:04:16'),
(29, '1764684363995.jpg', '2025-12-02 14:06:04'),
(30, '1764684407924.jpg', '2025-12-02 14:06:47'),
(31, '1764684563447-231239195.jpg', '2025-12-02 14:09:23'),
(32, '1764684668698-433585193.jpg', '2025-12-02 14:11:08'),
(33, '1764684922219.jpg', '2025-12-02 14:15:22'),
(34, '1764685002519.jpg', '2025-12-02 14:16:42'),
(35, '1764685101291.jpg', '2025-12-02 14:18:21'),
(36, '1764685244786.jpg', '2025-12-02 14:20:44'),
(37, '1764685357567.jpg', '2025-12-02 14:22:37'),
(38, '1764685593794.jpg', '2025-12-02 14:26:33'),
(39, '1764685653178.jpg', '2025-12-02 14:27:33'),
(40, '1764685785306-57834548.jpg', '2025-12-02 14:29:45'),
(41, '1764685860956-37192513.jpg', '2025-12-02 14:31:00'),
(42, '1764694344084.jpg', '2025-12-02 16:52:24'),
(43, '1764694618356.jpg', '2025-12-02 16:56:58'),
(44, '1764694698490.jpg', '2025-12-02 16:58:18'),
(45, '1764695338078.jpg', '2025-12-02 17:08:58'),
(46, '1764695398093.jpg', '2025-12-02 17:09:58'),
(47, '1764699111598.jpg', '2025-12-02 18:11:51'),
(48, '1764700264640.jpg', '2025-12-02 18:31:04'),
(49, '1764700444192.jpg', '2025-12-02 18:34:04'),
(50, '1764701793133.jpg', '2025-12-02 18:56:33'),
(51, '1764701867905.jpg', '2025-12-02 18:57:47'),
(52, '1764701909776.jpg', '2025-12-02 18:58:29'),
(53, '1764702121975-325908868.jpg', '2025-12-02 19:02:01'),
(54, '1764702190839-400450487.jpg', '2025-12-02 19:03:10'),
(59, '1764703289971-463713693.jpg', '2025-12-02 19:21:29'),
(60, '1764703466305-63431427.jpg', '2025-12-02 19:24:26'),
(61, '1764704484731-697190152.jpeg', '2025-12-02 19:41:24'),
(62, '1764704543276-719365407.jpeg', '2025-12-02 19:42:23'),
(63, '1764704986609.jpg', '2025-12-02 19:49:46'),
(64, '1764705079712.jpg', '2025-12-02 19:51:19'),
(65, '1764705188312-580627873.jpg', '2025-12-02 19:53:08'),
(66, '1764705276040-956298690.jpg', '2025-12-02 19:54:36'),
(67, '1764725657811.jpg', '2025-12-03 01:34:17'),
(68, '1764725712252.jpg', '2025-12-03 01:35:12'),
(69, '1764726023360-355482724.jpg', '2025-12-03 01:40:23'),
(70, '1764726086788-647374004.jpg', '2025-12-03 01:41:26'),
(71, '1764735731890.jpg', '2025-12-03 04:22:11'),
(72, '1764738173562-764113478.jpg', '2025-12-03 05:02:53'),
(73, '1764738318964-769731214.jpg', '2025-12-03 05:05:18'),
(74, '1764744014318.jpg', '2025-12-03 06:40:14'),
(75, '1764744077073.jpg', '2025-12-03 06:41:17'),
(76, '1764744495546-651201588.jpg', '2025-12-03 06:48:15'),
(77, '1764744540153-766930598.jpg', '2025-12-03 06:49:00');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `location_name`) VALUES
(1, 'Atrium'),
(2, 'Lobby'),
(3, 'Library'),
(4, 'Cafeteria'),
(5, 'Gymnasium'),
(6, 'Parking Area'),
(7, 'Computer Lab'),
(8, 'Nursing Lab'),
(9, 'Accounting Office'),
(10, 'Registrar’s Office'),
(11, 'Guidance Office'),
(12, 'Student Center'),
(13, 'Admin Office'),
(14, 'Clinic'),
(15, 'Faculty Room'),
(16, 'AVR (Audio Visual Room)'),
(17, 'Stairs'),
(18, 'Comfort Room'),
(19, 'Multi Purpose Hall A'),
(20, 'Multi Purpose Hall B'),
(21, 'Multi Purpose Hall C'),
(22, 'Lecture Hall A'),
(23, 'Lecture Hall B'),
(24, 'Lecture Hall C'),
(25, 'Others');

-- --------------------------------------------------------

--
-- Table structure for table `lost_reports`
--

CREATE TABLE `lost_reports` (
  `lost_id` int(11) NOT NULL,
  `lost_user` int(11) DEFAULT NULL,
  `external_lost_id` int(11) DEFAULT NULL,
  `item_lost` varchar(100) NOT NULL,
  `other_description` text DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `brand_lost` varchar(100) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `date_lost` datetime NOT NULL,
  `status` enum('missing','found','reject') DEFAULT 'missing',
  `media_id` int(11) DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `claimed_by` int(11) DEFAULT NULL,
  `claimed_by_name` varchar(100) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `location_description` text DEFAULT NULL,
  `date_claimed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lost_reports`
--

INSERT INTO `lost_reports` (`lost_id`, `lost_user`, `external_lost_id`, `item_lost`, `other_description`, `color_id`, `brand_lost`, `location_id`, `date_lost`, `status`, `media_id`, `reviewed_by`, `claimed_by`, `claimed_by_name`, `reason`, `location_description`, `date_claimed`) VALUES
(1, 3, NULL, 'Tumbler', '2025 Edition', 6, 'Starbucks', 12, '2025-12-02 19:52:00', 'found', 1, 1, 3, NULL, NULL, 'Inside the office', '2025-12-03 00:00:00'),
(2, 7, NULL, 'Neck Pillow', 'With stickers', 5, 'Miniso', 19, '2025-12-02 19:56:16', 'found', 3, 1, 7, NULL, NULL, 'First Floor', '2025-12-02 00:00:00'),
(3, 7, NULL, 'Hirono', 'With box', 8, 'Pop Mart', 13, '2025-12-02 19:58:59', 'found', 4, 1, 7, NULL, NULL, 'Fundamental Laboratory 1', '2025-12-02 00:00:00'),
(4, 15, NULL, 'Aviary Book', 'With plastic cover', 4, 'NBS', 2, '2025-12-02 20:09:18', 'found', 7, 2, 15, NULL, NULL, 'Near the guard', '2025-12-02 00:00:00'),
(5, 16, NULL, 'Smartwatch', 'None', 8, 'Apple', 17, '2025-12-02 20:12:07', 'found', 9, 4, 16, NULL, NULL, '2nd Floor', '2025-12-02 00:00:00'),
(6, 22, NULL, 'iPhone 15 Pro Max', 'With transparent case', 8, 'Apple', 15, '2025-12-02 22:20:44', 'missing', 36, NULL, NULL, NULL, NULL, 'CAS', NULL),
(7, 3, NULL, 'Bag', 'With personal stuff inside', 8, 'Nike', 18, '2025-12-02 22:26:33', 'missing', 38, NULL, NULL, NULL, NULL, 'At the 3rd floor', NULL),
(8, NULL, 6, 'Bag', 'With makeup inside', 7, 'Jansport', 13, '2025-12-02 12:54:00', 'reject', 40, 1, NULL, NULL, 'already been found', 'Near the girl\'s cr', NULL),
(9, 25, NULL, 'School Bag', 'With makeup kit inside', 7, 'Jansport', 13, '2025-12-03 00:52:24', 'found', 42, 1, 25, NULL, NULL, 'Near the girl\'s bathroom', '2025-12-03 00:00:00'),
(10, 25, NULL, 'Calculator', 'With case', 8, 'Casio', 5, '2025-12-03 00:56:58', 'found', 43, 1, 25, NULL, NULL, 'Inside the court', '2025-12-03 00:00:00'),
(11, 6, NULL, 'Lunchbox', 'clean lunchbox', 8, 'Kleen Kanteen', 4, '2025-12-03 01:08:58', 'found', 45, 1, 6, NULL, NULL, 'Pericos', '2025-12-03 00:00:00'),
(12, 3, NULL, 'Portable Fan', 'With transparent casing', 8, 'Goodjodoq', 1, '2025-12-03 02:11:51', 'missing', 47, NULL, NULL, NULL, NULL, 'At one of the benches near the stairs', NULL),
(13, 3, NULL, 'Portable Fan', 'With transparent case', 8, 'Goojodoq', 1, '2025-11-30 02:20:10', 'reject', 48, 1, NULL, NULL, 'multiple entry', 'Near the staircase', NULL),
(14, 3, NULL, 'Portable Fan', 'With case', 8, 'Goojodoq', 14, '2025-11-30 02:20:31', 'reject', 49, 1, NULL, NULL, 'wrong location', 'First Floor', NULL),
(15, 12, NULL, 'Earbuds', 'Anker r50i NC', 4, 'Anker', 7, '2025-12-01 02:56:33', 'found', 50, 1, 12, NULL, NULL, 'Computer Laboratory 1', '2025-12-03 00:00:00'),
(16, 1, NULL, 'Airpods Pro 3', 'With case', 8, 'Apple', 16, '2025-12-03 03:02:01', 'reject', 53, 1, NULL, NULL, 'Wrong location', '2nd Floor', NULL),
(17, 1, NULL, 'Airpods Pro 3', 'With mario case', 8, 'Apple', 21, '2025-12-03 03:03:10', 'reject', 54, 1, NULL, NULL, 'wrong location', 'New renovated room', NULL),
(18, 1, NULL, 'Airpods', 'With case', 8, 'Apple', 6, '2025-12-03 03:21:29', 'found', 59, 1, 1, NULL, NULL, 'Near the guard', '2025-12-03 00:00:00'),
(19, 1, NULL, 'Keyboard', 'Aula F75', 8, 'Aula', 12, '2025-12-02 03:41:24', 'found', 61, 1, 1, NULL, NULL, 'Inside the student council', '2025-12-03 00:00:00'),
(20, 14, NULL, 'Speaker', 'JBL Xtreme', 8, 'JBL', 15, '2025-12-03 03:49:46', 'reject', 63, 1, NULL, NULL, 'duplicate entry', 'MDCON', NULL),
(21, 1, NULL, 'iPad', 'iPad 10th Generation', 8, 'Apple', 25, '2025-12-03 03:53:08', 'missing', 65, NULL, NULL, NULL, NULL, 'Room 406', NULL),
(22, 22, NULL, 'Basketball', 'With scratches', 8, 'Molten', 5, '2025-12-02 09:34:17', 'reject', 67, 1, NULL, NULL, 'duplicate report from Laedy Bedonia', 'Court', NULL),
(23, NULL, 10, 'Basketball', 'With CAS name', 8, 'Molten', 5, '2025-12-03 09:40:23', 'found', 69, 1, NULL, 'Laedy Bedonia', NULL, 'Basketball court', '2025-12-03 00:00:00'),
(24, NULL, 12, 'Watch', 'Silver, with black details', 8, 'Rolex', 7, '2025-12-03 13:02:53', 'found', 72, 4, NULL, 'Strawberry Pink Balasbas', NULL, 'Under PC 1', '2025-12-03 00:00:00'),
(25, 3, NULL, 'Eyeglass', 'With transparent case', 8, 'Sunnies Studios', 3, '2025-12-03 14:40:14', 'reject', 74, 1, NULL, NULL, 'no updates', 'College Library - Under PC2', NULL),
(26, NULL, 14, 'Mouse', 'With stickers', 8, 'Rapoo', 12, '2025-12-03 14:48:15', 'found', 76, 1, 22, NULL, NULL, 'SC', '2025-12-03 00:00:00');

--
-- Triggers `lost_reports`
--
DELIMITER $$
CREATE TRIGGER `notify_lost_report_claimed` AFTER UPDATE ON `lost_reports` FOR EACH ROW BEGIN
    -- ONLY send notification if lost_user is NOT NULL (internal user)
    IF NEW.status = 'found' 
       AND OLD.status <> 'found' 
       AND NEW.lost_user IS NOT NULL THEN
        
        INSERT INTO notifications (user_id, message, status, created_at)
        VALUES (
            NEW.lost_user,
            CONCAT('Your lost report with the tagged Lost ID #', NEW.lost_id, ' has been successfully claimed.'),
            'Unread',
            NOW()
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_lost_report_rejected` AFTER UPDATE ON `lost_reports` FOR EACH ROW BEGIN
    -- ONLY send notification if lost_user is NOT NULL (internal user)
    IF NEW.status = 'reject' 
       AND OLD.status <> 'reject' 
       AND NEW.lost_user IS NOT NULL THEN
        
        INSERT INTO notifications (user_id, message, status, created_at)
        VALUES (
            NEW.lost_user,
            CONCAT('Your lost report with the tagged Lost ID #', NEW.lost_id, ' has been rejected due to ', IFNULL(NEW.reason, 'No reason provided')),
            'Unread',
            NOW()
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_lost_found_notification` AFTER UPDATE ON `lost_reports` FOR EACH ROW BEGIN
    -- Fire only when status actually changes to 'found'
    IF NEW.status = 'found' AND OLD.status <> 'found' THEN
        
        INSERT INTO admin_notifications (message, status, created_at)
        VALUES (
            CONCAT(
                'Lost report ID #', NEW.lost_id,
                ' has been successfully returned to its owner.'
            ),
            'unread',
            NOW()
        );

    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_lost_reject_notification` AFTER UPDATE ON `lost_reports` FOR EACH ROW BEGIN
    -- Check if status changed to reject
    IF NEW.status = 'reject' AND OLD.status <> 'reject' THEN
        
        INSERT INTO admin_notifications (message, status, created_at)
        VALUES (
            CONCAT(
                'Lost report ID #', NEW.lost_id,
                ' was tagged as rejected due to ',
                NEW.reason
            ),
            'unread',
            NOW()
        );
        
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `message`, `status`, `created_at`) VALUES
(1, 3, 'Your lost report has been submitted with Lost ID #1', 'read', '2025-12-02 11:52:00'),
(2, 6, 'Your found report with Report ID #1 is now pending for approval.', 'unread', '2025-12-02 11:53:32'),
(3, 6, 'Your found report with the tagged Report ID #1 has been approved and tagged as missing.', 'unread', '2025-12-02 11:54:29'),
(4, 6, 'Your found report with the tagged Report ID #1 has been successfully returned.', 'unread', '2025-12-02 11:54:50'),
(5, 3, 'Your lost report with the tagged Lost ID #1 has been successfully claimed.', 'read', '2025-12-02 11:54:50'),
(6, 7, 'Your lost report has been submitted with Lost ID #2', 'unread', '2025-12-02 11:56:16'),
(7, 7, 'Your lost report has been submitted with Lost ID #3', 'unread', '2025-12-02 11:58:59'),
(8, 8, 'Your found report with Report ID #2 is now pending for approval.', 'unread', '2025-12-02 12:02:02'),
(9, 8, 'Your found report with the tagged Report ID #2 has been approved and tagged as missing.', 'unread', '2025-12-02 12:03:23'),
(10, 8, 'Your found report with the tagged Report ID #2 has been successfully returned.', 'unread', '2025-12-02 12:03:44'),
(11, 7, 'Your lost report with the tagged Lost ID #2 has been successfully claimed.', 'unread', '2025-12-02 12:03:44'),
(12, 3, 'Your found report with Report ID #3 is now pending for approval.', 'read', '2025-12-02 12:06:38'),
(13, 3, 'Your found report with the tagged Report ID #3 has been approved and tagged as missing.', 'read', '2025-12-02 12:06:53'),
(14, 3, 'Your found report with the tagged Report ID #3 has been successfully returned.', 'read', '2025-12-02 12:07:11'),
(15, 7, 'Your lost report with the tagged Lost ID #3 has been successfully claimed.', 'unread', '2025-12-02 12:07:11'),
(16, 15, 'Your lost report has been submitted with Lost ID #4', 'unread', '2025-12-02 12:09:18'),
(17, 17, 'Your found report with Report ID #4 is now pending for approval.', 'unread', '2025-12-02 12:10:28'),
(18, 17, 'Your found report with the tagged Report ID #4 has been approved and tagged as missing.', 'unread', '2025-12-02 12:10:53'),
(19, 17, 'Your found report with the tagged Report ID #4 has been successfully returned.', 'unread', '2025-12-02 12:11:11'),
(20, 15, 'Your lost report with the tagged Lost ID #4 has been successfully claimed.', 'unread', '2025-12-02 12:11:11'),
(21, 16, 'Your lost report has been submitted with Lost ID #5', 'unread', '2025-12-02 12:12:07'),
(22, 14, 'Your found report with Report ID #5 is now pending for approval.', 'unread', '2025-12-02 12:12:52'),
(23, 14, 'Your found report with the tagged Report ID #5 has been approved and tagged as missing.', 'unread', '2025-12-02 12:13:12'),
(24, 14, 'Your found report with the tagged Report ID #5 has been successfully returned.', 'unread', '2025-12-02 12:13:37'),
(25, 16, 'Your lost report with the tagged Lost ID #5 has been successfully claimed.', 'unread', '2025-12-02 12:13:37'),
(26, 3, 'Your lost report has been submitted with Lost ID #6', 'read', '2025-12-02 13:19:18'),
(27, 10, 'Your lost report has been submitted with Lost ID #7', 'unread', '2025-12-02 13:21:04'),
(28, 16, 'Your lost report has been submitted with Lost ID #8', 'unread', '2025-12-02 13:22:38'),
(29, 18, 'Your lost report has been submitted with Lost ID #9', 'unread', '2025-12-02 13:23:49'),
(30, 24, 'Your lost report has been submitted with Lost ID #10', 'unread', '2025-12-02 13:24:27'),
(31, 26, 'Your lost report has been submitted with Lost ID #11', 'unread', '2025-12-02 13:25:03'),
(32, 27, 'Your lost report has been submitted with Lost ID #12', 'unread', '2025-12-02 13:25:51'),
(33, 27, 'Your lost report with the tagged Lost ID #12 has been rejected due to Already found', 'unread', '2025-12-02 13:28:37'),
(34, 26, 'Your lost report with the tagged Lost ID #11 has been rejected due to Left in their house', 'unread', '2025-12-02 13:28:49'),
(35, 24, 'Your lost report with the tagged Lost ID #10 has been rejected due to multiple entry', 'unread', '2025-12-02 13:30:22'),
(40, 3, 'Your found report with Report ID #6 is now pending for approval.', 'read', '2025-12-02 13:35:42'),
(41, 3, 'Your found report with the tagged Report ID #6 has been rejected due to duplicate entry', 'read', '2025-12-02 13:36:16'),
(42, 6, 'Your found report with Report ID #7 is now pending for approval.', 'unread', '2025-12-02 13:39:43'),
(43, 10, 'Your found report with Report ID #8 is now pending for approval.', 'unread', '2025-12-02 13:40:26'),
(44, 10, 'Your found report with Report ID #9 is now pending for approval.', 'unread', '2025-12-02 13:41:02'),
(45, 10, 'Your found report with Report ID #10 is now pending for approval.', 'unread', '2025-12-02 13:41:40'),
(46, 23, 'Your found report with Report ID #11 is now pending for approval.', 'unread', '2025-12-02 13:42:30'),
(47, 23, 'Your found report with the tagged Report ID #11 has been rejected due to has been found by their classmates', 'unread', '2025-12-02 13:43:01'),
(48, 10, 'Your found report with the tagged Report ID #10 has been rejected due to left in their own home', 'unread', '2025-12-02 13:43:13'),
(49, 10, 'Your found report with the tagged Report ID #9 has been rejected due to found inside their classroom', 'unread', '2025-12-02 13:44:09'),
(50, 10, 'Your found report with the tagged Report ID #8 has been rejected due to found inside the mac lab', 'unread', '2025-12-02 13:44:23'),
(51, 6, 'Your found report with the tagged Report ID #7 has been rejected due to duplicate entry', 'unread', '2025-12-02 13:44:31'),
(52, 17, 'Your found report with Report ID #17 is now pending for approval.', 'unread', '2025-12-02 14:06:04'),
(53, 17, 'Your found report with Report ID #18 is now pending for approval.', 'unread', '2025-12-02 14:06:47'),
(54, 17, 'Your found report with the tagged Report ID #17 has been approved and tagged as missing.', 'unread', '2025-12-02 14:11:54'),
(55, 17, 'Your found report with the tagged Report ID #18 has been approved and tagged as missing.', 'unread', '2025-12-02 14:11:58'),
(56, 4, 'Your found report with the tagged Report ID #19 has been approved and tagged as missing.', 'unread', '2025-12-02 14:12:00'),
(57, 1, 'Your found report with the tagged Report ID #20 has been approved and tagged as missing.', 'unread', '2025-12-02 14:12:03'),
(58, 13, 'Your found report with Report ID #21 is now pending for approval.', 'unread', '2025-12-02 14:15:22'),
(59, 14, 'Your found report with Report ID #22 is now pending for approval.', 'unread', '2025-12-02 14:16:42'),
(60, 20, 'Your found report with Report ID #23 is now pending for approval.', 'unread', '2025-12-02 14:18:21'),
(61, 22, 'Your lost report has been submitted with Lost ID #6', 'unread', '2025-12-02 14:20:44'),
(62, 6, 'Your found report with Report ID #24 is now pending for approval.', 'unread', '2025-12-02 14:22:37'),
(63, 3, 'Your lost report has been submitted with Lost ID #7', 'read', '2025-12-02 14:26:33'),
(64, 11, 'Your found report with Report ID #25 is now pending for approval.', 'unread', '2025-12-02 14:27:33'),
(65, 25, 'Your lost report has been submitted with Lost ID #9', 'unread', '2025-12-02 16:52:24'),
(66, 25, 'Your lost report with the tagged Lost ID #9 has been successfully claimed.', 'unread', '2025-12-02 16:53:31'),
(67, 25, 'Your lost report has been submitted with Lost ID #10', 'unread', '2025-12-02 16:56:58'),
(68, 24, 'Your found report with Report ID #27 is now pending for approval.', 'unread', '2025-12-02 16:58:18'),
(69, 24, 'Your found report with the tagged Report ID #27 has been approved and tagged as missing.', 'unread', '2025-12-02 16:58:48'),
(70, 24, 'Your found report with the tagged Report ID #27 has been successfully returned.', 'unread', '2025-12-02 16:59:19'),
(71, 25, 'Your lost report with the tagged Lost ID #10 has been successfully claimed.', 'unread', '2025-12-02 16:59:19'),
(72, 6, 'Your lost report has been submitted with Lost ID #11', 'unread', '2025-12-02 17:08:58'),
(73, 11, 'Your found report with Report ID #28 is now pending for approval.', 'unread', '2025-12-02 17:09:58'),
(74, 11, 'Your found report with the tagged Report ID #28 has been approved and tagged as missing.', 'unread', '2025-12-02 17:10:39'),
(75, 11, 'Your found report with the tagged Report ID #28 has been successfully returned.', 'unread', '2025-12-02 17:11:01'),
(76, 6, 'Your lost report with the tagged Lost ID #11 has been successfully claimed.', 'unread', '2025-12-02 17:11:01'),
(77, 3, 'Your lost report has been submitted with Lost ID #12', 'read', '2025-12-02 18:11:51'),
(78, 3, 'Your lost report has been submitted with Lost ID #13', 'read', '2025-12-02 18:31:04'),
(79, 3, 'Your lost report has been submitted with Lost ID #14', 'read', '2025-12-02 18:34:04'),
(80, 3, 'Your lost report with the tagged Lost ID #14 has been rejected due to wrong location', 'read', '2025-12-02 18:35:00'),
(81, 3, 'Your lost report with the tagged Lost ID #13 has been rejected due to wrong description', 'read', '2025-12-02 18:36:33'),
(82, 3, 'Your lost report with the tagged Lost ID #13 has been rejected due to multiple entry', 'unread', '2025-12-02 18:45:28'),
(83, 3, 'Your lost report with the tagged Lost ID #13 has been rejected due to redundant report', 'unread', '2025-12-02 18:46:53'),
(84, 3, 'Your lost report with the tagged Lost ID #13 has been rejected due to multiple entry', 'unread', '2025-12-02 18:54:09'),
(85, 12, 'Your lost report has been submitted with Lost ID #15', 'unread', '2025-12-02 18:56:33'),
(86, 13, 'Your found report with Report ID #29 is now pending for approval.', 'unread', '2025-12-02 18:57:47'),
(87, 13, 'Your found report with Report ID #30 is now pending for approval.', 'unread', '2025-12-02 18:58:29'),
(88, 13, 'Your found report with the tagged Report ID #29 has been rejected due to duplicate entry', 'unread', '2025-12-02 18:59:16'),
(89, 13, 'Your found report with the tagged Report ID #30 has been approved and tagged as missing.', 'unread', '2025-12-02 18:59:52'),
(90, 13, 'Your found report with the tagged Report ID #30 has been successfully returned.', 'unread', '2025-12-02 19:00:16'),
(91, 12, 'Your lost report with the tagged Lost ID #15 has been successfully claimed.', 'unread', '2025-12-02 19:00:16'),
(92, 1, 'Your lost report with the tagged Lost ID #16 has been rejected due to Wrong location', 'unread', '2025-12-02 19:02:26'),
(93, 1, 'Your lost report with the tagged Lost ID #17 has been rejected due to wrong location', 'unread', '2025-12-02 19:22:25'),
(94, 1, 'Your lost report with the tagged Lost ID #18 has been successfully claimed.', 'unread', '2025-12-02 19:25:54'),
(95, 1, 'Your lost report with the tagged Lost ID #19 has been rejected due to False', 'unread', '2025-12-02 19:44:29'),
(96, 2, 'Your found report with the tagged Report ID #32 has been approved and tagged as missing.', 'unread', '2025-12-02 19:44:53'),
(97, 2, 'Your found report with the tagged Report ID #32 has been successfully returned.', 'unread', '2025-12-02 19:45:14'),
(98, 1, 'Your lost report with the tagged Lost ID #19 has been successfully claimed.', 'unread', '2025-12-02 19:45:14'),
(99, 13, 'Your found report with the tagged Report ID #21 has been rejected due to founded already', 'unread', '2025-12-02 19:47:25'),
(100, 11, 'Your found report with the tagged Report ID #25 has been approved and tagged as missing.', 'unread', '2025-12-02 19:47:38'),
(101, 14, 'Your lost report has been submitted with Lost ID #20', 'unread', '2025-12-02 19:49:46'),
(102, 20, 'Your found report with Report ID #33 is now pending for approval.', 'unread', '2025-12-02 19:51:19'),
(103, 22, 'Your lost report has been submitted with Lost ID #22', 'unread', '2025-12-03 01:34:17'),
(104, 22, 'Your found report with Report ID #35 is now pending for approval.', 'unread', '2025-12-03 01:35:12'),
(105, 20, 'Your found report with the tagged Report ID #33 has been approved and tagged as missing.', 'unread', '2025-12-03 01:37:28'),
(106, 22, 'Your found report with the tagged Report ID #35 has been rejected due to false report', 'unread', '2025-12-03 01:38:18'),
(107, 22, 'Your lost report with the tagged Lost ID #22 has been rejected due to duplicate report from Laedy Bedonia', 'unread', '2025-12-03 01:43:38'),
(108, 3, 'Your found report with Report ID #37 is now pending for approval.', 'unread', '2025-12-03 04:22:11'),
(109, 14, 'Your lost report with the tagged Lost ID #20 has been rejected due to duplicate entry', 'unread', '2025-12-03 04:45:36'),
(110, 3, 'Your lost report has been submitted with Lost ID #25', 'unread', '2025-12-03 06:40:14'),
(111, 3, 'Your found report with Report ID #39 is now pending for approval.', 'unread', '2025-12-03 06:41:17'),
(112, 3, 'Your found report with the tagged Report ID #39 has been rejected due to duplicate entry', 'unread', '2025-12-03 06:43:54'),
(113, 3, 'Your lost report with the tagged Lost ID #25 has been rejected due to no updates', 'unread', '2025-12-03 06:44:54'),
(114, 3, 'Your found report with the tagged Report ID #37 has been approved and tagged as missing.', 'unread', '2025-12-03 06:45:36'),
(115, 1, 'Your found report with the tagged Report ID #40 has been approved and tagged as missing.', 'unread', '2025-12-03 06:49:14'),
(116, 1, 'Your found report with the tagged Report ID #40 has been successfully returned.', 'unread', '2025-12-03 06:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email_user` varchar(100) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  `fname_user` varchar(50) NOT NULL,
  `mname_user` varchar(50) DEFAULT NULL,
  `lname_user` varchar(50) NOT NULL,
  `contact_user` varchar(20) DEFAULT NULL,
  `role` enum('student','admin','staff','maintenance') NOT NULL,
  `program` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email_user`, `password_user`, `fname_user`, `mname_user`, `lname_user`, `contact_user`, `role`, `program`, `created_at`) VALUES
(1, 'ace.medina@mtc.edu.ph', '1234', 'Ace', '', 'Uy', '9171234567', 'admin', NULL, '2025-10-31 09:03:54'),
(2, 'rhaiza.narciso@mtc.edu.ph', 'qwe', 'Rhaiza', 'Casabuena', 'Narciso', '9173456218', 'admin', NULL, '2025-10-31 09:03:54'),
(3, 'juancho.hernandez@mtc.edu.ph', 'asd', 'Juancho', 'Portez', 'Hernandez', '9282345987', 'staff', NULL, '2025-10-31 09:03:54'),
(4, 'levine.centeno@mtc.edu.ph', '123', 'Levine', 'Apostol', 'Centeno', '9081239876', 'admin', NULL, '2025-10-31 09:03:54'),
(5, 'ry@mtc.edu.ph', '123', 'Harry', 'Bolilan', 'Uy', '9184567239', 'admin', NULL, '2025-10-31 09:03:54'),
(6, 'maria.cruz@mtc.edu.ph', 'pass123', 'Maria', 'Smith', 'Cruz', '9281234567', 'student', 'BSIT', '2025-10-31 09:03:54'),
(7, 'john.santos@mtc.edu.ph', 'qwerty', 'John', 'Johnson', 'Santos', '9081231234', 'student', 'BSBA FM', '2025-10-31 09:03:54'),
(8, 'karen.delrosario@mtc.edu.ph', 'hello123', 'Karen', 'Williams', 'Del Rosario', '9381231212', 'student', 'BSN', '2025-10-31 09:03:54'),
(9, 'mark.garcia@mtc.edu.ph', 'admin2025', 'Mark', 'Brown', 'Garcia', '9183456789', 'admin', NULL, '2025-10-31 09:03:54'),
(10, 'angelica.reyes@mtc.edu.ph', 'angel123', 'Angelica', 'Jones', 'Reyes', '9184561234', 'student', 'BSED', '2025-10-31 09:03:54'),
(11, 'carlo.diaz@mtc.edu.ph', 'c@123', 'Carlo', 'Garcia', 'Diaz', '9095672341', 'student', 'BSIT', '2025-10-31 09:03:54'),
(12, 'paula.mendoza@mtc.edu.ph', 'paula321', 'Paula', 'Miller', 'Mendoza', '9183459678', 'staff', NULL, '2025-10-31 09:03:54'),
(13, 'miguel.ramos@mtc.edu.ph', 'miguel07', 'Miguel', 'Davis', 'Ramos', '9284567812', 'student', 'BSBA FM', '2025-10-31 09:03:54'),
(14, 'alyssa.fernandez@mtc.edu.ph', 'alyssa09', 'Alyssa', 'Rodriguez', 'Fernandez', '9384567813', 'maintenance', NULL, '2025-10-31 09:03:54'),
(15, 'patrick.lim@mtc.edu.ph', 'patlim', 'Patrick', 'Martinez', 'Lim', '9175678901', 'student', 'BSCS', '2025-10-31 09:03:54'),
(16, 'diana.morales@mtc.edu.ph', 'diana22', 'Diana', 'Hernandez', 'Morales', '9281239856', 'staff', NULL, '2025-10-31 09:03:54'),
(17, 'ethan.valdez@mtc.edu.ph', 'ethan45', 'Ethan', 'Lopez', 'Valdez', '9183456701', 'student', 'BSIT', '2025-10-31 09:03:54'),
(18, 'sophia.gonzales@mtc.edu.ph', 'sophia88', 'Sophia', 'Gonzales', 'Gonzales', '9381234577', 'student', 'BSHM', '2025-10-31 09:03:54'),
(19, 'james.delacruz@mtc.edu.ph', 'james01', 'James', 'Wilson', 'Dela Cruz', '9173450987', 'admin', NULL, '2025-10-31 09:03:54'),
(20, 'trisha.alcantara@mtc.edu.ph', 'trisha10', 'Trisha', 'Anderson', 'Alcantara', '9282345671', 'student', 'BSED', '2025-10-31 09:03:54'),
(21, 'justin.rodriguez@mtc.edu.ph', 'justin55', 'Justin', 'Herrera', 'Rodriguez', '9385672134', 'student', 'BSN', '2025-10-31 09:03:54'),
(22, 'bea.lorenzo@mtc.edu.ph', 'bea22', 'Bea', 'Aguilar', 'Lorenzo', '9182347658', 'maintenance', NULL, '2025-10-31 09:03:54'),
(23, 'roxanne.santos@mtc.edu.ph', 'roxanne33', 'Roxanne', 'Sinclair', 'Santos', '9283456790', 'staff', NULL, '2025-10-31 09:03:54'),
(24, 'kevin.rivera@mtc.edu.ph', 'kevin90', 'Kevin', 'West', 'Rivera', '9185672345', 'student', 'BSIT', '2025-10-31 09:03:54'),
(25, 'louise.mercado@mtc.edu.ph', 'louise04', 'Louise', 'Harper', 'Mercado', '9381237654', 'student', 'BSBA FM', '2025-10-31 09:03:54'),
(26, 'francis.bautista@mtc.edu.ph', 'francis11', 'Francis', 'Elsher', 'Bautista', '9173450977', 'student', 'BSCS', '2025-10-31 09:03:54'),
(27, 'cheska.lopez@mtc.edu.ph', 'cheska01', 'Cheska', 'Abraham', 'Lopez', '9283457623', 'student', 'BSHM', '2025-10-31 09:03:54'),
(28, 'renzo.santiago@mtc.edu.ph', 'renzo44', 'Renzo', 'Acker', 'Santiago', '9183451276', 'student', 'BSIT', '2025-10-31 09:03:54'),
(29, 'andrea.delapaz@mtc.edu.ph', 'andrea12', 'Andrea', 'Raven', 'Dela Paz', '9382349876', 'student', 'BSN', '2025-10-31 09:03:54'),
(30, 'karen.rosario@temp.mtc.edu.ph', 'temp123', 'Karen', NULL, 'Rosario', NULL, 'student', NULL, '2025-11-22 11:00:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`color_id`);

--
-- Indexes for table `external_users`
--
ALTER TABLE `external_users`
  ADD PRIMARY KEY (`external_id`);

--
-- Indexes for table `found_reports`
--
ALTER TABLE `found_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `founded_user` (`founded_user`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `claimed_by` (`claimed_by`),
  ADD KEY `reviewed_by` (`reviewed_by`),
  ADD KEY `fk_found_media` (`media_id`),
  ADD KEY `fk_found_external_user` (`external_founded_id`);

--
-- Indexes for table `item_media`
--
ALTER TABLE `item_media`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `lost_reports`
--
ALTER TABLE `lost_reports`
  ADD PRIMARY KEY (`lost_id`),
  ADD KEY `lost_user` (`lost_user`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `fk_lost_media` (`media_id`),
  ADD KEY `lost_reports_ibfk_5` (`reviewed_by`),
  ADD KEY `lost_reports_ibfk_4` (`claimed_by`),
  ADD KEY `fk_lost_external_user` (`external_lost_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email_user` (`email_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `color`
--
ALTER TABLE `color`
  MODIFY `color_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `external_users`
--
ALTER TABLE `external_users`
  MODIFY `external_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `found_reports`
--
ALTER TABLE `found_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `item_media`
--
ALTER TABLE `item_media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `lost_reports`
--
ALTER TABLE `lost_reports`
  MODIFY `lost_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `found_reports`
--
ALTER TABLE `found_reports`
  ADD CONSTRAINT `fk_found_external_user` FOREIGN KEY (`external_founded_id`) REFERENCES `external_users` (`external_id`),
  ADD CONSTRAINT `fk_found_media` FOREIGN KEY (`media_id`) REFERENCES `item_media` (`media_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `found_reports_ibfk_1` FOREIGN KEY (`founded_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `found_reports_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`color_id`),
  ADD CONSTRAINT `found_reports_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  ADD CONSTRAINT `found_reports_ibfk_4` FOREIGN KEY (`claimed_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `found_reports_ibfk_5` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `lost_reports`
--
ALTER TABLE `lost_reports`
  ADD CONSTRAINT `fk_lost_external_user` FOREIGN KEY (`external_lost_id`) REFERENCES `external_users` (`external_id`),
  ADD CONSTRAINT `fk_lost_media` FOREIGN KEY (`media_id`) REFERENCES `item_media` (`media_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lost_reports_ibfk_1` FOREIGN KEY (`lost_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lost_reports_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`color_id`),
  ADD CONSTRAINT `lost_reports_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  ADD CONSTRAINT `lost_reports_ibfk_4` FOREIGN KEY (`claimed_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `lost_reports_ibfk_5` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
