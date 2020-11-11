
-- Use the following 3 lines to create database on workbench
drop database if exists employee_demo_db;
create database employee_demo_db;
use employee_demo_db;



-- This following for Test purpose only , we will be using Routes and Sequelize

-- Department Table
create table department (
id int auto_increment,
name varchar(100) not null,
primary key(id)
);
-- Role Table
create table role (
id int auto_increment,
title varchar(100) not null,
hourly_rate float not null,
management_level int not null,
department_id int not null,
foreign key (department_id) references department(id),
primary key(id)
);
-- Employee Table
create table employee (
id int auto_increment,
first_name varchar(100) not null,
last_name varchar(100) not null,
mobile varchar(11) not null,
office_number varchar(11) not null,
starting_date date not null,
email_address varchar(150) not null,
password text not null,
role_id int not null,
foreign key (role_id) references role(id),
primary key(id)
);
-- Pre-Defined-Tasks Table
create table pre_defined_tasks(
id int auto_increment,
title varchar(100) not null,
body text not null,
primary key(id)
);
-- Tasks
create table tasks (
id int auto_increment,
completed boolean default false,
approved boolean default false,
assigned_by int not null,
assigned_to int not null,
task_id int not null,
foreign key (task_id) references pre_defined_tasks(id),
foreign key (assigned_by) references employee(id),
foreign key (assigned_to) references employee(id),
primary key(id)
);