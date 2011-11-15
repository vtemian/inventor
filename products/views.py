from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotModified
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.utils import simplejson
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from products.forms import ProductForm
from products.models import *

@csrf_exempt
def handler(request):
    
    handlers = {'POST'  : _productCreate,
                'GET'   : _productRead,
                'PUT'   : _productUpdate,
                'DELETE': _productDelete}
        
    return handlers[request.method].__call__(request)

def umHandler(request):

    handlers = {'POST'  : _umCreate,
                'GET'   : _umRead,
                'PUT'   : _umUpdate,
                'DELETE': _umDelete}
    return handlers[request.method].__call__(request)

def categoriesHandler(request):

    handlers = {'POST'  : _categoryCreate,
                'GET'   : _categoryRead,
                'PUT'   : _categoryUpdate,
                'DELETE': _categoryDelete}
    return handlers[request.method].__call__(request)

@csrf_exempt
def _productCreate(request):

    data = []
    try:
        postData = json.loads(request.read())
        if isinstance(postData, dict) and postData.has_key('id'):
            product = Product.objects.create(code=postData.get("id"))
    
    except Exception, err:
        print '[ err ] Exception at productsCreate: \t',
        print err
    
    data = Product.objects.asDict(Product.objects.filter(pk=product.id))['data'][0]
    data['pk'] = data['id']
    data['id'] = postData.get("id")
    return HttpResponse(simplejson.dumps({"success": True, "data": data}), mimetype="application/json")


def _productRead(request):

    direction = {"ASC": '', "DESC": "-"}
    
    start = int(request.GET.get("start"))
    limit = int(request.GET.get("limit"))
    sort  = json.loads(request.GET.get("sort"))
    sort.reverse()
    
    for field in sort:
        objects = Product.objects.all().order_by(direction[field['direction']] + field['property'])
    objects = objects[start:start+limit]
    response = Product.objects.asDict(objects)

    response['success'] = True
    response['total'] = Product.objects.all().count()

    #_initialdata()

    #print json.dumps(response, indent=4)
    return HttpResponse(simplejson.dumps(response))

@csrf_exempt
def _productUpdate(request):

    try:
        product = json.loads(request.read())
        print product
        product = Product.objects.get(pk=product['id'])
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
                form.save()
    except Exception, err:
        print '[ err ] Exception @ _productUpdate: \t',
        print err

#    product = json.loads(request.read())
#    #print kwargs
#
#    try:
#        category = Category.objects.get(pk = product['category'])
#        product['category'] = category
#        um = UM.objects.get(pk = product['um'][0])
#        product.pop('um')
#        product.pop('created')
#        product.pop('updated')
#
#        product = Product(**product)
#
#        product.um.add(um)
#
#        print [f.name for f in Product._meta.fields]
#        print [getattr(product, f.name) for f in Product._meta.fields]
#
#        product.save()
#
#    except Exception, err:
#        print '[ err ] Exception at productsCreate: \t',
#        print err

    #print product

    response = {}
    response['data'] = model_to_dict(product)
    response['success'] = 'true'
    return HttpResponse(simplejson.dumps(response))

def _productDelete(request):
    
    product = json.loads(request.read())
    product = get_object_or_404(Product, pk = product['id']);
    product.delete()
    
    return HttpResponse(simplejson.dumps({'success':'true'}), mimetype='application/json')


def _umCreate(request):
    
    print request.method


def _umRead(request):

    response = UM.objects.asDict()
    response['success'] = True

    #print response
    return HttpResponse(simplejson.dumps(response))

def _umUpdate(request):
    
    pass


def _umDelete(request):
    
    pass

def _categoryCreate(request):

    pass

def _categoryRead(request):

    response = Category.objects.asDict()
    response['success'] = True

    #print json.dumps(response, indent=4)
    return HttpResponse(simplejson.dumps(response))

def _categoryUpdate(request):

    pass


def _categoryDelete(request):

    pass

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



