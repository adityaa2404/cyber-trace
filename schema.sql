-- =============================================
-- CyberTrace Database Schema
-- Database: MySQL 8.0
--
-- Implements BOTH schema designs from project spec:
--   Section 6.1 — Star Schema (Fact + Dimensions)
--   Section 6.2 — Snowflake Schema (Normalized Dimensions)
-- =============================================

CREATE DATABASE IF NOT EXISTS `cybertrace`;
USE `cybertrace`;


-- =============================================================
-- SECTION 6.2: SNOWFLAKE NORMALIZATION TABLES
-- These tables are normalized OUT of the dimension tables
-- to eliminate repeating data (e.g. department appears in
-- both user_dim and system_dim, so we store it once here)
-- =============================================================

-- Department table (shared by user_dim and system_dim)
-- Without this, "IT Security" would be stored in every user
-- AND every system row — snowflake fixes that duplication
CREATE TABLE `department` (
    `department_id` INT AUTO_INCREMENT PRIMARY KEY,
    `department_name` VARCHAR(100) NOT NULL UNIQUE,
    `location` VARCHAR(200) NULL
);

-- Attack category table (groups attack types)
-- Without this, "Application" would repeat in every attack
-- type row — snowflake fixes that duplication
CREATE TABLE `attack_category` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT NULL
);


-- =============================================================
-- SECTION 6.1: STAR SCHEMA — DIMENSION TABLES
-- These surround the central fact table like points of a star
-- Each dimension provides descriptive context for incidents
-- =============================================================

-- DIMENSION 1: Calendar (for time-based analytics)
-- Pre-populated with one row per day from 2024 to 2028
CREATE TABLE `date_dim` (
    `date_id` INT PRIMARY KEY COMMENT 'Format: YYYYMMDD, e.g. 20260320',
    `full_date` DATE NOT NULL UNIQUE,
    `day_of_week` TINYINT NOT NULL COMMENT '1=Monday, 7=Sunday',
    `day_name` VARCHAR(10) NOT NULL,
    `month` TINYINT NOT NULL,
    `month_name` VARCHAR(10) NOT NULL,
    `quarter` TINYINT NOT NULL,
    `year` SMALLINT NOT NULL,
    `is_weekend` BOOLEAN NOT NULL DEFAULT FALSE
);

-- DIMENSION 2: Attack types (e.g. SQL Injection, Phishing, DDoS)
-- Links to attack_category via FK (snowflake normalization)
CREATE TABLE `attack_dim` (
    `attack_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `attack_type_name` VARCHAR(150) NOT NULL UNIQUE,
    `category_id` INT NOT NULL,

    CONSTRAINT `fk_attack_category`
        FOREIGN KEY (`category_id`) REFERENCES `attack_category`(`category_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- DIMENSION 3: Users who report incidents
-- Links to department via FK (snowflake normalization)
CREATE TABLE `user_dim` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `department_id` INT NOT NULL,

    CONSTRAINT `fk_user_department`
        FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- DIMENSION 4: IT systems/assets that can be attacked
-- Links to department via FK (snowflake normalization)
CREATE TABLE `system_dim` (
    `system_id` INT AUTO_INCREMENT PRIMARY KEY,
    `system_name` VARCHAR(200) NOT NULL,
    `system_type` VARCHAR(100) NOT NULL COMMENT 'e.g. Web Server, Database, Firewall',
    `department_id` INT NOT NULL,

    CONSTRAINT `fk_system_department`
        FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =============================================================
-- SECTION 6.1: STAR SCHEMA — FACT TABLE
-- Central table: one row = one security incident
-- Foreign keys point to all four dimension tables
-- This is the "center of the star"
-- =============================================================

CREATE TABLE `incident_fact` (
    `incident_id` INT AUTO_INCREMENT PRIMARY KEY,
    `attack_type_id` INT NOT NULL,
    `severity` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    `system_id` INT NOT NULL,
    `reported_by` INT NOT NULL,
    `date_id` INT NOT NULL,
    `incident_timestamp` DATETIME NOT NULL,
    `response_time_minutes` INT NULL COMMENT 'Filled when incident is resolved',
    `description` TEXT NULL,
    `status` ENUM('Open', 'Investigating', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT `fk_incident_attack`
        FOREIGN KEY (`attack_type_id`) REFERENCES `attack_dim`(`attack_type_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_incident_system`
        FOREIGN KEY (`system_id`) REFERENCES `system_dim`(`system_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_incident_user`
        FOREIGN KEY (`reported_by`) REFERENCES `user_dim`(`user_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_incident_date`
        FOREIGN KEY (`date_id`) REFERENCES `date_dim`(`date_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX `idx_severity` (`severity`),
    INDEX `idx_status` (`status`),
    INDEX `idx_timestamp` (`incident_timestamp`),
    INDEX `idx_date_id` (`date_id`)
);


-- =============================================================
-- ALERT TABLES
-- Configurable alert rules + history of triggered alerts
-- =============================================================

-- Alert rule definitions (what conditions trigger an alert)
CREATE TABLE `alert_rule` (
    `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
    `rule_name` VARCHAR(200) NOT NULL,
    `rule_type` ENUM('high_severity', 'repeated_attack') NOT NULL,
    `threshold` INT NULL COMMENT 'e.g. 3 = alert after 3 repeated attacks on same system',
    `window_minutes` INT NULL COMMENT 'Time window for repeated-attack checks',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE
);

-- Log of every alert that was triggered
CREATE TABLE `alert_log` (
    `alert_id` INT AUTO_INCREMENT PRIMARY KEY,
    `rule_id` INT NOT NULL,
    `incident_id` INT NOT NULL,
    `triggered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `message` TEXT NULL COMMENT 'Human-readable alert description',
    `acknowledged` BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT `fk_alert_rule`
        FOREIGN KEY (`rule_id`) REFERENCES `alert_rule`(`rule_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_alert_incident`
        FOREIGN KEY (`incident_id`) REFERENCES `incident_fact`(`incident_id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX `idx_acknowledged` (`acknowledged`),
    INDEX `idx_triggered_at` (`triggered_at`)
);


-- =============================================================
-- SCHEMA SUMMARY
--
-- Star Schema (Section 6.1):
--   incident_fact ──FK──> attack_dim
--   incident_fact ──FK──> user_dim
--   incident_fact ──FK──> system_dim
--   incident_fact ──FK──> date_dim
--
-- Snowflake Extensions (Section 6.2):
--   attack_dim ──FK──> attack_category
--   user_dim   ──FK──> department
--   system_dim ──FK──> department
--
-- Total: 9 tables (1 fact + 4 dimensions + 2 snowflake + 2 alert)
-- =============================================================
