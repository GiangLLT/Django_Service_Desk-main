from django.db import models
from django.core.validators import MaxValueValidator

# # Create your models here.
# class T001(models.Model):
#   BUKRS = models.CharField(max_length=10)
#   BUTXT = models.CharField(max_length=100)
#   ORT01 = models.CharField(max_length=1000)
#   LAND1 = models.CharField(max_length=10)
#   DESC  = models.CharField(max_length=50)



class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Product(models.Model):
    name     = models.CharField(max_length=100)
    id_cate  = models.ForeignKey(Category, on_delete=models.CASCADE)
    category = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.category
    

#API
class MailStatus(models.Model):
    Mail_ID = models.CharField(max_length=1000)
    Status = models.BooleanField(max_length=20)

    def __str__(self):
        return self.Mail_ID


#model Helpdesk
class Users(models.Model):
    ID_user  = models.CharField(primary_key=True, max_length=20)
    Company_ID = models.IntegerField()
    Mail = models.EmailField(max_length=200)
    Password     = models.CharField(max_length=50)
    FullName     = models.CharField(max_length=100)
    displayName  = models.CharField(max_length=100)
    Birthday     = models.DateField(max_length=20)
    Acc_Type     = models.CharField(max_length=50)
    Address      = models.CharField(max_length=50)
    Jobtitle     = models.CharField(max_length=50)
    Phone        = models.IntegerField(validators=[MaxValueValidator(9999999999)])
    Avatar       = models.CharField(max_length=1000)
    ID_Create    = models.CharField(max_length=20)
    Name_Create  = models.CharField(max_length=100)
    Date_Create  = models.DateField()
    Time_Create  = models.TimeField()
    User_Status  = models.BooleanField(max_length=20)
    User_Type  = models.IntegerField() #0 - administrator , 1 - mod, 2- user member
    class Meta:
        db_table = 'User_System'

# def __str__(self):
#         return self.ID_user # Trả về giá trị của trường IDuser làm giá trị chuỗi của đối tượng User

class Company(models.Model):
    Company_ID = models.AutoField(primary_key=True)
    Company_Name = models.CharField(max_length=255)
    ID_user =models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Company_User_Name = models.CharField(max_length=255)
    Company_Date = models.DateField()
    Company_Time = models.TimeField()
    Company_Status = models.BooleanField()
    class Meta:
        db_table = 'Company'

class TGroup(models.Model):
    TGroup_ID = models.AutoField(primary_key=True)
    TGroup_Name = models.CharField(max_length=255)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    TGroup_User_Name = models.CharField(max_length=255)
    TGroup_Date = models.DateField()
    TGroup_Time = models.TimeField()
    TGroup_Status = models.BooleanField()
    class Meta:
        db_table = 'TGroup'

class Ticket(models.Model):
    Ticket_ID = models.AutoField(primary_key=True)
    Ticket_Title = models.CharField(max_length=255)
    Ticket_Desc = models.TextField()
    Ticket_Type= models.IntegerField()
    Company_ID = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='Company_ID')
    TGroup_ID = models.ForeignKey(TGroup, on_delete=models.CASCADE, db_column='TGroup_ID')
    ID_User = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Ticket_User_Name = models.CharField(max_length=255)
    Ticket_Date = models.DateField()
    Ticket_Time = models.TimeField()
    Ticket_User_Asign = models.CharField(max_length=20)
    Ticket_Name_Asign = models.CharField(max_length=255)
    Ticket_Status = models.IntegerField()
    class Meta:
        db_table = 'Ticket'

class TImage(models.Model):
    TImage_ID = models.AutoField(primary_key=True)
    Ticket_ID = models.ForeignKey(Ticket, on_delete=models.CASCADE, db_column='Ticket_ID')
    # Ticket_ID = models.ForeignKey(Ticket, on_delete=models.PROTECT, db_column='Ticket_ID')
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Timage_Url = models.CharField(max_length=255)
    TImage_User_Name = models.CharField(max_length=255)
    TImage_Date = models.DateField()
    TImage_Time = models.TimeField()
    TImage_Status = models.BooleanField()
    class Meta:
        db_table = 'TImage'

class Attachment(models.Model):
    Attachment_ID = models.AutoField(primary_key=True)
    Ticket_ID = models.ForeignKey(Ticket, on_delete=models.CASCADE, db_column='Ticket_ID')
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Attachment_Url = models.CharField(max_length=255)
    Attachment_User_Name = models.CharField(max_length=255)
    Attachment_Date = models.DateField()
    Attachment_Time = models.TimeField()
    Attachment_Status = models.BooleanField()
    class Meta:
        db_table = 'Attachment'

class Comment(models.Model):
    Comment_ID = models.AutoField(primary_key=True)
    Ticket_ID = models.ForeignKey(Ticket, on_delete=models.CASCADE, db_column='Ticket_ID')
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Comment_Desc = models.CharField(max_length=255)
    Comment_level = models.IntegerField()
    Comment_User_Name = models.CharField(max_length=255)
    Comment_Date = models.DateField()
    Comment_Time = models.TimeField()
    Comment_Status = models.BooleanField()
    class Meta:
        db_table = 'Comment'

class ReadComment(models.Model):
    ReadComment_ID = models.AutoField(primary_key=True)
    Comment_ID = models.ForeignKey(Comment, on_delete=models.CASCADE, db_column='Comment_ID')
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    ReadComment_Isread = models.BooleanField()
    class Meta:
        db_table = 'ReadComment'

class Assign_User(models.Model):
    Assign_ID = models.AutoField(primary_key=True)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    TGroup_ID = models.ForeignKey(TGroup, on_delete=models.CASCADE, db_column='TGroup_ID')
    Assign_User_ID = models.CharField(max_length=20)
    Assign_User_Name = models.CharField(max_length=255)
    Assign_User_Date = models.DateField()
    Assign_User_Time = models.TimeField()
    Assign_User_Status = models.BooleanField()
    class Meta:
        db_table = 'Assign_User'

class Menu(models.Model):
    Menu_ID = models.AutoField(primary_key=True)
    Menu_Name = models.CharField(max_length=255)
    Menu_Adress = models.CharField(max_length=255)
    Menu_Icon = models.CharField(max_length=255)
    Menu_Level = models.IntegerField()
    # Role_Group_ID = models.ForeignKey(Role_Group, on_delete=models.CASCADE, db_column='Role_Group_ID')
    Menu_CreateID = models.CharField(max_length=20)
    Menu_CreateBy = models.CharField(max_length=255)
    Menu_Date = models.DateField()
    Menu_Time = models.TimeField()
    Menu_Status = models.BooleanField()
    class Meta:
        db_table = 'Menu'

class Role_Group(models.Model):
    Role_Group_ID = models.AutoField(primary_key=True)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Menu_ID = models.ForeignKey(Menu, on_delete=models.CASCADE, db_column='Menu_ID')
    Role_Group_Address = models.CharField(max_length=255)
    Role_Group_Name = models.CharField(max_length=255)
    Role_Group_CreateBy = models.CharField(max_length=255)
    Role_Group_Date = models.DateField()
    Role_Group_Time = models.TimeField()
    Role_Group_Status = models.BooleanField()
    class Meta:
        db_table = 'Role_Group'

class Role_Single(models.Model):
    Role_ID = models.AutoField(primary_key=True)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Role_Name = models.CharField(max_length=255)
    Role_Group_ID = models.ForeignKey(Role_Group, on_delete=models.CASCADE, db_column='Role_Group_ID')
    Role_CreateBy = models.CharField(max_length=255)
    Role_Date = models.DateField()
    Role_Time = models.TimeField()
    Role_Status = models.BooleanField()
    class Meta:
        db_table = 'Role_Single'

class Authorization_User(models.Model):
    Authorization_ID = models.AutoField(primary_key=True)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    Role_ID = models.ForeignKey(Role_Single, on_delete=models.CASCADE, db_column='Role_ID')
    Authorization_From = models.DateField()
    Authorization_To = models.DateField()
    Authorization_CreateID = models.CharField(max_length=20)
    Authorization_CreateBy = models.CharField(max_length=255)
    Authorization_Date = models.DateField()
    Authorization_Time = models.TimeField()
    Authorization_Status = models.BooleanField()
    class Meta:
        db_table = 'Authorization_User'

class Ticket_Mapping(models.Model):
    Ticket_Mapping_ID = models.AutoField(primary_key=True)
    Ticket_ID = models.ForeignKey(Ticket, on_delete=models.CASCADE, db_column='Ticket_ID')
    Email_ID  = models.CharField(max_length=255)
    Comment_ID = models.IntegerField()
    Ticket_Mapping_Status = models.BooleanField()
    class Meta:
        db_table = 'Ticket_Mapping'

class FaceID(models.Model):
    FaceID = models.AutoField(primary_key=True)
    ID_user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='ID_user')
    FaceID_Image = models.ImageField(upload_to='')
    FaceID_Date = models.DateField()
    FaceID_Time = models.TimeField()
    FaceID_Status = models.BooleanField()
    class Meta:
        db_table = 'FaceID'

class Face(models.Model):
    ID_Image = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to='detect_image/')
    class Meta:
        db_table = 'Face'

class Face_ID(models.Model):
    ID_Image = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to='')
    image_Code = models.BinaryField(max)
    class Meta:
        db_table = 'Face_ID'




