import copy
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
from decimal import Decimal
from StringIO import StringIO

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

def bomHandler(request):

    handlers = {'POST'  : _bomCreate,
                'GET'   : _bomRead,
                'PUT'   : _bomUpdate,
                'DELETE': _bomDelete}
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
    response = {}
    try:
        postData = json.loads(request.read())
        extjsid = postData.pop('id')
        product = Product.objects.create()
        product.saveFromJson(postData)

        response['data'] = model_to_dict(product)
        response['data']['pk'] = product.pk #switch real database pk with ext generated id so the record is matched by ext
        response['data']['id'] = extjsid
        response['success'] = 'true'
    
    except Exception, err:
        print '[ err ] Exception at productsCreate: \t',
        print err.message

        response['data'] = []
        response['msg'] =  '%s ' % err
        response['success'] = 'false'

    return HttpResponse(simplejson.dumps(response, use_decimal=True), mimetype="application/json")


def _productRead(request):
    
    direction = {"ASC": '', "DESC": "-"}
    start = int(request.GET.get("start"))
    limit = int(request.GET.get("limit"))
    sort  = json.loads(request.GET.get("sort"))
    sort.reverse()
    
    for field in sort:
        products = Product.objects.all().order_by(direction[field['direction']] + field['property'])
    total = products.count()
    products = products[start:start+limit]
    
    response = serializers.serialize('json4ext', products, relations={'bom':{'relations':('ingredients',)}} )
    response = response[:len(response)-1] + ',"total":%s}' % total

    #_initialdata()

    return HttpResponse(response, mimetype="application/json")


@csrf_exempt
def _productUpdate(request):
    try:
        prod = json.loads(request.read())
        product = Product.objects.get(pk=prod['id'])
        product.saveFromJson(prod)
        
    except Exception, err:
        print '[ err ] Exception @ _productUpdate: \t',
        print err
 
    response = {}
    response['data'] = model_to_dict(product)
    response['success'] = 'true'
    return HttpResponse(simplejson.dumps(response, use_decimal=True))

def _productDelete(request):
    
    product = json.loads(request.read())
    product = get_object_or_404(Product, pk = product['id']);
    product.delete()
    
    return HttpResponse(simplejson.dumps({'success':'true'}), mimetype='application/json')

def _bomCreate(request):
    pass

def _bomRead(request):

    product = Product.objects.get(pk=6)
    bom = Bom.objects.filter(product = product)
    response = serializers.serialize('json4ext', bom)

    #print json.dumps(response, indent=4)
    return HttpResponse(response, mimetype="application/json")

    pass
def _bomUpdate(request):
    pass
def _bomDelete(request):
    pass


def _umCreate(request):
    
    print request.method


def _umRead(request):

    response = serializers.serialize('json4ext', UM.objects.all())

    #print response
    return HttpResponse(response)

def _umUpdate(request):
    
    pass


def _umDelete(request):
    
    pass

def _categoryCreate(request):

    pass

def _categoryRead(request):

    response = serializers.serialize('json4ext', Category.objects.all())

    #print json.dumps(response, indent=4)
    return HttpResponse(response)

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
                        abbreviation = 'kg',
                        measures = 'wheight')
    n = UM.objects.create(name = 'gram',
                        abbreviation = 'g',
                        measures = 'wheight',
                        conversion_factor = 1000,
                        conversion_unit = UM.objects.get(pk=1))

    bom1 = Bom.objects.create(name='bom unu',
                    scrap_percentage = 10,
                    labour_cost = 5)
    bom2 = Bom.objects.create(name='bom doi',
                    scrap_percentage = 1,
                    labour_cost = 15)
    bom3 = Bom.objects.create(name='bom trei',
                    scrap_percentage = 1,
                    labour_cost = 15)

    b = Product.objects.create(code="ax123",
                           name="bomboane roz",
                           description="11sfqsger111",
                           bar_code=1231231231231233,
                           category = Category.objects.get(pk=1),
                           bom = Bom.objects.get(pk=1),
                           price_endetail = 1.5,
                           price_engros = 1)
    c = Product.objects.create(code="db443",
                           name="alt produs important",
                           description="111gqegrq222",
                           bar_code=1231231231231233,
                           category = Category.objects.get(pk=2),
                           bom = Bom.objects.get(pk=1),
                           price_endetail = 2.5,
                           price_engros = 1.8)
    d = Product.objects.create(code="db443",
                           name="alt produs important",
                           description="111gqegrq222",
                           bar_code=1231231231231233,
                           category = Category.objects.get(pk=2),
                           bom = Bom.objects.get(pk=3),
                           price_endetail = 1.9,
                           price_engros = 1.2)
    b.um.add(m,n)
    c.um.add(n)
    d.um.add(m)

    bomd1 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=b,
                    quantity = 3.5,
                    um = m,
                    loss = 10)
    bomd2 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=c,
                    quantity = 5,
                    um = n,
                    loss = 5)
    bomd3 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=d,
                    quantity = 50,
                    um = n,
                    loss = 5)
    bomd4 = Ingredient.objects.create(
                    bom = bom2,
                    ingredient=b,
                    quantity = 11,
                    um = n,
                    loss = 5)
    bomd5 = Ingredient.objects.create(
                    bom = bom2,
                    ingredient=c,
                    quantity = 15,
                    um = n,
                    loss = 5)
    bomd3 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=d,
                    quantity = 50,
                    um = n,
                    loss = 5)
    bomd4 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=b,
                    quantity = 11,
                    um = n,
                    loss = 5)
    bomd5 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=c,
                    quantity = 15,
                    um = n,
                    loss = 5)



