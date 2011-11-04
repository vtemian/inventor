from django.db import models
from inventor.products.manager import ProductManager
import reversion

class ProductCategory(models.Model):
    name = models.CharField(max_length = 20)
    description = models.CharField(max_length = 60)
    status = models.CharField(max_length = 60)

class ProductProperties(models.Model):
    name = models.CharField(max_length = 10)

class Product(models.Model):

    code = models.CharField(max_length = 10)
    name = models.CharField(max_length = 50)
    description = models.TextField()
    category = models.ForeignKey(ProductCategory, related_name='ProductsCategory')
    notes = models.TextField()
    barCode = models.CharField(max_length = 13)
    modified = models.BooleanField()
    active = models.BooleanField()
    properties =  models.ManyToManyField(ProductProperties, related_name='ProductProperties')
