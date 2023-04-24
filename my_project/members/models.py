from django.db import models

# Create your models here.
class Member(models.Model):
  firstname = models.CharField(max_length=255)
  lastname = models.CharField(max_length=255)

class T001(models.Model):
  BUKRS = models.CharField(max_length=10)
  BUTXT = models.CharField(max_length=100)
  ORT01 = models.CharField(max_length=1000)
  LAND1 = models.CharField(max_length=10)
  DESC  = models.CharField(max_length=50)
