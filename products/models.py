from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
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
            
    def saveFromJson(self, dict):
        fields = self._meta.get_all_field_names()
        dict.pop('id')
        dict.pop('updated_at')
        dict.pop('created_at')

        try:
            category = dict.pop('category', None)

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
            um = dict.pop('um', None)
            self.um.clear()
            for item in um:
                self.um.add(UM.objects.get(pk=item))
        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ um: \t',
            print err
            raise

        #bom
        try:
            bomId = dict.pop('bom_id', None)
            bomName = dict.pop('bom', None)
            bomScrap_percentage = dict.pop('scrap_percentage', None)
            bomLabour_cost = dict.pop('labour_cost', None)
            if isinstance(bomId, int):
                #update
                bom = Bom.objects.get(pk = bomId)
                bom.name =  bomName
                bom.scrap_percentage = bomScrap_percentage
                bom.labour_cost = bomLabour_cost
                bom.save()
                print bom.__dict__
                self.bom = bom
            elif bomName != '' or bomScrap_percentage != 0 or bomLabour_cost != 0:
                #create
                bom = Bom.objects.create(name = bomName, scrap_percentage = bomScrap_percentage, labour_cost = bomLabour_cost)
                print bom.__dict__
                self.bom = bom


        except Exception, err:
            print '[ err ] Exception Product-saveFromJson @ bom: \t',
            print err
            raise

        try:
            for key in dict.keys():
                if key in fields:
                    setattr(self, key, dict[key])
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
    quantity = models.DecimalField(max_digits=10, null=True, decimal_places=4)
    um = models.ForeignKey(UM,  null=True)
    loss = models.DecimalField(max_digits=5, null=True, decimal_places=2)

    def saveFromJson(self, dict):
        fields = self._meta._fields()
        dict.pop('id')

        try:
            for field in fields:
                if field.name in dict:
                    if isinstance(field, models.ForeignKey):
                        #print 'FK: %s '% field.related.parent_model.__name__
                        model = field.related.parent_model
                        try:
                            modelInstance = model.objects.get(pk = dict[field.name])
                            setattr(self, field.name, modelInstance)
                        except Exception:
                            if model.__name__ == 'Bom':
                                modelInstance = model.objects.create()
                                setattr(self, field.name, modelInstance)
                            else:
                                setattr(self, field.name, None )
                        
                    else:
                        setattr(self, field.name, dict[field.name])
        except Exception, err:
            print '[ err ] Exception Ingredient-saveFromJson @ rest of keys: \t',
            print err
            raise

        super(Ingredient, self).save()

    
if not reversion.is_registered(Product):
    reversion.register(Product)
    reversion.register(UM)