from django.db import models


def dictFromModel(object):
    
    
    _dict = {}
    for field in object._meta.get_all_field_names():
        try:
            value = getattr(object, field)
            if isinstance(value, models.Manager):
                if value.__class__.__name__ == 'ManyRelatedManager':
                    _dict[field] = []
                    for obj in value.select_related():
                        _tempDict = {}
                        for f in obj._meta.get_all_field_names():
                            val = getattr(obj, f)
                            if not isinstance(val, models.Manager):
                                _tempDict[f] = unicode(val)
                        _dict[field].append(_tempDict)
            elif isinstance(value, models.Model):
                _dict[field] = dictFromModel(value)
            else:
                _dict[field] = unicode(value)
        except Exception, err:
            print err
    return _dict
