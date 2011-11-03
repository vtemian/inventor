from django.db import models


def dictFromModel(object):
    
    
    _dict = {}
    for field in object._meta.get_all_field_names():
        try:
            value = getattr(object, field)
            if isinstance(value, models.Manager):
                instances = ['ManyRelatedManager', "RelatedManager"]
                if value.__class__.__name__ in instances:
                    _dict[field] = []
                    for obj in value.select_related():
                        _tempDict = {}
                        try: 
                            modelsList = obj._meta.get_all_field_names()
                            modelsList.remove(object.__class__.__name__.lower())
                        except:
                            pass
                        for f in modelsList:
                            _tempDict[f] = unicode(getattr(obj, f))
                        _dict[field].append(_tempDict)
            elif isinstance(value, models.Model):
                _dict[field] = dictFromModel(value)
            else:
                _dict[field] = unicode(value)
        except Exception, err:
            print err
    return _dict
