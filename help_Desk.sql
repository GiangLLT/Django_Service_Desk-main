BCG_HelDesk

select * from user_system
select * from Tgroup
select * from ticket

DBCC CHECKIDENT ('Comment', RESEED, 0)
GO

ALTER DATABASE SDP_HelpDesk_Dev SET SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
ALTER DATABASE SDP_HelpDesk_Dev SET MULTI_USER
GO

BCG_HelDesk

--Table session --
CREATE TABLE django_session (
    session_key			nvarchar(40) PRIMARY KEY NOT NULL,
    session_data		nvarchar(max),
	expire_date			DATETIMEOFFSET(7),
);
GO

CREATE TABLE User_System
(
    ID_User NVARCHAR(20) PRIMARY KEY NOT NULL,
	Company_ID	int,
    Mail NVARCHAR(200),
    Password NVARCHAR(50),
    FullName NVARCHAR(100),
    displayName NVARCHAR(100),
    Birthday DATE,
    Acc_Type NVARCHAR(50),
	User_Type int,
    Address NVARCHAR(50),
    Jobtitle NVARCHAR(50),
    Phone INT,
    Avatar NVARCHAR(1000),
	ID_Create NVARCHAR(20),
	Name_Create NVARCHAR(100),
	Date_Create DATE,
	Time_Create TIME,
    User_Status BIT
	FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);
GO

INSERT INTO User_System (ID_User, Company_ID , Mail, Password,  FullName, displayName,Birthday,Acc_Type,User_Type,Address,Jobtitle,Phone,Avatar,ID_Create,Name_Create,Date_Create,Time_Create,User_Status)
VALUES ('U000000001', '1', 'system@bamboocap.com.vn', 'Abc@123','System' , 'System', '', 'System', '0', '', '', '', '', 'U000000001',N'Lê Lộc Trường Giang','2023-10-17','14:00:00' , 1)
INSERT INTO User_System (ID_User, Company_ID , Mail, Password,  FullName, displayName,Birthday,Acc_Type,User_Type,Address,Jobtitle,Phone,Avatar,ID_Create,Name_Create,Date_Create,Time_Create,User_Status)
VALUES ('U000000002', '1', 'giang.llt@bamboocap.com.vn', '','System' , 'System', '', 'System', '0', '', '', '', '', 'U000000001',N'Lê Lộc Trường Giang','2023-10-17','14:00:00' , 1)


CREATE TABLE Company (
    Company_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    Company_Name	nvarchar(255),
	ID_User		nvarchar(20),
	Company_User_Name nvarchar(255), 
	Company_Date		date,
	Company_Time		time,
	Company_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User)
);
GO
INSERT INTO Company (Company_Name, ID_User , Company_User_Name, Company_Date,  Company_Time, Company_Status)
VALUES ('BCG - Bamboo Capital Group', 'U000000001', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Company (Company_Name, ID_User , Company_User_Name, Company_Date,  Company_Time, Company_Status)
VALUES ('BCGE - Bamboo Capital Group Energy', 'U000000001' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Company (Company_Name, ID_User , Company_User_Name, Company_Date,  Company_Time, Company_Status)
VALUES ('BCGL - Bamboo Capital Land ', 'U000000002' , N'Lê Lộc Trường Vũ', '2023-06-06','10:59:00' , 1)

CREATE TABLE TGroup (
    TGroup_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    TGroup_Name	nvarchar(255),
	ID_User		nvarchar(20),
	TGroup_User_Name nvarchar(255),
	TGroup_Date		date,
	TGroup_Time		time,
	TGroup_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User)
);
GO
INSERT INTO TGroup (TGroup_Name, ID_User , TGroup_User_Name, TGroup_Date,  TGroup_Time, TGroup_Status)
VALUES ('Histaff', 'U000000001' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO TGroup (TGroup_Name, ID_User , TGroup_User_Name, TGroup_Date,  TGroup_Time, TGroup_Status)
VALUES ('Workit', 'U000000001' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO TGroup (TGroup_Name, ID_User , TGroup_User_Name, TGroup_Date,  TGroup_Time, TGroup_Status)
VALUES ('Odoo', 'U000000001' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)

CREATE TABLE Ticket (
    Ticket_ID		int PRIMARY KEY IDENTITY(1000000001,1) NOT NULL ,
	Ticket_Title	nvarchar(255),
    Ticket_Desc		nvarchar(Max),
	Ticket_Type		int,
    Company_ID	int,
	TGroup_ID	int,
	ID_User		nvarchar(20),
	Ticket_User_Name nvarchar(255),
	Ticket_Date		date,
	Ticket_Time		time,
	Ticket_User_Asign	nvarchar(20),
	Ticket_Name_Asign	nvarchar(255),
	Ticket_Status		bit

	FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID),
	FOREIGN KEY (TGroup_ID) REFERENCES TGroup(TGroup_ID),
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User)
);
GO
INSERT INTO Ticket (Ticket_Title,Ticket_Desc,Ticket_Type,Company_ID, TGroup_ID,  ID_User , Ticket_User_Name, Ticket_Date,  Ticket_Time, Ticket_Status)
VALUES ('Lỗi Histaff','Lỗi Histaff Description', 1, 1, 1, 'U000000001' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)

CREATE TABLE TImage (
    TImage_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    Ticket_ID	int,
	ID_User		nvarchar(20),
	TImage_Url nvarchar(Max),
	TImage_User_Name nvarchar(255),
	TImage_Date		date,
	TImage_Time		time,
	TImage_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID)
);
GO

CREATE TABLE Attachment (
    Attachment_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    Ticket_ID	int,
	ID_User		nvarchar(20),
	Attachment_Url nvarchar(Max),
	Attachment_User_Name nvarchar(255),
	Attachment_Date		date,
	Attachment_Time		time,
	Attachment_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID)
);
GO

CREATE TABLE Comment (
    Comment_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    Ticket_ID	int,
	ID_User		nvarchar(20),
	Comment_Desc nvarchar(Max),
	Comment_level int,
	Comment_User_Name nvarchar(255),
	Comment_Date		date,
	Comment_Time		time,
	Comment_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID)
);
GO
INSERT INTO Comment (Ticket_ID, ID_user , Comment_Desc, Comment_level,  Comment_User_Name,Comment_Date,Comment_Time, Comment_Status)
VALUES ('1000000023', 'U000000001',N'Đã Hoàn Thành, Check lại nhé.', '' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Comment (Ticket_ID, ID_user , Comment_Desc, Comment_level,  Comment_User_Name,Comment_Date,Comment_Time, Comment_Status)
VALUES ('1000000023', 'U000000001',N'Đã Hoàn Thành, Check lại nhé 1.', '' , N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 0)

CREATE TABLE ReadComment (
    ReadComment_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    Comment_ID	int,
	ID_User		nvarchar(20),
	ReadComment_Isread		bit,
	FOREIGN KEY (Comment_ID) REFERENCES Comment(Comment_ID),
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
);
GO
INSERT INTO ReadComment (Comment_ID,ReadComment_Isread)
VALUES ('1058', 0)


CREATE TABLE Assign_User (
    Assign_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	ID_User			nvarchar(20),
	TGroup_ID		int,
	Assign_User_ID	nvarchar(20),
	Assign_User_Name nvarchar(255), 
	Assign_User_Date		date,
	Assign_User_Time		time,
	Assign_User_Status		bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (TGroup_ID) REFERENCES TGroup(TGroup_ID)
);
GO
INSERT INTO Assign_User (ID_User ,TGroup_ID,Assign_User_ID, Assign_User_Name, Assign_User_Date,  Assign_User_Time, Assign_User_Status)
VALUES ('U000000001' ,1,'U000000001', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Assign_User (ID_User ,TGroup_ID,Assign_User_ID, Assign_User_Name, Assign_User_Date,  Assign_User_Time, Assign_User_Status)
VALUES ('U000000002' ,1,'U000000001', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Assign_User (ID_User ,TGroup_ID,Assign_User_ID, Assign_User_Name, Assign_User_Date,  Assign_User_Time, Assign_User_Status)
VALUES ('U000000001' ,2,'U000000001', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)
INSERT INTO Assign_User (ID_User ,TGroup_ID,Assign_User_ID, Assign_User_Name, Assign_User_Date,  Assign_User_Time, Assign_User_Status)
VALUES ('U000000002' ,3,'U000000001', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)

CREATE TABLE Menu (
    Menu_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	Menu_Name   nvarchar(255) ,
	Menu_Adress	nvarchar(255),
	Menu_Icon	nvarchar(255),
	-- Role_Group_ID			int,
	Menu_Level		int,
	Menu_CreateID nvarchar(20),
	Menu_CreateBy nvarchar(255),
	Menu_Date		date,
	Menu_Time		time,
	Menu_Status	bit,
	-- FOREIGN KEY (Role_Group_ID) REFERENCES Role_Group(Role_Group_ID),
);
GO
INSERT INTO Menu (Menu_Name , Menu_Adress, Menu_Icon,Menu_Level, Menu_CreateID, Menu_CreateBy , Menu_Date,  Menu_Time, Menu_Status)
VALUES ('Dashboad','/Dashboad/','mdi mdi-grid-large' ,1 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-26','10:00:00' , 1)
INSERT INTO Menu (Menu_Name , Menu_Adress, Menu_Icon,Menu_Level, Menu_CreateID, Menu_CreateBy , Menu_Date,  Menu_Time, Menu_Status)
VALUES ('Danh Sách','','mdi mdi-table' ,2 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-26','10:00:00' , 1)
INSERT INTO Menu (Menu_Name , Menu_Adress, Menu_Icon,Menu_Level, Menu_CreateID, Menu_CreateBy , Menu_Date,  Menu_Time, Menu_Status)
VALUES (N'Quản Lý Danh Mục','','mdi mdi-book-open-variant' ,3 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-26','10:00:00' , 1)
INSERT INTO Menu (Menu_Name , Menu_Adress, Menu_Icon,Menu_Level, Menu_CreateID, Menu_CreateBy , Menu_Date,  Menu_Time, Menu_Status)
VALUES (N'Quản Lý Quyền','','mdi mdi-account-key' ,4 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-26','10:00:00' , 1)
INSERT INTO Menu (Menu_Name , Menu_Adress, Menu_Icon,Menu_Level, Menu_CreateID, Menu_CreateBy , Menu_Date,  Menu_Time, Menu_Status)
VALUES (N'Báo Cáo - Thống Kê','','mdi mdi-chart-line' ,5 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-26','10:00:00' , 1)
insert into Menu(Menu_Name,Menu_Adress,Menu_Icon,Menu_Level,Menu_CreateID,Menu_CreateBy,Menu_Date,Menu_Time,Menu_Status) 
values ('Tài Liệu - Template','', 'mdi mdi-book-open-page-variant', 6, 'U000000001', 'Lê Lộc Trường Giang','2023-11-16','10:00',1)

CREATE TABLE Role_Group (
    Role_Group_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	ID_User				nvarchar(20),
	Menu_ID 			int,
	Role_Group_Address  nvarchar(255),
	Role_Group_Name		nvarchar(Max),
	Role_Group_CreateBy nvarchar(255),
	Role_Group_Date		date,
	Role_Group_Time		time,
	Role_Group_Status	bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Menu_ID) REFERENCES Menu(Menu_ID);
);
GO
INSERT INTO Role_Group (ID_User ,Role_Group_Name,Role_Group_CreateBy, Role_Group_Date,  Role_Group_Time, Role_Group_Status)
VALUES ('U000000001','Role DashBoard', N'Lê Lộc Trường Giang', '2023-05-29','14:00:00' , 1)

CREATE TABLE Role_Single (
    Role_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	Role_Name		nvarchar(Max),
	Role_Group_ID	int,
	ID_User		    nvarchar(20),
	Role_CreateBy   nvarchar(255),
	Role_Date		date,
	Role_Time		time,
	Role_Status	bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Role_Group_ID) REFERENCES Role_Group(Role_Group_ID)
);
GO
INSERT INTO Role_Single (Role_Name, Role_Group_ID,ID_User , Role_CreateBy, Role_Date,  Role_Time, Role_Status)
VALUES ('Dashboard: View Report Ticket',1 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-13','09:00:00' , 1)
INSERT INTO Role_Single (Role_Name, Role_Group_ID,ID_User , Role_CreateBy, Role_Date,  Role_Time, Role_Status)
VALUES ('Dashboard: View Report User',1 ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-13','09:00:00' , 1)

CREATE TABLE Authorization_User (
    Authorization_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	ID_User					nvarchar(20),
	Role_ID					int,
	Authorization_From		date,
	Authorization_To		date,
	Authorization_CreateID nvarchar(20),
	Authorization_CreateBy nvarchar(255),
	Authorization_Date		date,
	Authorization_Time		time,
	Authorization_Status	bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
	FOREIGN KEY (Role_ID) REFERENCES Role_Single(Role_ID),
);
GO

INSERT INTO Authorization_User (ID_User , Role_ID,Authorization_From,Authorization_To, Authorization_CreateID, Authorization_CreateBy , Authorization_Date,  Authorization_Time, Authorization_Status)
VALUES ('U000000001',5,'2023-07-01' ,'9999-12-31' ,'U000000001', N'Lê Lộc Trường Giang', '2023-07-19','10:00:00' , 1)

CREATE TABLE Ticket_Mapping (
    Ticket_Mapping_ID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	Ticket_ID				int,
	Email_ID				nvarchar(Max),
	Comment_ID				int,
	Ticket_Mapping_Status	bit,
	FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID),
);
GO

CREATE TABLE Face (
    FaceID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	FaceID_Image					nvarchar(MAX),
);
GO

CREATE TABLE FaceID (
    FaceID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
	ID_user					nvarchar(20),
	FaceID_Image					nvarchar(MAX),
	FaceID_Date		date,
	FaceID_Time		time,
	FaceID_Status	bit,
	FOREIGN KEY (ID_User) REFERENCES User_System(ID_User),
);
GO
