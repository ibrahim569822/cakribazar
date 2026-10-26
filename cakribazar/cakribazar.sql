-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2026 at 06:52 AM
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
-- Database: `cakribazar`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(10) UNSIGNED NOT NULL,
  `job_id` int(10) UNSIGNED NOT NULL,
  `seeker_id` int(10) UNSIGNED NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `status` tinyint(3) UNSIGNED DEFAULT 1 COMMENT '1=applied, 2=viewed, 3=shortlisted, 4=interviewed, 5=hired, 6=rejected',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A seeker applying to a job';

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `seeker_id`, `cover_letter`, `resume`, `status`, `applied_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 1, 12, '**Cover Letter for Sales Executive Position**\r\n\r\nDear Hiring Manager,\r\n\r\nI am writing to express my interest in the Sales Executive position at your organization. I am a motivated, hardworking, and enthusiastic individual with strong communication, interpersonal, and customer service skills. I am eager to contribute to your company\'s growth by building strong customer relationships and achieving sales targets.\r\n\r\nI am confident in my ability to communicate effectively with customers, understand their needs, promote products or services, and identify new business opportunities. I am also willing to learn new strategies, work collaboratively with a team, and take on challenges to improve my professional skills.\r\n\r\nI would appreciate the opportunity to discuss how my skills, dedication, and enthusiasm can contribute to your organization\'s success. Thank you for considering my application. I look forward to hearing from you.\r\n\r\nSincerely,  \r\nAkib', 'images/applications/11806691151252513539job_portal_database.docx', 5, '2026-10-26 04:44:31', '2026-10-26 04:44:31', '2026-10-26 04:56:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Job categories';

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Software Development', 'Software_Development', 'images/category/497224712laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_39422-971.avif', 'Software Engineer, Web Developer, Mobile App Developer, DevOps Engineer', '2026-10-26 04:29:11', '2026-10-26 04:29:11', NULL),
(2, 'Finance & Accounting', 'Finance_accounting', 'images/category/728203693accountintg-vs-finance.jpg', 'Accountant, Financial Analyst, Investment Banker, Actuary, Auditor', '2026-10-26 04:30:23', '2026-10-26 04:30:23', NULL),
(3, 'Sales', 'sales', 'images/category/363299626images (2).jfif', 'Sales Representative, Account Executive, Business Development Manager', '2026-10-26 04:31:21', '2026-10-26 04:31:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'NULL = managed by admin; set when employer gets own login',
  `name` varchar(150) NOT NULL,
  `logo` varchar(255) DEFAULT NULL COMMENT 'Path of logo file',
  `website` varchar(200) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `size` varchar(30) DEFAULT NULL COMMENT 'Company size',
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '1=pending, 2=approved, 3=rejected',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employer company profile (one per employer)';

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `name`, `logo`, `website`, `industry`, `size`, `description`, `address`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 7, 'NVIT', 'images/companies/965396246images.png', 'https://nvit.com', 'Training Institute', '11-50', 'Welcome to New Vision Information Technology\r\nWe offer a wide range of high quality of teaching and extra-curricular activities.\r\n\r\nAs changes in technology have accelerated, it’s become even more essential for people to master technology to be productive, invaluable employees who optimize, program and invent solutions—and even grow companies of their own. Since March 2001 after its Inauguration, New Vision Information Technology Limited (NVIT) is involved in the arena of Information Technology, utilizing computer relating workforce in Bangladesh & Worldwide.\r\n\r\nOur solutions are designed and delivered to ensure that technology creates a measurable business or professional value for our clients. Over the past 20 years, we have provided a full range of technology and business skills solutions through innovative learning methods & Digital solutions that have transformed businesses and helped over 40 thousand Individuals & Companies to reach their goals.\r\n\r\nNVIT serves as a channel to consistently deliver the most comprehensive content wherever and whenever needed. We seamlessly integrate learning into employees’ key job responsibilities. Sustainable business value is formulated through our team by aligning plans and priorities with lean technology budgets and training. We have become the industry leaders by committing to quality, partner development, and customer service.\r\n\r\nWhether you are looking for complex IT solutions for your business or expanding your career path or business growth, we are here to help.', '2 no Gate, Solosohor, Chattogram', 1, '2026-10-13 06:41:20', '2026-10-17 06:32:38', NULL),
(7, 0, 'Pran RFL', 'images/companies/766628040rfl-logo-png_seeklogo-250040.png', 'https://rflbd.com', 'plastic', '500+', 'RFL started its journey with cast iron (CI) products in 1981. The initial main objective was to ensure pure water and affordable irrigation instruments for improving rural life. Today the company has its wide ranges of CI products like pumps, tube wells, bearings, gas stoves, etc. and has achieved prestige as the largest cast iron foundry and light engineering workshop in Bangladesh. \r\n\r\nWith a vision to serve the common people of Bangladesh with quality necessary products, RFL diversified its operation into the PVC category in 1996 and in the plastic sector in 2003. At present it is the market leader in all these three sectors-cast iron, PVC and Plastic in the country. A sizable amount is also exported to different countries.\r\n\r\nIt is equipped with in-house R & D facilities to design and develop new products. A well-organized owned testing laboratory is used to ensure quality products. RFL has been awarded BSTI certificate and IS09001 Certificate for its strict compliance with the standard set by both the organizations.\r\n\r\nWe are a very strong organization of 192,000 employees dedicated to supplying customized and quality plastics, PVC & CI products.\r\n\r\nRFL has become a benchmark for competitors on the lines of quality by manufacturing premium quality products to give clients excellent services and true value for money. The unmatched products have given a big name in the domestic market. This is possible because the company is professionally managed and promoted by people who ensure creativity.\r\n\r\nWe welcome the opportunity to become your manufacturing partner in your business journey.\r\n\r\nRFL ranges to a variety of product categories. Over 6000 products in 20 different categories which includes Cast Iron, PVC Pipes, Fittings, Household, Electronics & Accessories, Construction & Building Materials, Melamine, Sanitary & Bathroom Fittings, Furniture, Kitchenware, Electric Cables, Paints, Readymade Garments & Textile and Others.\r\n\r\nFurthermore, RFL has extended its venture into the retail business as well. It includes Vision Emporium, Walkar, Rainbow Paints, Regal, Duranto Sports Gallery and RYDO.', 'Dhaka', 1, '2026-10-26 04:32:58', '2026-10-26 04:33:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(10) UNSIGNED NOT NULL,
  `seeker_id` int(10) UNSIGNED NOT NULL,
  `degree` varchar(100) NOT NULL,
  `institution` varchar(150) NOT NULL,
  `field` varchar(100) DEFAULT NULL COMMENT 'Subject / major',
  `passing_year` year(4) DEFAULT NULL,
  `result` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Seeker education history';

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `seeker_id`, `degree`, `institution`, `field`, `passing_year`, `result`, `created_at`, `updated_at`, `deleted_at`) VALUES
(5, 12, 'BBA', 'National University', 'Accounting', '2022', '2.65', '2026-10-26 04:21:07', '2026-10-26 04:21:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id` int(10) UNSIGNED NOT NULL,
  `seeker_id` int(10) UNSIGNED NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `position` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL COMMENT 'NULL if current job',
  `is_current` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=no, 1=yes',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Seeker work experience';

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`id`, `seeker_id`, `company_name`, `position`, `start_date`, `end_date`, `is_current`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 12, 'RFL', 'Sales Executivee', '2022-02-27', '2024-03-31', 0, 'Key Responsibilities:\r\n\r\nIdentify and approach potential customers to generate new sales opportunities.\r\n\r\nPresent and promote products or services to customers.\r\n\r\nBuild and maintain positive relationships with existing and prospective clients.\r\n\r\nAchieve monthly and quarterly sales targets.\r\n\r\nRespond to customer inquiries and provide accurate product information.\r\n\r\nPrepare sales reports and maintain customer records.\r\n\r\nFollow up with customers to ensure satisfaction and encourage repeat business.\r\n\r\nMonitor market trends and competitor activities.', '2026-10-26 04:22:31', '2026-10-26 04:22:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `education_requirement` text DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `job_type` tinyint(3) UNSIGNED NOT NULL COMMENT '1=full_time, 2=part_time, 3=contract, 4=internship, 5=remote',
  `experience_years` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `salary_min` int(10) UNSIGNED DEFAULT NULL,
  `salary_max` int(10) UNSIGNED DEFAULT NULL,
  `vacancies` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `deadline` date NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '1=pending, 2=active, 3=closed, 4=rejected',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Job postings';

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `company_id`, `category_id`, `title`, `icon`, `description`, `requirements`, `education_requirement`, `location`, `job_type`, `experience_years`, `salary_min`, `salary_max`, `vacancies`, `deadline`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, 3, 'Sales & Marketing Executive', 'images/jobs/1179779128sales-vs-marketing-executive.jpg', 'Job Description:\r\n\r\nWe are looking for a motivated and results-driven Sales Executive to join our team. The ideal candidate will be responsible for identifying potential customers, promoting products or services, maintaining strong customer relationships, and achieving sales targets.\r\n\r\nKey Responsibilities:\r\n\r\nIdentify and approach potential customers to generate new sales opportunities.\r\n\r\nPresent and promote products or services to customers.\r\n\r\nBuild and maintain positive relationships with existing and prospective clients.\r\n\r\nAchieve monthly and quarterly sales targets.\r\n\r\nRespond to customer inquiries and provide accurate product information.\r\n\r\nPrepare sales reports and maintain customer records.\r\n\r\nFollow up with customers to ensure satisfaction and encourage repeat business.\r\n\r\nMonitor market trends and competitor activities.', 'Requirements:\r\n\r\nGood communication and interpersonal skills.\r\n\r\nStrong negotiation and customer service abilities.\r\n\r\nAbility to work independently and as part of a team.\r\n\r\nTarget-oriented mindset with problem-solving skills.\r\n\r\nPrevious sales experience is an advantage but not always required.', 'BBA', 'Chattogram', 1, 2, 22000, 28500, 10, '2026-11-12', 2, '2026-10-26 04:36:34', '2026-10-26 04:43:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `seeker_id` int(10) UNSIGNED NOT NULL,
  `job_id` int(10) UNSIGNED NOT NULL,
  `saved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Jobs bookmarked by a seeker';

-- --------------------------------------------------------

--
-- Table structure for table `seeker_profiles`
--

CREATE TABLE `seeker_profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `job_title` varchar(150) DEFAULT NULL COMMENT 'Example: Junior PHP Developer',
  `summary` text DEFAULT NULL,
  `gender` tinyint(4) DEFAULT NULL COMMENT '1=male, 2=female, 3=other',
  `date_of_birth` date DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL COMMENT 'profile image path',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'soft delete',
  `twitter` varchar(255) NOT NULL,
  `linkedin` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seeker_profiles`
--

INSERT INTO `seeker_profiles` (`id`, `user_id`, `job_title`, `summary`, `gender`, `date_of_birth`, `country`, `address`, `image`, `created_at`, `updated_at`, `deleted_at`, `twitter`, `linkedin`) VALUES
(12, 12, 'Web designer', 'Motivated and detail-oriented individual with a strong willingness to learn and grow professionally. Possess good communication, problem-solving, and time management skills, with the ability to work independently and collaboratively in a team. Eager to contribute to organizational success while developing professional skills and gaining practical experience.', 1, '1997-12-29', 'Bangladesh', 'Admin Resort, 2 no Gate, Solosohor, Chattogram', 'images/profiles/1c824da96ccfee2de976d62241527fc8.jpg', '2026-10-26 04:15:16', '2026-10-26 04:16:34', NULL, 'twitter.com/akib123', 'linkedin.com/akib123');

-- --------------------------------------------------------

--
-- Table structure for table `seeker_skills`
--

CREATE TABLE `seeker_skills` (
  `seeker_id` int(10) UNSIGNED NOT NULL,
  `skill_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Link table: seeker <-> skill';

--
-- Dumping data for table `seeker_skills`
--

INSERT INTO `seeker_skills` (`seeker_id`, `skill_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(12, 3, '2026-10-26 04:28:19', '2026-10-26 04:28:19', NULL),
(12, 4, '2026-10-26 04:28:34', '2026-10-26 04:28:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master list of skills';

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 'Digital Skill', '2026-10-26 04:28:19', '2026-10-26 04:28:19', NULL),
(4, 'Communication', '2026-10-26 04:28:34', '2026-10-26 04:28:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `role` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1=seeker, 2=employer, 3=admin',
  `status` tinyint(3) UNSIGNED DEFAULT 1 COMMENT '1=active, 2=pending, 3=blocked',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete: NULL=not deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master table for all roles (seeker, employer, admin)';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `username`, `contact`, `password`, `remember_token`, `role`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, 'Md Ibrahim', 'wiliamsrroy@gmail.com', 'ibrahim2460095', '1251561', '7c4a8d09ca3762af61e59520943dc26494f8941b', '39631792898640688448', 3, 1, '2026-10-17 04:31:08', '2026-10-25 03:24:00', NULL),
(12, 'Akib Hossain', 'akib123@gmail.com', 'Akib123', '0145555', '7c4a8d09ca3762af61e59520943dc26494f8941b', '32051792990027777650', 1, 1, '2026-10-26 03:47:03', '2026-10-26 04:47:07', NULL),
(13, 'Mazhar Pritam', 'pritam123@gmail.com', 'Pritam123', '0145555', '7c4a8d09ca3762af61e59520943dc26494f8941b', '92141792989980708587', 1, 1, '2026-10-26 04:46:15', '2026-10-26 04:46:20', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_applications_job_seeker` (`job_id`,`seeker_id`) COMMENT 'Prevents duplicate applications',
  ADD KEY `idx_applications_seeker` (`seeker_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_education_seeker` (`seeker_id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_experience_seeker` (`seeker_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`seeker_id`,`job_id`),
  ADD KEY `idx_saved_jobs_job` (`job_id`);

--
-- Indexes for table `seeker_profiles`
--
ALTER TABLE `seeker_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_seeker_user` (`user_id`);

--
-- Indexes for table `seeker_skills`
--
ALTER TABLE `seeker_skills`
  ADD PRIMARY KEY (`seeker_id`,`skill_id`),
  ADD KEY `idx_seeker_skills_skill` (`skill_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_skills_name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`,`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `seeker_profiles`
--
ALTER TABLE `seeker_profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `fk_applications_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `fk_education_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_education_user_id` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `fk_experience_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_experience_user_id` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `fk_saved_jobs_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `fk_saved_jobs_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `seeker_profiles`
--
ALTER TABLE `seeker_profiles`
  ADD CONSTRAINT `fk_seeker_profiles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seeker_skills`
--
ALTER TABLE `seeker_skills`
  ADD CONSTRAINT `fk_seeker_skills_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_seeker_skills_user_id` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
