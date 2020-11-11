-- This was for Test purpose only , we will be using Routes and Sequelize


-- Some Seed Data
insert into department (name) values ('Engineering'),('Finance'),('HR'),('IT');
insert into employee (first_name,last_name,mobile,office_number,starting_date,email_address,password,role_id) values ('Alan','Chang','123456','654321','2020-7-04','alan@abc.com','2222',1),('Tony','Melek','123456','654321','2020-9-04','tony@abc.com','3333',1),('Strajinia','Ajvaz','8796542','963145','2020-1-04','starjinia@abc.com','4444',2);
insert into pre_defined_tasks (title,body) values ('database','create database and tables and relationships'),('debug js','solve problems and bugs in js file'),('template','create all templates required');
insert into tasks (assigned_by,assigned_to,task_id) values (3,1,1),(3,2,2),(3,1,3),(3,2,1);



-- Some Test Queries
select * from department;
select  a.id as role_id,a.title,a.department_id, b.name from role as a join department as b on b.id=a.department_id;
select * from employee;
select * from pre_defined_tasks;
select concat(a.first_name,' ',a.last_name)as assigned_by,concat(c.first_name,' ',c.last_name)as assigned_to , d.title as task from tasks as b  join employee as a on a.id=b.assigned_by join employee as c on c.id=b.assigned_to join pre_defined_tasks as d on d.id=b.task_id;