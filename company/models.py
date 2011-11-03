from django.db import models



class Address(models.Model):
    
    street = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    zipcode = models.CharField(max_length = 50)

    
class Contact(models.Model):
    
    name = models.CharField(max_length = 50)
    phoneNumber = models.CharField(max_length = 50)
    email = models.EmailField()
    

class BankInformation(models.Model):
    
    name = models.CharField(max_length = 50)
    iban = models.CharField(max_length = 50)
    

class Company(models.Model):

    name = models.CharField(max_length = 50)
    vat = models.CharField(max_length = 50, unique = True)
    regCom = models.CharField(max_length = 50)
    addresses = models.ManyToManyField(Address)
    contacts = models.ManyToManyField(Contact)
    bank = models.ManyToManyField(BankInformation)

