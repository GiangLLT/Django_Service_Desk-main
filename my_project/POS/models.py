from django.db import models

class Company(models.Model):
    CompanyCode = models.CharField(primary_key=True, max_length=5)
    CompanyName = models.CharField(max_length=255)
    CompanyAddress = models.CharField(max_length=255)
    CompanyVAT = models.CharField(max_length=20)
    CompanyStatus = models.BooleanField()
    class Meta:
        db_table = 'Company'

class Department(models.Model):
    DepartID = models.CharField(primary_key=True, max_length=5)
    DepartName = models.CharField(max_length=255)
    DepartStatus = models.BooleanField()
    class Meta:
        db_table = 'Department'

class Position(models.Model):
    PositionID = models.CharField(primary_key=True, max_length=5)
    PositionName = models.CharField(max_length=255)
    PositionStatus = models.BooleanField()
    class Meta:
        db_table = 'Position'

class UserGroup(models.Model):
    UserGroupID = models.CharField(primary_key=True, max_length=5)
    UserGroupName = models.CharField(max_length=255)
    UserGroupStatus = models.BooleanField()
    class Meta:
        db_table = 'User_Group'

class UserRole(models.Model):
    UserRoleID = models.CharField(primary_key=True, max_length=150)
    UserRoleName = models.CharField(max_length=255)
    UserRoleStatus = models.BooleanField()
    class Meta:
        db_table = 'User_Role'

class UserSY(models.Model):
    UserID = models.AutoField(primary_key=True)
    Username = models.CharField(max_length=100)
    Password = models.CharField(max_length=100)
    FullName = models.CharField(max_length=255)
    ImageUrl = models.TextField()
    BirthDay = models.DateField(null=True, blank=True)
    Email = models.CharField(max_length=255)
    Gender = models.CharField(max_length=5)
    Address = models.CharField(max_length=255)
    CompanyCode = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='CompanyCode')
    DepartID = models.ForeignKey(Department, on_delete=models.CASCADE, db_column='DepartID')
    PositionID = models.ForeignKey(Position, on_delete=models.CASCADE, db_column='PositionID')
    UserGroupID = models.ForeignKey(UserGroup, on_delete=models.CASCADE, db_column='UserGroupID')
    CreateBy = models.CharField(max_length=20)
    CreateDate = models.DateTimeField()
    UserRole = models.IntegerField()
    UserStatus = models.BooleanField()
    class Meta:
        db_table = 'User_SY'

class Authorize(models.Model):
    AhthorizeID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(UserSY, on_delete=models.CASCADE)
    UserRoleID = models.ForeignKey(UserRole, on_delete=models.CASCADE)
    AuthorizeFrom = models.DateField()
    AuthorizeTo = models.DateField()
    AuthorizeStatus = models.BooleanField()
    class Meta:
        db_table = 'Authorize'

class Division(models.Model):
    DivisionID = models.AutoField(primary_key=True)
    DivisionName = models.CharField(max_length=255)
    DivisionStatus = models.BooleanField()
    class Meta:
        db_table = 'Division'

class MaterialUnit(models.Model):
    MaterialUnitID = models.CharField(primary_key=True, max_length=3)
    MaterialUnitName = models.CharField(max_length=255)
    MaterialUnitStatus = models.BooleanField()
    class Meta:
        db_table = 'Material_Unit'

class MaterialType(models.Model):
    MaterialTypeID = models.IntegerField(primary_key=True)
    MaterialTypeName = models.CharField(max_length=255)
    MaterialTypeStatus = models.BooleanField()
    class Meta:
        db_table = 'Material_Type'

class Currency(models.Model):
    CurrencyID = models.CharField(primary_key=True, max_length=3)
    CurrencyName = models.CharField(max_length=255)
    CurrencyStatus = models.BooleanField()
    class Meta:
        db_table = 'Currency'

class MaterialVAT(models.Model):
    VATID = models.IntegerField(primary_key=True)
    VATName = models.CharField(max_length=255)
    VATValue = models.IntegerField()
    VATStatus = models.BooleanField()
    class Meta:
        db_table = 'Material_VAT'

class MaterialGroup(models.Model):
    MaterialGroupID = models.IntegerField(primary_key=True)
    MaterialGroupName = models.CharField(max_length=255)
    MaterialGroupStatus = models.BooleanField()
    MaterialGroupIcon = models.CharField(max_length=255)
    class Meta:
        db_table = 'Material_Group' 


class Material(models.Model):
    MaterialID = models.CharField(primary_key=True, max_length=10)
    MaterialName = models.CharField(max_length=255)
    MaterialImage = models.TextField(blank=True, null=True)
    DivisionID = models.ForeignKey(Division, on_delete=models.CASCADE, db_column='DivisionID')
    MaterialUnitID = models.ForeignKey(MaterialUnit, on_delete=models.CASCADE, db_column='MaterialUnitID')
    MaterialTypeID = models.ForeignKey(MaterialType, on_delete=models.CASCADE, db_column='MaterialTypeID')
    MaterialGroupID = models.ForeignKey(MaterialGroup, on_delete=models.CASCADE, db_column='MaterialGroupID')
    MaterialNote = models.TextField(blank=True, null=True)
    # MaterialUserCreate = models.ForeignKey(UserSY, on_delete=models.CASCADE, db_column='UserID')
    MaterialDate = models.DateTimeField()
    # MaterialVAT = models.ForeignKey(MaterialVAT, on_delete=models.CASCADE, db_column='VATID')
    MaterialStatus = models.BooleanField(default=True)
    class Meta:
        db_table = 'Material'


class PriceMaterial(models.Model):
    PriceID = models.AutoField(primary_key=True)
    PriceAmount = models.BigIntegerField()
    PriceDiscount = models.BigIntegerField()
    PriceDiscountType = models.CharField(max_length=50)
    MaterialID = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='MaterialID')
    CompanyCode = models.ForeignKey(Company, on_delete=models.CASCADE , db_column='CompanyCode')
    CurencyID = models.ForeignKey(Currency, on_delete=models.CASCADE , db_column='CurencyID')
    PriceFrom = models.DateField()
    PriceTo = models.DateField()
    CreateBy = models.CharField(max_length=20)
    CreateDate = models.DateTimeField()
    class Meta:
        db_table = 'Price_Material'  

class MaterialCompany(models.Model):
    MaterialComID = models.AutoField(primary_key=True)
    MaterialID = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='MaterialID')
    MaterialName = models.CharField(max_length=255)
    CompanyCode = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='CompanyCode')
    CompanyName = models.CharField(max_length=255)
    MaterialComFrom = models.DateField()
    MaterialComTo = models.DateField()
    MaterialStatus = models.BooleanField(default=True)
    class Meta:
        db_table = 'Material_Company' 

class PaymentTerm(models.Model):
    PaymentID = models.AutoField(primary_key=True)
    PaymentName = models.CharField(max_length=255)
    PaymentStatus = models.BooleanField(default=True)
    class Meta:
        db_table = 'Payment_Term'

class Channel(models.Model):
    ChannelID = models.AutoField(primary_key=True)
    ChannelName = models.CharField(max_length=255)
    ChannelStatus = models.BooleanField(default=True)
    class Meta:
        db_table = 'Channel'

class CustomerType(models.Model):
    CustomerTypeID = models.AutoField(primary_key=True)
    CustomerTypeName = models.CharField(max_length=255)
    CustomerTypeRevenue = models.BigIntegerField()
    CustomerTypePercent = models.IntegerField()
    CustomerTypeStatus = models.BooleanField(default=True)
    class Meta:
        db_table = 'Customer_Type'

class TableOrder(models.Model):
    TableOrderID = models.AutoField(primary_key=True)
    TableOrderName = models.CharField(max_length=255)
    TableOrderStatus = models.BooleanField(default=True)
    TableOrderQuantity = models.IntegerField()
    class Meta:
        db_table = 'Table_Order'

class PromotionType(models.Model):
    PromotionTypeID = models.AutoField(primary_key=True)
    PromotionTypeName = models.CharField(max_length=255)
    PromotionTypeStatus = models.BooleanField()
    class Meta:
        db_table = 'Promotion_Type'

class PromotionRole(models.Model):
    PromotionRoleID = models.AutoField(primary_key=True)
    PromotionRoleName = models.CharField(max_length=255)
    PromotionRoleMin = models.BigIntegerField()
    PromotionRoleChannel = models.BigIntegerField()
    PromotionRoleStatus = models.BooleanField()
    class Meta:
        db_table = 'Promotion_Role'

class Promotion(models.Model):
    PromotionID = models.AutoField(primary_key=True)
    PromotionName = models.CharField(max_length=255)
    PromotionDiscountPer = models.BigIntegerField()
    PromotionDiscountAmount = models.BigIntegerField()
    PromotionDiscountMax = models.BigIntegerField()
    PromotionFrom = models.DateField()
    PromotionTo = models.DateField()
    PromotionTypeID = models.ForeignKey(PromotionType, on_delete=models.CASCADE, db_column='PromotionTypeID')
    PromotionRoleID = models.ForeignKey(PromotionRole, on_delete=models.CASCADE, db_column='PromotionRoleID')
    PromotionStatus = models.BooleanField()
    CompanyCode = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='CompanyCode')
    class Meta:
        db_table = 'Promotion'

class Customer(models.Model):
    CustomerID = models.AutoField(primary_key=True)
    CustomerName = models.CharField(max_length=255)
    CustomerImage = models.CharField(max_length=255)
    CustomerGender = models.CharField(max_length=15)
    CustomerBirthday = models.DateField()
    CustomerAddress = models.CharField(max_length=255)
    CustomerPhone = models.CharField(max_length=15)
    CustomerEmail = models.CharField(max_length=255)
    CustomerVAT = models.CharField(max_length=20)
    CustomerPoint = models.IntegerField()
    CustomerRevene = models.BigIntegerField()
    CustomerTypeID = models.ForeignKey(CustomerType, on_delete=models.CASCADE, db_column='CustomerTypeID')
    CustomerCard = models.CharField(max_length=50)
    CustomerQRcode = models.CharField(max_length=20)
    CustomerStatus = models.BooleanField()
    class Meta:
        db_table = 'Customer'

class SaleOrderHeader(models.Model):
    SaleOrderID = models.BigAutoField(primary_key=True)
    CompanyCode = models.CharField(max_length=5)
    ChannelID = models.ForeignKey(Channel, on_delete=models.CASCADE, db_column='ChannelID')
    ChannelName = models.CharField(max_length=255)
    DivisionID = models.ForeignKey(Division, on_delete=models.CASCADE, db_column='DivisionID')
    DivisionName = models.CharField(max_length=255)
    CustomerID = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='CustomerID')
    CustomerName = models.CharField(max_length=255)
    CustomerAddress = models.CharField(max_length=255)
    CustomerPhone = models.CharField(max_length=15)
    CustomerEmail = models.CharField(max_length=255)
    CustomerVAT = models.CharField(max_length=20)
    TableOrderID = models.ForeignKey(TableOrder, on_delete=models.CASCADE, db_column='TableOrderID')
    TableOrderName = models.CharField(max_length=255)
    PaymentID = models.ForeignKey(PaymentTerm, on_delete=models.CASCADE, db_column='PaymentID')
    PaymentName = models.CharField(max_length=255)
    UserID = models.ForeignKey(UserSY, on_delete=models.CASCADE, db_column='UserID')
    Username = models.CharField(max_length=20)
    FullName = models.CharField(max_length=255)
    PromotionID = models.ForeignKey(Promotion, on_delete=models.CASCADE, null=True)
    PromotionName = models.CharField(max_length=255, null=True)
    PromotionTypeID = models.ForeignKey(PromotionType, on_delete=models.CASCADE, null=True)
    PromotionTypeName = models.CharField(max_length=255, null=True)
    PromotionDiscount = models.BigIntegerField(null=True)
    SaleCurencyID = models.ForeignKey(Currency, on_delete=models.CASCADE, db_column='CurrencyID')
    SaleOrderPriceNet = models.BigIntegerField()
    SaleOrderPriceTax = models.BigIntegerField()
    SaleOrderAmount = models.BigIntegerField()
    SaleHeaderNote = models.TextField()
    SaleOrderStatus = models.CharField(max_length=255)
    SaleOrderDate = models.DateField()
    class Meta:
        db_table = 'Sale_Order_Header'

class SaleOrderItem(models.Model):
    SaleID = models.BigAutoField(primary_key=True)
    SaleOrderID = models.ForeignKey('SaleOrderHeader', on_delete=models.CASCADE, db_column='SaleOrderID')
    SaleItem = models.IntegerField()
    MaterialID = models.CharField(max_length=10)
    MaterialName = models.CharField(max_length=255)
    DivisionID = models.ForeignKey(Division, on_delete=models.CASCADE, db_column='DivisionID')
    DivisionName = models.CharField(max_length=255)
    ChannelID = models.ForeignKey(Channel, on_delete=models.CASCADE, db_column='ChannelID')
    ChannelName = models.CharField(max_length=255)
    SaleQuantity = models.IntegerField()
    MaterialUnitID = models.CharField(max_length=3)
    MaterialUnitName = models.CharField(max_length=255)
    PromotionID = models.ForeignKey(Promotion, on_delete=models.CASCADE, db_column='PromotionID')
    PromotionName = models.CharField(max_length=255)
    PromotionTypeID = models.IntegerField()
    PromotionTypeName = models.TextField()
    SalePriceUnit = models.BigIntegerField()
    SalePriceDiscount = models.BigIntegerField()
    SalePriceUnitTax = models.BigIntegerField()
    SalePrice = models.BigIntegerField()
    SaleCurencyID = models.CharField(max_length=3)
    SaleItemNote = models.TextField()
    class Meta:
        db_table = 'Sale_Order_Item'


class BillHeader(models.Model):
    BillingID = models.BigIntegerField(primary_key=True)
    SaleOrderID = models.ForeignKey('SaleOrderHeader', on_delete=models.CASCADE)
    CompanyCode = models.CharField(max_length=5)
    DivisionID = models.ForeignKey('Division', on_delete=models.CASCADE)
    DivisionName = models.CharField(max_length=255)
    ChannelID = models.ForeignKey('Channel', on_delete=models.CASCADE)
    ChannelName = models.CharField(max_length=255)
    CustomerID = models.ForeignKey('Customer', on_delete=models.CASCADE)
    CustomerName = models.TextField()
    CustomerAddress = models.TextField()
    CustomerPhone = models.CharField(max_length=15)
    CustomerEmail = models.CharField(max_length=255)
    CustomerVAT = models.CharField(max_length=20)
    TableOrderID = models.IntegerField()
    TableOrderName = models.CharField(max_length=255)
    PaymentID = models.ForeignKey('PaymentTerm', on_delete=models.CASCADE)
    PaymentName = models.CharField(max_length=255)
    UserID = models.ForeignKey('UserSY', on_delete=models.CASCADE)
    Username = models.CharField(max_length=20)
    FullName = models.CharField(max_length=255)
    PromotionID = models.ForeignKey('Promotion', on_delete=models.CASCADE)
    PromotionName = models.CharField(max_length=255)
    PromotionTypeID = models.IntegerField()
    PromotionTypeName = models.TextField()
    PromotionDiscount = models.IntegerField()
    BillPrice = models.BigIntegerField()
    BillPriceTax = models.BigIntegerField()
    BillPriceAmount = models.BigIntegerField()
    CurrencyID = models.CharField(max_length=3)
    CurrencyName = models.CharField(max_length=255)
    BillHeaderNote = models.TextField()
    class Meta:
        db_table = 'Bill_Header'


class BillItem(models.Model):
    BillID = models.BigAutoField(primary_key=True)
    BillingID = models.ForeignKey('BillHeader', on_delete=models.CASCADE)
    BillItem = models.IntegerField()
    MaterialID = models.CharField(max_length=10)
    MaterialName = models.CharField(max_length=255)
    DivisionID = models.ForeignKey('Division', on_delete=models.CASCADE)
    DivisionName = models.CharField(max_length=255)
    ChannelID = models.ForeignKey('Channel', on_delete=models.CASCADE)
    ChannelName = models.CharField(max_length=255)
    SaleQuantity = models.IntegerField()
    MaterialUnitID = models.CharField(max_length=3)
    MaterialUnitName = models.CharField(max_length=255)
    PromotionID = models.ForeignKey('Promotion', on_delete=models.CASCADE)
    PromotionName = models.CharField(max_length=255)
    PromotionTypeID = models.IntegerField()
    PromotionTypeName = models.TextField()
    BillPriceUnit = models.BigIntegerField()
    BillPriceDiscount = models.BigIntegerField()
    BillPriceUnitTax = models.BigIntegerField()
    BillPrice = models.BigIntegerField()
    BillCurencyID = models.CharField(max_length=3)
    BillItemNote = models.TextField()
    
    class Meta:
        db_table = 'BILL_ITEM'
        
    def __str__(self):
        return f'{self.MaterialName} ({self.MaterialID})'