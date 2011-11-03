from django.db import models
from inventor.company.manager import CompanyManager


class Company(models.Model):

    name = models.CharField(max_length = 50)
    vat = models.CharField(max_length = 50, unique = True)
    regCom = models.CharField(max_length = 50)
    objects = CompanyManager()


class Address(models.Model):
    
    street = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    zipcode = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="CompanyAddress")
    
class Contact(models.Model):
    
    name = models.CharField(max_length = 50)
    phoneNumber = models.CharField(max_length = 50)
    email = models.EmailField()
    company = models.ForeignKey(Company, related_name="CompanyContact")
    

class BankInformation(models.Model):
    
    name = models.CharField(max_length = 50)
    iban = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="CompanyBank")



