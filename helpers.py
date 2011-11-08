from django.db import models


DEFAULT_RECURSION = 2


def dictFromModel(object, depth = DEFAULT_RECURSION):
    if depth <= 0:
        return
    
    _dict = {}
    for field in object._meta.get_all_field_names():
        try:
            value = getattr(object, field)
            if isinstance(value, models.Manager):
                _dict[field] = _getManagerValue(value, object, depth - 1)
            elif isinstance(value, models.Model):
                _dict[field] = dictFromModel(value, depth - 1)
            else:
                _dict[field] = unicode(value)
        except Exception, err:
            pass
    return _dict


def _getManagerValue(field, object, depth):
    if depth <= 0:
        return
    
    instances = ['ManyRelatedManager', "RelatedManager"]
    _list = []
    
    if field.__class__.__name__ not in instances:
        return None
    for obj in field.select_related():
        _dict = {}
        try:
            fieldNames = obj._meta.get_all_field_names()
            fieldNames.remove(object.__class__.__name__.lower())
        except Exception, err:
            pass
        _list.append(dictFromModel(obj))
    return _list
    
    
    
    
    