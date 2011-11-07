from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from products.models import *

def handler(request):

    handlers = {'POST'  : _create,
                'GET'   : _productRead,
                'PUT'   : _update,
                'DELETE': _delete,}
    return handlers[request.method].__call__(request)

def umHandler(request):

    handlers = {'POST'  : _create,
                'GET'   : _umRead,
                'PUT'   : _update,
                'DELETE': _delete,}
    return handlers[request.method].__call__(request)

def _create(request):

    print request.method

def _productRead(request):

    response = Product.objects.asDict()
    response['success'] = True

    #_initialdata()

    #print json.dumps(response, indent=4)
    return HttpResponse(simplejson.dumps(response))

def _umRead(request):

    response = UM.objects.asDict()
    response['success'] = True

    #print response
    return HttpResponse(simplejson.dumps(response))

def _update(request):

    print request.method

def _delete(request):

    print request.method

def _initialdata():
    a = Category.objects.create(name="catunu",
                           description="o categorie")
    aa = Category.objects.create(name="doi",
                           description="a doua categorie")
    m = UM.objects.create(name = 'kilogram',
                        abreviation = 'kg',
                        measures = 'wheight')
    n = UM.objects.create(name = 'gram',
                        abreviation = 'g',
                        measures = 'wheight',
                        conversionFactor = 1000,
                        conversionUnit = UM.objects.get(pk=1))
    b = Product.objects.create(code="ax123",
                           name="bomboane roz",
                           description="11sfqsger111",
                           modified=False,
                           notes='some notes and observations',
                           barCode=1231231231231233,
                           category = Category.objects.get(pk=1))
    c = Product.objects.create(code="db443",
                           name="alt produs important",
                           description="111gqegrq222",
                           modified=True,
                           notes='notes and observations',
                           barCode=1231231231231233,
                           category = Category.objects.get(pk=2))
    b.um.add(m,n)
    c.um.add(n)


@csrf_exempt
def categories_list(request):
    categories_list = ProductCategory.objects.all()
    data = '{"succes" : true, "total": %s, "%s": %s}' % \
           (categories_list.count(), 'data',
            serializers.serialize('json', categories_list))
    return HttpResponse(data, mimetype="application/json")

@csrf_exempt
def products_list(request):

    required = ['start', 'limit']
    for item in required:
        if not request.GET.has_key(item):
            return None

    products_list = Product.objects.select_related('category','properties').all()

    if request.GET.has_key('sort'):
        sort = json.loads(request.GET.get('sort'))
        for s in sort:
            if s['direction'] == 'DESC':
                products_list.order_by('-' + s['property'])
            else:
                products_list.order_by(s['property'])
            break

    start = int(request.GET.get("start"))
    limit = int(request.GET.get("limit"))
    total = products_list.count()
    if start > total:
        return None

    products_list = products_list[start:][:limit]

    data = '{"succes" : true, "total": %s, "%s": %s}' % \
           (products_list.count(), 'data',
            serializers.serialize('json', products_list, relations = ('category','properties')))
    return HttpResponse(data, mimetype="application/json")
