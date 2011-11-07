from django.db import models
from inventor.helpers import dictFromModel

class CompanyManager(models.Manager):
    
    def asDict(self, objects=None):
        if objects == None:
            companies = self.all()
        else:
            companies = objects
        _list = []
        for company in companies:
            _list.append(dictFromModel(company))
        
        return {'data': _list}