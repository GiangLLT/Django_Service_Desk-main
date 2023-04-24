from django.db import models
from django.core.validators import MaxValueValidator

# Create your models here.
class T001(models.Model):
  BUKRS = models.CharField(max_length=10)
  BUTXT = models.CharField(max_length=100)
  ORT01 = models.CharField(max_length=1000)
  LAND1 = models.CharField(max_length=10)
  DESC  = models.CharField(max_length=50)



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
    

class Users(models.Model):
    ID_user  = models.CharField(primary_key=True, max_length=20)
    Mail = models.EmailField(max_length=200)
    Password     = models.CharField(max_length=50)
    FullName     = models.CharField(max_length=100)
    displayName  = models.CharField(max_length=100)
    Birthday     = models.DateField(max_length=20)
    Acc_Type     = models.CharField(max_length=50)
    Address      = models.CharField(max_length=50)
    Jobtitle     = models.CharField(max_length=50)
    Phone = models.IntegerField(validators=[MaxValueValidator(9999999999)])
    Avatar       = models.CharField(max_length=1000)
    User_Status  = models.BooleanField(max_length=20)

def __str__(self):
        return self.ID_user # Trả về giá trị của trường IDuser làm giá trị chuỗi của đối tượng User
