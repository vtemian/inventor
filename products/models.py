from datetime import datetime
from django.db import models
from inventor.products.manager import ProductManager
import reversion

class Category(models.Model):

    name = models.CharField(max_length = 20)
    description = models.CharField(max_length = 60)

class UM(models.Model):

    name = models.CharField(max_length = 20)
    abbreviation = models.CharField(max_length = 5)
    measures = models.CharField(max_length = 20) #weight, volume, model (Product, InvoiceItem, etc.)
    conversion_factor = models.DecimalField(null=True, max_digits=10, decimal_places=4)
    conversion_unit = models.ForeignKey('self', null=True, related_name='+')

class Product(models.Model):

    code = models.CharField(max_length = 10)
    name = models.CharField(max_length = 50)
    description = models.TextField()
    category = models.ForeignKey(Category, null=True, related_name = 'products')
    um = models.ManyToManyField(UM, related_name = '+')
    bom = models.ForeignKey('Bom', related_name='products', null=True)
    bar_code = models.CharField(max_length = 20)
    price_endetail = models.DecimalField( max_digits=14, decimal_places=4)
    price_engros = models.DecimalField(null=True, max_digits=14, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)


    def delete(self, using=None):
        # save last state as a revision
        with reversion.revision:
            self.save()

        with reversion.revision:
            super(Product, self).delete(using)
            
    def saveFromJson(self, object):
        fields = self._meta.get_all_field_names()
        object.pop('updated_at')
        object.pop('created_at')

        print object

        try:
            category = object.pop('category', None)

            if category:
                if isinstance(category, int):
                    self.category = Category.objects.get(pk = category)
                elif unicode.isalnum(category):
                    self.category, created = Category.objects.get_or_create(name = category)
        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ category: \t',
            print err
            raise
            
        try:
            um = object.pop('um', None)
            self.um.clear()
            for item in um:
                self.um.add(UM.objects.get(pk=item))
        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ um: \t',
            print err
            raise

        #bom
        try:
            bom = object.pop('bom_id', None)
            if bom:
                if isinstance(bom, int):
                    bom = Bom.objects.get(pk = bom)
            elif bom == '':
                bom = Bom.objects.create()
            print bom

            bom.name = object.pop('bom', None)
            bom.scrap_percentage = object.pop('scrap_percentage', None)
            bom.labour_cost = object.pop('labour_cost', None)
            bom.save()
            self.bom = bom

        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ bom: \t',
            print err
            raise

        try:
            for key in object.keys():
                if key in fields:
                    setattr(self, key, object[key])
            self.updated_at = datetime.now()
        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ rest of keys: \t',
            print err
            raise

        super(Product, self).save()

class Bom(models.Model):
    name = models.CharField(max_length=50)
    scrap_percentage = models.DecimalField(null=True,max_digits=5, decimal_places=2)
    labour_cost = models.DecimalField(null=True,max_digits=10, decimal_places=4)

class Ingredient(models.Model):
    bom = models.ForeignKey(Bom, related_name='ingredients')
    ingredient = models.ForeignKey(Product, related_name='ingredient')
    quantity = models.DecimalField(max_digits=10, decimal_places=4)
    um = models.ForeignKey(UM)
    loss = models.DecimalField(max_digits=5, decimal_places=2)
    
if not reversion.is_registered(Product):
    reversion.register(Product)
    reversion.register(UM)