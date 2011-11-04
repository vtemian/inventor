from django.db import models
from inventor.products.manager import ProductManager
import reversion

class Category(models.Model):

    name = models.CharField(max_length = 20)
    description = models.CharField(max_length = 60)

class UM(models.Model):

    name = models.CharField(max_length = 20)
    abreviation = models.CharField(max_length = 5)
    measures = models.CharField(max_length = 20) #weight, volume, model (Product, InvoiceItem, etc.)
    #measureValue = models.CharField(max_length = 20) #model pk value
    conversionFactor = models.FloatField(null=True)
    conversionUnit = models.ForeignKey('self', null=True)

class Product(models.Model):

    code = models.CharField(max_length = 10)
    name = models.CharField(max_length = 50)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='category')
    ums = models.ManyToManyField(UM)
    notes = models.TextField()
    barCode = models.CharField(max_length = 13)
    modified = models.BooleanField()
    active = models.BooleanField()
    objects = ProductManager()