from django.db import models
from inventor.products.manager import ProductManager
import reversion

class Category(models.Model):

    name = models.CharField(max_length = 20)
    description = models.CharField(max_length = 60)

class Product(models.Model):

    code = models.CharField(max_length = 10)
    name = models.CharField(max_length = 50)
    vat = models.CharField(max_length = 50)
    regCom = models.CharField(max_length = 50)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='category')
    notes = models.TextField()
    barCode = models.CharField(max_length = 13)
    modified = models.BooleanField()
    active = models.BooleanField()
    objects = ProductManager()