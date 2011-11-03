from django.db import models
from inventor.helpers import dictFromModel

class CompanyManager(models.Manager):
    
    def asDict(self, objects=None):
        if objects == None:
            products = self.all()
        else:
            products = objects
        _list = []
        for product in products:
            _list.append(dictFromModel(product))
        
        return {'data': _list}