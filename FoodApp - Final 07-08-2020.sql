CREATE DATABASE FoodApp
GO
USE FoodApp
GO

--------------------------------------------------------------------------------------------------------
-- tạo table--

-- danh sách công ty ---
CREATE TABLE COMPANY (
    CompanyCode		nvarchar(5) PRIMARY KEY NOT NULL,
    CompanyName		nvarchar(255),
	CompanyAddress	nvarchar(255),
	CompanyVAT		nvarchar(20),
    CompanyStatus	bit
);
GO

-- danh sách phòng ban ---
CREATE TABLE DEPARTMENT (
    DepartID		nvarchar(5) PRIMARY KEY NOT NULL,
    DepartName		nvarchar(255),
    DepartStatus	bit
);
GO

-- danh sách chức vụ ---
CREATE TABLE POSITION (
    PositionID		nvarchar(5) PRIMARY KEY NOT NULL ,
    PositionName	nvarchar(255),
    PositionStatus	bit
);
GO


-- danh sách nhóm nhân viên ---
CREATE TABLE USER_GROUP (
    UserGroupID		nvarchar(5) PRIMARY KEY NOT NULL ,
    UserGroupName	nvarchar(255),
    UserGroupStatus	bit
);
GO

-- danh sách quyền ---
CREATE TABLE USER_ROLE (
    UserRoleID		nvarchar(150) PRIMARY KEY NOT NULL ,
    UserRoleName	nvarchar(255),
    UserRoleStatus	bit
);
GO


-- danh sách nhân viên --
CREATE TABLE USER_SY (
    UserID		int PRIMARY KEY IDENTITY(10000,1) NOT NULL,
	Username	nvarchar(20),
    FullName	nvarchar(255),
	ImageUrl	nvarchar(max),
	BirthDay	date,
	Gender		nvarchar(5),
    Address		nvarchar(255),
    DepartID	nvarchar(5),
	PositionID	nvarchar(5),
	CompanyCode	nvarchar(5),
	UserGroupID nvarchar(5),
	CreateBy	nvarchar(20),
	CreateDate	datetime,
	UserStatus	bit 

	FOREIGN KEY (DepartID) REFERENCES DEPARTMENT(DepartID),
	FOREIGN KEY (PositionID) REFERENCES POSITION(PositionID),
	FOREIGN KEY (CompanyCode) REFERENCES COMPANY(CompanyCode),
	FOREIGN KEY (UserGroupID) REFERENCES USER_GROUP(UserGroupID),
);
GO


-- danh sách phân quyền ---
CREATE TABLE AUTHORIZE (
    AhthorizeID		int PRIMARY KEY IDENTITY(1,1) NOT NULL ,
    UserID			int,
    UserRoleID		nvarchar(150),
	AuthorizeFrom	date,
	AuthorizeTo		date,
	AuthorizeStatus	bit
);
GO


--danh sách ngành hàng --
CREATE TABLE DIVISION (
    DivisionID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    DivisionName		nvarchar(255),
    DivisionStatus		bit
);
GO

--danh sách đơn vị tính --
CREATE TABLE MATERIAL_UNIT (
    MaterialUnitID		nvarchar(3) PRIMARY KEY NOT NULL,
    MaterialUnitName	nvarchar(255),
    MaterialUnitStatus	bit
);
GO

--danh sách loại sản phẩm --
CREATE TABLE MATERIAL_TYPE (
    MaterialTypeID		int PRIMARY KEY NOT NULL,
    MaterialTypeName	nvarchar(255),
    MaterialTypeStatus	bit
);
GO

--danh sách đơn vị tiền tệ --
CREATE TABLE CURRENCY (
    CurrencyID		nvarchar(3) PRIMARY KEY NOT NULL,
    CurrencyName	nvarchar(255),
    CurrencyStatus	bit
);
GO

--danh sách VAT --
CREATE TABLE MATERIAL_VAT (
	VATID			int PRIMARY IDENTITY(1,1) KEY NOT NULL,
    VATName			nvarchar(255),
	VATValue		int,
    VATStatus		bit

);
GO

--danh sách Material Group --
CREATE TABLE MATERIAL_GROUP (
	MaterialGroupID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaterialGroupName		nvarchar(255),
	MaterialGroupIcon		nvarchar(255),
    MaterialGroupStatus		bit

);
GO


--danh sách sản phẩm --
CREATE TABLE MATERIAL (
	MaterialID			nvarchar(10) PRIMARY KEY NOT NULL,
    MaterialName		nvarchar(255),
	MaterialImage		nvarchar(max),
	DivisionID			int,
	MaterialUnitID		nvarchar(3),
	MaterialTypeID		int,
	MaterialGroupID		int,
	MaterialNote		nvarchar(max),
	MaterialUserCreate	int,
	MaterialDate		datetime,
	MaterialVAT			int,
    MaterialStatus		bit

	FOREIGN KEY (DivisionID) REFERENCES DIVISION(DivisionID),
	FOREIGN KEY (MaterialUnitID) REFERENCES MATERIAL_UNIT(MaterialUnitID),
	FOREIGN KEY (MaterialTypeID) REFERENCES MATERIAL_TYPE(MaterialTypeID),
	FOREIGN KEY (MaterialUserCreate) REFERENCES USER_SY(UserID),
	FOREIGN KEY (MaterialVAT) REFERENCES MATERIAL_VAT(VATID),
	FOREIGN KEY (MaterialGroupID) REFERENCES MATERIAL_GROUP(MaterialGroupID),
);
GO

--danh sách sản phẩm theo company --
CREATE TABLE MATERIAL_COMPANY (
	MaterialComID		int PRIMARY KEY IDENTITY(1,1) NOT NULL, 
	MaterialID			nvarchar(10),
    MaterialName		nvarchar(255),
	CompanyCode			nvarchar(5),
	CompanyName			nvarchar(255),
	MaterialComFrom		date,
	MaterialComTo		date,
    MaterialStatus		bit

	FOREIGN KEY (MaterialID) REFERENCES MATERIAL(MaterialID),
	FOREIGN KEY (CompanyCode) REFERENCES COMPANY(CompanyCode),
	
);
GO

--danh sách chi tiết giá --
CREATE TABLE PRICE_MATERIAL (
	PriceID			int PRIMARY KEY IDENTITY(1,1),
	PriceAmount		bigint,
	PriceDiscount	bigint,
	PriceDiscountType nvarchar(50),
    MaterialID		nvarchar(10),
	CompanyCode		nvarchar(5),
	CurencyID		nvarchar(3),
	PriceFrom		date,
	PriceTo			date,
	CreateBy		varchar(20),
	CreateDate		datetime

	FOREIGN KEY (MaterialID) REFERENCES MATERIAL(MaterialID),
	FOREIGN KEY (CompanyCode) REFERENCES COMPANY(CompanyCode),
	FOREIGN KEY (CurencyID) REFERENCES CURRENCY(CurrencyID),
);
GO

--danh sách hình thức thanh toán --
CREATE TABLE PAYMENT_TERM (
    PaymentID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PaymentName			nvarchar(255),
    PaymentStatus		bit
);
GO

--danh sách kênh bán hàng --
CREATE TABLE CHANNEL (
    ChannelID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    ChannelName			nvarchar(255),
    ChannelStatus		bit
);
GO

--danh sách loại khách hàng --
CREATE TABLE CUSTOMER_TYPE (
    CustomerTypeID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    CustomerTypeName		nvarchar(255),
	CustomerTypeRevenue		bigint,
	CustomerTypePercent		int,
    CustomerTypeStatus		bit
);
GO

--danh sách bàn --
CREATE TABLE TABLE_ORDER (
    TableOrderID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    TableOrderName			nvarchar(255),
    TableOrderStatus		bit
    TableOrderPerson		int
);
GO

--danh sách loại chương trình khuyến mãi --
CREATE TABLE PROMOTION_TYPE (
    PromotionTypeID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PromotionTypeName		nvarchar(max),
    PromotionTypeStatus		bit
);
GO

--danh sách điều kiện chương trình khuyến mãi  --
CREATE TABLE PROMOTION_ROLE (
    PromotionRoleID			int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PromotionRoleName		nvarchar(255),
	PromotionRoleMin		bigint,
	PromotionRoleChannel	bigint,
    PromotionRoleStatus		bit
);
GO

--danh sách chương trình khuyến mãi --
CREATE TABLE PROMOTION (
    PromotionID				int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PromotionName			nvarchar(255),
	PromotionDiscountPer	bigint,
	PromotionDiscountAmount	bigint,
	PromotionDiscountMax	bigint,
	PromotionFrom			date,
	PromotionTo				date,
	PromotionTypeID			int,
	PromotionRoleID			int,
	Companycode				nvarchar(5),
    PromotionStatus			bit

	FOREIGN KEY (PromotionTypeID) REFERENCES PROMOTION_TYPE(PromotionTypeID),
	FOREIGN KEY (PromotionRoleID) REFERENCES PROMOTION_ROLE(PromotionRoleID)
	FOREIGN KEY (Companycode) REFERENCES Company(Companycode)
);
GO

--danh sách Khách hàng --
CREATE TABLE CUSTOMER (
    CustomerID			int PRIMARY KEY IDENTITY(1000000001,1) NOT NULL,
    CustomerName		nvarchar(max),
	CustomerImage		nvarchar(max),
	CustomerGender		nvarchar(15),
	CustomerBirthday	date,
    CustomerAddress		nvarchar(max),
	CustomerPhone		nvarchar(15),
	CustomerEmail		nvarchar(255),
	CustomerVAT			nvarchar(20),
	CustomerPoint		int,
	CustomerRevene		bigint,
	CustomerTypeID		int,
	CustomerCard		nvarchar(50),
	CustomerQRcode		nvarchar(20),
	CustomerStatus		bit

	FOREIGN KEY (CustomerTypeID) REFERENCES CUSTOMER_TYPE(CustomerTypeID)
);
GO

-- danh sách đơn hàng tổng quan -- thiếu số lượng người và đánh giá
CREATE TABLE SALE_ORDER_HEADER (
    SaleOrderID			bigint PRIMARY KEY IDENTITY(1000000000,1) NOT NULL,
	CompanyCode			nvarchar(5),
    ChannelID			int,
	ChannelName			nvarchar(255),
	DivisionID			int,
	DivisionName		nvarchar(255),
	CustomerID			int,
	CustomerName		nvarchar(max),
	CustomerAddress		nvarchar(max),
	CustomerPhone		nvarchar(15),
	CustomerEmail		nvarchar(255),
	CustomerVAT			nvarchar(20),
    TableOrderID		int,
	TableOrderName		nvarchar(255),
	PaymentID			int,
	PaymentName			nvarchar(255),	
	UserID				int,				
	Username			nvarchar(20),
    FullName			nvarchar(255),
	PromotionID			int ,
    PromotionName		nvarchar(255),
	PromotionTypeID		int,
    PromotionTypeName	nvarchar(max),
	PromotionDiscount	int,
	SaleCurencyID		nvarchar(3),	
	SaleOrderPriceNet	bigint,
	SaleOrderPriceTax	bigint,
	SaleOrderAmount		bigint,
	SaleHeaderNote		nvarchar(max),
	SaleOrderStatus		nvarchar(255),

	FOREIGN KEY (UserID) REFERENCES USER_SY (UserID),
	FOREIGN KEY (CompanyCode) REFERENCES COMPANY (CompanyCode),
	FOREIGN KEY (ChannelID) REFERENCES CHANNEL(ChannelID),
	FOREIGN KEY (DivisionID) REFERENCES DIVISION (DivisionID),
	FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID),
	FOREIGN KEY (TableOrderID) REFERENCES TABLE_ORDER(TableOrderID),
	FOREIGN KEY (PaymentID) REFERENCES PAYMENT_TERM(PaymentID),
	FOREIGN KEY (SaleCurencyID) REFERENCES CURRENCY (CurrencyID),
	FOREIGN KEY (PromotionID) REFERENCES PROMOTION (PromotionID)
);
GO

-- danh sách đơn hàng chi tiết --
CREATE TABLE SALE_ORDER_ITEM (
	SaleID				bigint PRIMARY KEY IDENTITY(1,1) NOT NULL,
    SaleOrderID			bigint,
	SaleItem			int,
	MaterialID			nvarchar(10),
    MaterialName		nvarchar(255),
	DivisionID			int,
	DivisionName		nvarchar(255),
	ChannelID			int,
	ChannelName			nvarchar(255),
	SaleQuantity		int,
	MaterialUnitID		nvarchar(3),
	MaterialUnitName	nvarchar(255),
	PromotionID			int ,
    PromotionName		nvarchar(255),
	PromotionTypeID		int,
    PromotionTypeName	nvarchar(max),
	SalePriceUnit		bigint,
	SalePriceDiscount	bigint,
	SalePriceUnitTax	bigint,
	SalePrice			bigint,	
	SaleCurencyID		nvarchar(3),
	SaleItemNote		nvarchar(max)

	FOREIGN KEY (SaleOrderID) REFERENCES SALE_ORDER_HEADER (SaleOrderID),
	FOREIGN KEY (DivisionID) REFERENCES DIVISION (DivisionID),
	FOREIGN KEY (MaterialUnitID) REFERENCES MATERIAL_UNIT(MaterialUnitID),
	FOREIGN KEY (MaterialID) REFERENCES MATERIAL (MaterialID),
	FOREIGN KEY (SaleCurencyID) REFERENCES CURRENCY (CurrencyID),
	FOREIGN KEY (PromotionID) REFERENCES PROMOTION (PromotionID),
	FOREIGN KEY (ChannelID) REFERENCES CHANNEL(ChannelID),
);
GO

-- danh sách hóa đơn --
CREATE TABLE BILL_HEADER (
	BillingID			bigint PRIMARY KEY IDENTITY(9000000000,1) NOT NULL,	
    SaleOrderID			bigint,
	CompanyCode			nvarchar(5),
	DivisionID			int,
	DivisionName		nvarchar(255),
	ChannelID			int,
	ChannelName			nvarchar(255),
	CustomerID			int,
	CustomerName		nvarchar(max),
	CustomerAddress		nvarchar(max),
	CustomerPhone		nvarchar(15),
	CustomerEmail		nvarchar(255),
	CustomerVAT			nvarchar(20),
    TableOrderID		int,
	TableOrderName		nvarchar(255),
	PaymentID			int,
	PaymentName			nvarchar(255),	
	UserID				int,				
	Username			nvarchar(20),
    FullName			nvarchar(255),
	PromotionID			int ,
    PromotionName		nvarchar(255),
	PromotionTypeID		int,
    PromotionTypeName	nvarchar(max),
	PromotionDiscount	int,
	BillPrice			bigint,
	BillPriceTax		bigint,
	BillPriceAmount		bigint,	
	CurrencyID			nvarchar(3),
    CurrencyName		nvarchar(255),
	BillHeaderNote		nvarchar(max)

	FOREIGN KEY (SaleOrderID) REFERENCES SALE_ORDER_HEADER (SaleOrderID),
	FOREIGN KEY (DivisionID) REFERENCES DIVISION (DivisionID),
	FOREIGN KEY (ChannelID) REFERENCES CHANNEL (ChannelID),
	FOREIGN KEY (UserID) REFERENCES USER_SY (UserID),
	FOREIGN KEY (CompanyCode) REFERENCES COMPANY (CompanyCode),
	FOREIGN KEY (ChannelID) REFERENCES CHANNEL(ChannelID),
	FOREIGN KEY (DivisionID) REFERENCES DIVISION (DivisionID),
	FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID),
	FOREIGN KEY (TableOrderID) REFERENCES TABLE_ORDER(TableOrderID),
	FOREIGN KEY (PaymentID) REFERENCES PAYMENT_TERM(PaymentID),
	FOREIGN KEY (CurrencyID) REFERENCES CURRENCY (CurrencyID),
	FOREIGN KEY (PromotionID) REFERENCES PROMOTION (PromotionID)
);
GO

-- danh sách hóa đơn chi tiết --
CREATE TABLE BILL_ITEM (
	BillID				bigint PRIMARY KEY IDENTITY(1,1) NOT NULL,
    BillingID			bigint,
	BillItem			int,
	MaterialID			nvarchar(10),
    MaterialName		nvarchar(255),
	DivisionID			int,
	DivisionName		nvarchar(255),
	ChannelID			int,
	ChannelName			nvarchar(255),
	SaleQuantity		int,
	MaterialUnitID		nvarchar(3),
	MaterialUnitName	nvarchar(255),
	PromotionID			int ,
    PromotionName		nvarchar(255),
	PromotionTypeID		int,
    PromotionTypeName	nvarchar(max),
	BillPriceUnit		bigint,
	BillPriceDiscount	bigint,
	BillPriceUnitTax	bigint,
	BillPrice			bigint,	
	BillCurencyID		nvarchar(3),
	BillItemNote		nvarchar(max)

	FOREIGN KEY (BillingID) REFERENCES BILL_HEADER (BillingID),
	FOREIGN KEY (DivisionID) REFERENCES DIVISION (DivisionID),
	FOREIGN KEY (MaterialUnitID) REFERENCES MATERIAL_UNIT(MaterialUnitID),
	FOREIGN KEY (MaterialID) REFERENCES MATERIAL (MaterialID),
	FOREIGN KEY (BillCurencyID) REFERENCES CURRENCY (CurrencyID),
	FOREIGN KEY (PromotionID) REFERENCES PROMOTION (PromotionID),
	FOREIGN KEY (ChannelID) REFERENCES CHANNEL(ChannelID),
);
GO

--Table session --
CREATE TABLE django_session (
    session_key			nvarchar(40) PRIMARY KEY NOT NULL,
    session_data		nvarchar(max),
	expire_date			date,
);
GO


-- tạo table--
--------------------------------------------------------------------------------------------------------


--------------------------------------------------------------------------------------------------------
-- thêm dánh data--

--thêm danh sách công ty--
INSERT INTO COMPANY (CompanyCode, CompanyName, CompanyAddress, CompanyVAT, CompanyStatus)
VALUES (1000, N'Công Ty TNHH LLTG', N'54/65A Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', 0123456787, 1);
INSERT INTO COMPANY (CompanyCode, CompanyName, CompanyAddress, CompanyVAT, CompanyStatus)
VALUES (1001, N'Công Ty TNHH Giang Lê', N'54/65A Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', 0123456788, 1);
INSERT INTO COMPANY (CompanyCode, CompanyName, CompanyAddress, CompanyVAT, CompanyStatus)
VALUES (1002, N'Công Ty TNHH GLLT',N'54/65A Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', 0123456789, 1);


--thêm danh sách phòng ban--
INSERT INTO DEPARTMENT (DepartID, DepartName, DepartStatus)
VALUES (N'BGD', N'Ban Giám Đốc', 1);
INSERT INTO DEPARTMENT (DepartID, DepartName, DepartStatus)
VALUES (N'PKD', N'Phòng Kinh Doanh', 1);


--Thêm danh sách chức vụ--
INSERT INTO POSITION (PositionID, PositionName, PositionStatus)
VALUES (N'TGD', N'Tổng Giám Đốc', 1);
INSERT INTO POSITION (PositionID, PositionName, PositionStatus)
VALUES (N'PGD', N'Phó Giám Đốc', 1);
INSERT INTO POSITION (PositionID, PositionName, PositionStatus)
VALUES (N'TNG', N'Thu Ngân', 1);
INSERT INTO POSITION (PositionID, PositionName, PositionStatus)
VALUES (N'PVU', N'Phục Vụ', 1);


--Thêm danh nhóm nhân viên--
INSERT INTO USER_GROUP (UserGroupID, UserGroupName, UserGroupStatus)
VALUES (N'ADM', N'Quản Trị', 1);
INSERT INTO USER_GROUP (UserGroupID, UserGroupName, UserGroupStatus)
VALUES (N'NVI', N'Nhân Viên', 1);
INSERT INTO USER_GROUP (UserGroupID, UserGroupName, UserGroupStatus)
VALUES (N'QLY', N'Quản Lý', 1);


--Thêm danh nhóm nhân viên--
INSERT INTO USER_ROLE (UserRoleID, UserRoleName, UserRoleStatus)
VALUES (N'ORDER_CREATE', N'Tạo Đơn hàng', 1);
INSERT INTO USER_ROLE (UserRoleID, UserRoleName, UserRoleStatus)
VALUES (N'ORDER_CANCEL', N'Hủy Đơn hàng', 1);
INSERT INTO USER_ROLE (UserRoleID, UserRoleName, UserRoleStatus)
VALUES (N'BILL_PAYMENT', N'Thanh toán hóa đơn', 1);
INSERT INTO USER_ROLE (UserRoleID, UserRoleName, UserRoleStatus)
VALUES (N'BILL_CANCEL', N'Hủy hóa đơn', 1);


-- thêm danh sách Nhân viên --
INSERT INTO USER_SY (Username, FullName, ImageUrl, BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'GIANG.LLT', N'Lê Lộc Trường Giang', '', '1990/10/16', N'Nam' , N'54/65A Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', N'BGD', N'TGD', '1000', '', '' , 1);
INSERT INTO USER_SY (Username, FullName, ImageUrl,  BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'THUY.PT', N'Phạm Thanh Thúy', '',  '1990-07-22', N'Nữ' , N'54/65A Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', N'BGD', N'PGD', '1000', '', '' , 1);
INSERT INTO USER_SY (Username, FullName, ImageUrl,  BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'TNG.01', N'Thu Ngân 01', '',  '2020-01-01', N'Nữ' , N'Quận 7, TPHCM', N'PKD', N'TNG', '1001', '', '' , 1);
INSERT INTO USER_SY (Username, FullName, ImageUrl,  BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'TNG.02', N'Thu Ngân 02', '',  '2020-01-01', N'Nữ' , N'Quận 7, TPHCM', N'PKD', N'TNG', '1002', '', '' , 1);
INSERT INTO USER_SY (Username, FullName, ImageUrl,  BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'PVU.01', N'Phục Vụ 01', '',  '2020-01-01', N'Nam' , N'Quận 7, TPHCM', N'PKD', N'PVU', '1001', '', '' , 1);
INSERT INTO USER_SY (Username, FullName, ImageUrl,  BirthDay, Gender, Address, DepartID, PositionID, CompanyCode, CreateBy, CreateDate, UserStatus)
VALUES (N'PVU.02', N'Phục Vụ 02', '',  '2020-01-01', N'Nam' , N'Quận 7, TPHCM', N'PKD', N'PVU', '1002', '', '' , 1);


--Thêm danh nhóm nhân viên--
INSERT INTO AUTHORIZE (UserID, UserRoleID, AuthorizeFrom, AuthorizeTo, AuthorizeStatus)
VALUES (10002, N'BILL_PAYMENT', '2020-01-01', '2020-12-31', 1);
INSERT INTO AUTHORIZE (UserID, UserRoleID, AuthorizeFrom, AuthorizeTo, AuthorizeStatus)
VALUES (10003, N'BILL_PAYMENT', '2020-01-01', '2020-12-31', 1);
INSERT INTO AUTHORIZE (UserID, UserRoleID, AuthorizeFrom, AuthorizeTo, AuthorizeStatus)
VALUES (10004, N'ORDER_CREATE', '2020-01-01', '2020-12-31', 1);
INSERT INTO AUTHORIZE (UserID, UserRoleID, AuthorizeFrom, AuthorizeTo, AuthorizeStatus)
VALUES (10005, N'ORDER_CREATE', '2020-01-01', '2020-12-31', 1);



-- thêm danh sách ngành hàng --
INSERT INTO DIVISION (DivisionName, DivisionStatus)
VALUES (N'Chung', 1);
INSERT INTO DIVISION (DivisionName, DivisionStatus)
VALUES (N'Bia', 1);
INSERT INTO DIVISION (DivisionName, DivisionStatus)
VALUES (N'Nước Giải Khát', 1);
INSERT INTO DIVISION (DivisionName, DivisionStatus)
VALUES (N'Cà Phê', 1);
INSERT INTO DIVISION (DivisionName, DivisionStatus)
VALUES (N'Trà Sữa', 1);


-- thêm danh sách đơn vị tính --
INSERT INTO MATERIAL_UNIT (MaterialUnitID, MaterialUnitName, MaterialUnitStatus)
VALUES (N'LY',N'Ly', 1);
INSERT INTO MATERIAL_UNIT (MaterialUnitID, MaterialUnitName, MaterialUnitStatus)
VALUES (N'CAI',N'Cái', 1);


-- thêm danh sách loại sản phẩm --
INSERT INTO MATERIAL_TYPE (MaterialTypeID, MaterialTypeName, MaterialTypeStatus)
VALUES (1,N'Thành Phẩm', 1);
INSERT INTO MATERIAL_TYPE (MaterialTypeID, MaterialTypeName, MaterialTypeStatus)
VALUES (2,N'Nguyên Vật liệu', 1);


-- thêm danh sách nhóm món ăn --
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Cà Phê', 1);
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Nước Ép', 1);
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Trà Sữa', 1);
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Đá Xay', 1);
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Sinh Tố', 1);
INSERT INTO Material_Group (MaterialGroupName, MaterialGroupStatus)
VALUES (N'Tráng Miệng', 1);

-- thêm danh sách đơn vị tiền tệ --
INSERT INTO CURRENCY (CurrencyID, CurrencyName, CurrencyStatus)
VALUES (N'VND',N'Việt Nam Đồng', 1);
INSERT INTO CURRENCY (CurrencyID, CurrencyName, CurrencyStatus)
VALUES (N'USD',N'Đô La Mỹ', 1);
INSERT INTO CURRENCY (CurrencyID, CurrencyName, CurrencyStatus)
VALUES (N'EUR',N'Đồng EURO', 1);

-- thêm danh sách VAT --
INSERT INTO MATERIAL_VAT (VATName, VATValue, VATStatus)
VALUES (N'TKhông Chịu Thuế',0, 1);
INSERT INTO MATERIAL_VAT (VATName, VATValue, VATStatus)
VALUES (N'Thuế 0%',0, 1);
INSERT INTO MATERIAL_VAT (VATName, VATValue, VATStatus)
VALUES (N'Thuế 5%',5, 1);
INSERT INTO MATERIAL_VAT (VATName, VATValue, VATStatus)
VALUES (N'Thuế 8%',8, 1);
INSERT INTO MATERIAL_VAT (VATName, VATValue, VATStatus)
VALUES (N'Thuế 10%',10, 1);


-- thêm danh sách món ăn -- 
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000001',N'Cà Phê Đen', '' , 4, N'LY', 1, 1);
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000002',N'Cà Phê Đen Đá', '' ,  4, N'LY', 1 , 1);
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000003',N'Cà Phê Sữa', '' ,  4, N'LY', 1, 1);
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000004',N'Cà Phê Sữa Đá', '' ,  4, N'LY', 1, 1);
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000005',N'Trà Sữa Nguyên Chất', '' ,  1, N'LY', 1, 3);
INSERT INTO MATERIAL(MaterialID, MaterialName, MaterialImage, DivisionID, MaterialUnitID, MaterialStatus,  MaterialGroupID)
VALUES (N'1000000006',N'Sinh Tố Cà Chua', '' ,  1, N'LY', 1, 5);


-- thêm danh sách món ăn theo công ty -- 
--1000--
INSERT INTO MATERIAL_COMPANY (MaterialID, MaterialName, CompanyCode, CompanyName, MaterialComFrom,MaterialComTo,MaterialStatus)
VALUES (N'1000000001',N'Cà Phê Đen', 1000 , N'Công Ty TNHH LLTG','2020-07-01', '9999-12-31', 1);
INSERT INTO MATERIAL_COMPANY (MaterialID, MaterialName, CompanyCode, CompanyName, MaterialComFrom,MaterialComTo,MaterialStatus)
VALUES (N'1000000002',N'Cà Phê Đen Đá', 1000 , N'Công Ty TNHH LLTG','2020-07-01', '9999-12-31', 1);
--1001--
INSERT INTO MATERIAL_COMPANY (MaterialID, MaterialName, CompanyCode, CompanyName, MaterialComFrom,MaterialComTo,MaterialStatus)
VALUES (N'1000000003',N'Cà Phê Sữa', 1001 , N'Công Ty TNHH Giang Lê','2020-07-01', '9999-12-31', 1);
INSERT INTO MATERIAL_COMPANY (MaterialID, MaterialName, CompanyCode, CompanyName, MaterialComFrom,MaterialComTo,MaterialStatus)
VALUES (N'1000000004',N'Cà Phê Sữa Đá', 1001 , N'Công Ty TNHH Giang Lê','2020-07-01', '9999-12-31', 1);
--1002--
INSERT INTO MATERIAL_COMPANY (MaterialID, MaterialName, CompanyCode, CompanyName, MaterialComFrom,MaterialComTo,MaterialStatus)
VALUES (N'1000000005',N'rà Sữa Nguyên Chất', 1002 , N'Công Ty TNHH GLLT','2020-07-01', '9999-12-31', 1);


-- thêm danh sách giá --
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (20000,'1000000001', '1001', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (22000,'1000000001', '1002', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (20000,'1000000002', '1001', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (22000,'1000000002', '1002', N'VND', '2020-07-01', '9999-12-31','','' );

INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (22000,'1000000003', '1001', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (25000,'1000000003', '1002', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (22000,'1000000004', '1001', N'VND', '2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (25000,'1000000004', '1002', N'VND', '2020-07-01', '9999-12-31','','' );

INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (30000,'1000000005', '1001', N'VND',	'2020-07-01', '9999-12-31','','' );
INSERT INTO PRICE_MATERIAL(PriceAmount, MaterialID, CompanyCode, CurencyID, PriceFrom, PriceTo, CreateBy, CreateDate  )
VALUES (32000,'1000000005', '1002', N'VND', '2020-07-01', '9999-12-31','','' );


-- thêm danh sách hình thức thanh toán --
INSERT INTO PAYMENT_TERM(PaymentName, PaymentStatus)
VALUES (N'Tiền Mặt', 1);
INSERT INTO PAYMENT_TERM(PaymentName, PaymentStatus)
VALUES (N'Thẻ Ngân Hàng', 1);
INSERT INTO PAYMENT_TERM(PaymentName, PaymentStatus)
VALUES (N'VNPAY', 1);
INSERT INTO PAYMENT_TERM(PaymentName, PaymentStatus)
VALUES (N'Momo', 1);


-- thêm danh sách kênh bán hàng --
INSERT INTO CHANNEL(ChannelName, ChannelStatus)
VALUES (N'Trực Tiếp', 1);
INSERT INTO CHANNEL(ChannelName, ChannelStatus)
VALUES (N'Mang Đi', 1);
INSERT INTO CHANNEL(ChannelName, ChannelStatus)
VALUES (N'Foody', 1);
INSERT INTO CHANNEL(ChannelName, ChannelStatus)
VALUES (N'Grab', 1);
INSERT INTO CHANNEL(ChannelName, ChannelStatus)
VALUES (N'Baemin', 1);


--thêm danh sách loại khách hàng--
INSERT INTO CUSTOMER_TYPE (CustomerTypeName, CustomerTypeRevenue, CustomerTypePercent, CustomerTypeStatus)
VALUES (N'Thành Viên Đồng', 0 , 0, 1);
INSERT INTO CUSTOMER_TYPE (CustomerTypeName, CustomerTypeRevenue, CustomerTypePercent, CustomerTypeStatus)
VALUES (N'Thành Viên Bạc', 4000000, 5, 1);
INSERT INTO CUSTOMER_TYPE (CustomerTypeName, CustomerTypeRevenue, CustomerTypePercent, CustomerTypeStatus)
VALUES (N'Thành Viên Vàng', 7000000, 10, 1);
INSERT INTO CUSTOMER_TYPE (CustomerTypeName, CustomerTypeRevenue, CustomerTypePercent, CustomerTypeStatus)
VALUES (N'Thành Viên Bạch Kim', 10000000, 15, 1);


--thêm danh sách bàn--
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 1', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 2', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 3', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 4', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 5', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 6', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 7', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 8', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 9', 1);
INSERT INTO TABLE_ORDER (TableOrderName, TableOrderStatus)
VALUES (N'Bàn 10', 1);


--thêm danh loại Chương trình chiết khấu--
INSERT INTO PROMOTION_TYPE (PromotionTypeName, PromotionTypeStatus)
VALUES (N'Giảm giá khai trương', 1);
INSERT INTO PROMOTION_TYPE (PromotionTypeName, PromotionTypeStatus)
VALUES (N'Khách hàng thân thiết', 1);


--thêm danh áp dụng Chương trình chiết khấu--
INSERT INTO PROMOTION_ROLE (PromotionRoleName, PromotionRoleMin, PromotionRoleChannel, PromotionRoleStatus)
VALUES (N'Giảm giá khai trương', 0 , '' , 1);
INSERT INTO PROMOTION_ROLE (PromotionRoleName, PromotionRoleMin, PromotionRoleChannel, PromotionRoleStatus)
VALUES (N'Trực tiếp', 50000, 1, 1);
INSERT INTO PROMOTION_ROLE (PromotionRoleName, PromotionRoleMin, PromotionRoleChannel, PromotionRoleStatus)
VALUES (N'Mang đi', 50000, 2 , 1);


--danh sách chương trình khuyến mãi --
INSERT INTO PROMOTION (PromotionName, PromotionDiscountPer, PromotionDiscountAmount, PromotionDiscountMax, PromotionFrom, PromotionTo, 
PromotionTypeID, PromotionRoleID, PromotionStatus)
VALUES (N'Giảm giá khai trương', 50, '', '', '2020-07-01', '2020-08-31', 1, 1, 1);
INSERT INTO PROMOTION (PromotionName, PromotionDiscountPer, PromotionDiscountAmount, PromotionDiscountMax, PromotionFrom, PromotionTo, 
PromotionTypeID, PromotionRoleID, PromotionStatus)
VALUES (N'Giảm giá tại quán', '' , 10000, '', '2020-07-01', '2020-08-31', 2, 2, 1);
INSERT INTO PROMOTION (PromotionName, PromotionDiscountPer, PromotionDiscountAmount, PromotionDiscountMax, PromotionFrom, PromotionTo, 
PromotionTypeID, PromotionRoleID, PromotionStatus)
VALUES (N'Giảm giá mang đi', '' , 20000, '', '2020-07-01', '2020-08-31', 2, 3, 1);


--danh sách chương trình khuyến mãi --
INSERT INTO CUSTOMER (CustomerName, CustomerImage, CustomerBirthday, CustomerAddress, CustomerPhone, CustomerEmail, CustomerVAT, CustomerRevene, 
CustomerTypeID, CustomerCard, CustomerQRcode, CustomerStatus)
VALUES (N'Khách hàng vãng lai', '', '', '', '' , '' , '' , 0 , 1 , '' , '' , 1);
INSERT INTO CUSTOMER (CustomerName, CustomerImage, CustomerBirthday, CustomerAddress, CustomerPhone, CustomerEmail, CustomerVAT, CustomerRevene, 
CustomerTypeID, CustomerCard, CustomerQRcode, CustomerStatus)
VALUES (N'Thúy Phạm', '', '1990-07-22', N'54/65 Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', 0766669815 , N'gianglee007@gmail.com' , 
0123456789 , 0 , 1, '' , '' , 1);
INSERT INTO CUSTOMER (CustomerName, CustomerImage, CustomerBirthday, CustomerAddress, CustomerPhone, CustomerEmail, CustomerVAT, CustomerRevene, 
CustomerTypeID, CustomerCard, CustomerQRcode, CustomerStatus)
VALUES (N'Lê Lộc Trường Vũ', '', '1990-10-16', N'54 Lê Văn Lương, P. Tân Hưng, Quận 7, TPHCM', 0585888434 , N'lepham1622@gmail.com' , 
0123456789 , 0 , 1, '' , '' , 1);


--danh sách đơn hàng - HEADER --
INSERT INTO SALE_ORDER_HEADER (CompanyCode, ChannelID , ChannelName, DivisionID,  DivisionName, CustomerID, CustomerName, CustomerAddress, 
CustomerPhone, CustomerEmail, CustomerVAT, TableOrderID, TableOrderName, PaymentID, PaymentName, UserID, Username, FullName, PromotionID,
PromotionName, PromotionTypeID, PromotionTypeName, PromotionDiscount, SaleCurencyID, SaleOrderPriceNet, SaleOrderPriceTax, SaleOrderAmount,
SaleHeaderNote, SaleOrderStatus)
VALUES (1001, 1 , N'Trực Tiếp', 1 , N'Chung' , 1000000003 , N'Lê Lộc Trường Vũ' , N'54 Lê Văn Lương, P. Tân Hung, Quận 7, TPHCM', 0909009718,
N'lepham1622@gmail.com' , 123456789 , 1, N'Bàn 1', 1 , N'Tiền Mặt', 10005 , N'PVU.01', N'Phục Vụ 01', NULL , '', '' , '', '', 'VND',  
36000, 4000 ,40000,'', N'Chưa thanh toán');
INSERT INTO SALE_ORDER_HEADER (CompanyCode, ChannelID , ChannelName, DivisionID,  DivisionName, CustomerID, CustomerName, CustomerAddress, 
CustomerPhone, CustomerEmail, CustomerVAT, TableOrderID, TableOrderName, PaymentID, PaymentName, UserID, Username, FullName, PromotionID,
PromotionName, PromotionTypeID, PromotionTypeName, PromotionDiscount, SaleCurencyID, SaleOrderPriceNet, SaleOrderPriceTax, SaleOrderAmount,
SaleHeaderNote, SaleOrderStatus)
VALUES (1002, 2 , N'Mang Đi', 1 , N'Chung' , 1000000003 , N'Lê Lộc Trường Vũ' , N'54 Lê Văn Lương, P. Tân Hung, Quận 7, TPHCM', 0909009718,
N'lepham1622@gmail.com' , 123456789 , NULL , NULL , 1 , N'Tiền Mặt', 10005 , N'PVU.01', N'Phục Vụ 01', NULL , '', '' , '', '', 'VND',  
39600, 4400 ,44000,'', N'Chưa thanh toán')


--danh sách đơn hàng chi tiết - ITEM --
INSERT INTO SALE_ORDER_ITEM (SaleOrderID, SaleItem , MaterialID, MaterialName,  DivisionID, DivisionName, ChannelID, ChannelName, 
SaleQuantity, MaterialUnitID, MaterialUnitName, PromotionID, PromotionName, PromotionTypeID, PromotionTypeName, SalePriceUnit, SalePriceDiscount,
SalePriceUnitTax, SalePrice, SaleCurencyID, SaleItemNote)
VALUES (1000000000, 1 , N'1000000001', N'Cà Phê Đen', 4 , N'Cà phê' , 1 , N'Trực Tiếp', 1 , N'LY' , N'Ly', NULL ,'','','', 18000, '', 2000, 20000,
N'VND' , N'Nhiều đường')
INSERT INTO SALE_ORDER_ITEM (SaleOrderID, SaleItem , MaterialID, MaterialName,  DivisionID, DivisionName, ChannelID, ChannelName, 
SaleQuantity, MaterialUnitID, MaterialUnitName, PromotionID, PromotionName, PromotionTypeID, PromotionTypeName, SalePriceUnit, SalePriceDiscount,
SalePriceUnitTax, SalePrice, SaleCurencyID, SaleItemNote)
VALUES (1000000000, 2 , N'1000000002', N'Cà Phê Đen Đá', 4 , N'Cà phê' , 1 , N'Trực Tiếp', 1 , N'LY' , N'Ly', NULL ,'','','', 18000, '', 2000, 20000,
N'VND' , N'Ít đá')

INSERT INTO SALE_ORDER_ITEM (SaleOrderID, SaleItem , MaterialID, MaterialName,  DivisionID, DivisionName, ChannelID, ChannelName, 
SaleQuantity, MaterialUnitID, MaterialUnitName, PromotionID, PromotionName, PromotionTypeID, PromotionTypeName, SalePriceUnit, SalePriceDiscount,
SalePriceUnitTax, SalePrice, SaleCurencyID, SaleItemNote)
VALUES (1000000001, 1 , N'1000000001', N'Cà Phê Đen', 4 , N'Cà phê' , 2 , N'Mang đi', 1 , N'LY' , N'Ly', NULL ,'','','', 19800, '', 2200, 22000,
N'VND' , '')
INSERT INTO SALE_ORDER_ITEM (SaleOrderID, SaleItem , MaterialID, MaterialName,  DivisionID, DivisionName, ChannelID, ChannelName, 
SaleQuantity, MaterialUnitID, MaterialUnitName, PromotionID, PromotionName, PromotionTypeID, PromotionTypeName, SalePriceUnit, SalePriceDiscount,
SalePriceUnitTax, SalePrice, SaleCurencyID, SaleItemNote)
VALUES (1000000001, 2 , N'1000000002', N'Cà Phê Đen Đá', 4 , N'Cà phê' , 2 , N'Mang đi', 1 , N'LY' , N'Ly', NULL ,'','','', 19800, '', 2200, 22000,
N'VND' , '')

-- thêm dánh data--
--------------------------------------------------------------------------------------------------------


--------------------------------------------------------------------------------------------------------
-- select data--

select p.PriceAmount
from MATERIAL as f, PRICE_MATERIAL as p
where f.MaterialID = p.MaterialID 
and f.MaterialID = 'CFD0000001'
and p.CompanyCode = 1001
and p.PriceFrom < '2020-07-15'
and p.PriceTo > '2020-07-15'


-- lấy danh sách mã sản phẩm theo công ty--
Select *
From MATERIAL_COMPANY AS MC, MATERIAL AS M
WHERE MC.MaterialID = M.MaterialID
AND MC.COMPANYCODE = '1000'
AND MaterialComFrom < '2020-07-15'
AND MaterialComTo > '2020-07-15'


-- lấy danh sách mã sản phẩm theo công ty kèm giá--
Select *
From MATERIAL_COMPANY AS MC, MATERIAL AS M, PRICE_MATERIAL AS PM
WHERE MC.MaterialID = M.MaterialID
AND	M.MaterialID = PM.MaterialID
AND MC.COMPANYCODE = '1002'
AND PM.CompanyCode = '1002'
AND MaterialComFrom < '2020-07-15'
AND MaterialComTo > '2020-07-15'
AND PriceFrom < '2020-07-15'
AND PriceTo > '2020-07-15'


-- lấy danh chương trình khuyến mãi--
Select *
From PROMOTION AS P, PROMOTION_ROLE AS PR, PROMOTION_TYPE AS PT
WHERE P.PromotionTypeID = PT.PromotionTypeID
AND	P.PromotionRoleID = PR.PromotionRoleID
AND P.PromotionFrom < '2020-08-06'
AND P.PromotionTo > '2020-08-06'
AND P.PromotionStatus = 'TRUE'
AND P.PromotionID = '2'

-- lấy danh sách khách hàng--
Select *
From CUSTOMER AS C, CUSTOMER_TYPE AS CT
WHERE C.CustomerTypeID = CT.CustomerTypeID
AND C.CustomerStatus = 'TRUE'


-- lấy danh sách loại khách hàng theo doanh thu--
Select TOP 1 *
From CUSTOMER_TYPE
WHERE CustomerTypeRevenue <= 15000000
ORDER BY CustomerTypeRevenue DESC


-- lấy danh sách đơn hàng Chi tiết--
SELECT *
FROM SALE_ORDER_HEADER AS SH, SALE_ORDER_ITEM AS SI
WHERE SH.SaleOrderID = SI.SaleOrderID

-- select data--
--------------------------------------------------------------------------------------------------------


-- Struct data--
ALTER TABLE MATERIAL
ADD CONSTRAINT FK_MATERIAL_MaterialVAT
FOREIGN KEY (MaterialVAT) REFERENCES Material_VAT(VATID);

ALTER TABLE MATERIAL_VAT
DROP CONSTRAINT PK__Material__4A9628CE9958A960;

-- Xóa liên kết khóa ngoại
ALTER TABLE Material
DROP CONSTRAINT FK_MATERIAL_MaterialVAT;

-- Xóa cột hiện tại
ALTER TABLE MATERIAL_VAT
DROP COLUMN VATID;

-- Tạo lại cột với thuộc tính IDENTITY
ALTER TABLE MATERIAL_VAT
ADD VATID INT IDENTITY(1,1) PRIMARY KEY;