"""
Serialize data to/from JSON
"""
from django.utils import simplejson
from python import Serializer as PythonSerializer
from django.core.serializers.json import Deserializer as JSONDeserializer, \
    DjangoJSONEncoder
class Serializer(PythonSerializer):
    """
    Convert a queryset to JSON.
    in parent class python.py line 54 changed this
        self.objects.append({
            "model"  : smart_unicode(obj._meta),
            "pk"     : smart_unicode(obj._get_pk_val(), strings_only=True),
            "fields" : self._fields
        })
    to this:
        self.objects.append(self._fields)
    !!!
    overriding   def end_object(self, obj) in json4ext.py was NOT called by the recursion
    """

    def end_serialization(self):
        """Output a JSON encoded queryset."""
        extjson = {'data': self.objects, 'success': True}
        simplejson.dump(extjson, self.stream, cls=DjangoJSONEncoder,
            **self.options)

    def getvalue(self):
        """
        Return the fully serialized queryset (or None if the output stream
        is not seekable).
        """

        if callable(getattr(self.stream, 'getvalue', None)):
            return self.stream.getvalue()

Deserializer = JSONDeserializer
