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
@csrf_exempt
def ingredientHandler(request):

    handlers = {'POST'  : _ingredientCreate,
                'GET'   : _ingredientRead,
                'PUT'   : _ingredientUpdate,
                'DELETE': _ingredientDelete}
    return handlers[request.method].__call__(request)

def categoriesHandler(request):

    handlers = {'POST'  : _categoryCreate,
                'GET'   : _categoryRead,
                'PUT'   : _categoryUpdate,
                'DELETE': _categoryDelete}
    return handlers[request.method].__call__(request)

@csrf_exempt
def _productCreate(request):

    response = {}
    try:
        postData = json.loads(request.read())
        #postData.pop('id')
        product = Product.objects.create()
        product.saveFromJson(postData)

        product = Product.objects.filter(pk=product.pk)

        response = serializers.serialize('json4ext', product, relations={'bom':{'relations':('ingredients',)}} )

    
    except Exception, err:
        print '[ err ] Exception at productsCreate: \t',
        print err
        
        response['data'] = []
        response['msg'] =  '%s' % err
        response['success'] = False
        response = simplejson.dumps(response, use_decimal=True)


    return HttpResponse(response, mimetype="application/json")


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

    product = Product.objects.filter(pk=product.pk)
    return HttpResponse(serializers.serialize('json4ext', product, relations={'bom':{'relations':('ingredients',)}} ), mimetype="application/json")

def _productDelete(request):

    response = {}
    response['data'] = []
    product = json.loads(request.read())
    try:
        product = Product.objects.get(pk = product['id']);
        product.delete()
        response['success'] = True
    except ObjectDoesNotExist:
        response['msg'] =  'Product not found'
        response['success'] = False

    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

def productsList(request):

    return HttpResponse(serializers.serialize('json4ext', Product.objects.all(), fields={'id','name', 'um'}, relations=('um',)), mimetype='application/json')



@csrf_exempt
def _ingredientCreate(request):

    response = {}
    try:
        postData = json.loads(request.read())
        ingredient = Ingredient()
        ingredient.saveFromJson(postData)

        ingredient = Ingredient.objects.filter(pk = ingredient.pk)
        response = serializers.serialize('json4ext',ingredient)

    except Exception, err:
        print '[ err ] Exception at ingredientCreate: \t',
        print err.message

        response['data'] = []
        response['msg'] =  '%s ' % err
        response['success'] = False
        response = simplejson.dumps(response, use_decimal=True)
        
    return HttpResponse(response, mimetype="application/json")

def _ingredientRead(request):
    pass

@csrf_exempt
def _ingredientUpdate(request):

    ingred = json.loads(request.read())
    ingredient = Ingredient.objects.get(pk = ingred['id'])
    ingredient.saveFromJson(ingred)

    ingredient = Ingredient.objects.filter(pk = ingredient.pk)
    return HttpResponse(serializers.serialize('json4ext', ingredient), mimetype='application/json')

def _ingredientDelete(request):

    response = {}
    response['data'] = []
    ingredient = json.loads(request.read())
    try:
        ingredient = Ingredient.objects.get(pk=ingredient['id'])
        ingredient.delete()
        response['success'] = True
    except Exception, err:
        print err.message
        response['msg'] =  'Ingredient not found'
        response['success'] = False

    return HttpResponse(simplejson.dumps(response), mimetype='application/json')


def _umCreate(request):
    
    print request.method


def _umRead(request):

    response = serializers.serialize('json4ext', UM.objects.all())
    return HttpResponse(response)

def _umUpdate(request):
    pass


def _umDelete(request):
    pass

def _categoryCreate(request):
    pass

def _categoryRead(request):

    response = serializers.serialize('json4ext', Category.objects.all())
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
                        abbreviation = 'kg')
    n = UM.objects.create(name = 'gram',
                        abbreviation = 'g')

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
                           um= UM.objects.get(pk=1),
                           category = Category.objects.get(pk=1),
                           bom = Bom.objects.get(pk=1),
                           price_endetail = 1.5,
                           price_engros = 1)
    c = Product.objects.create(code="db443",
                           name="alt produs important",
                           description="111gqegrq222",
                           bar_code=1231231231231233,
                           um= UM.objects.get(pk=2),
                           category = Category.objects.get(pk=2),
                           bom = Bom.objects.get(pk=1),
                           price_endetail = 2.5,
                           price_engros = 1.8)
    d = Product.objects.create(code="db443",
                           name="alt produs important",
                           description="111gqegrq222",
                           bar_code=1231231231231233,
                           um= UM.objects.get(pk=1),
                           category = Category.objects.get(pk=2),
                           bom = Bom.objects.get(pk=3),
                           price_endetail = 1.9,
                           price_engros = 1.2)

    bomd1 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=b,
                    quantity = 3.5,
                    um = m)
    bomd2 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=c,
                    quantity = 5,
                    um = n)
    bomd3 = Ingredient.objects.create(
                    bom = bom1,
                    ingredient=d,
                    quantity = 50,
                    um = n)
    bomd4 = Ingredient.objects.create(
                    bom = bom2,
                    ingredient=b,
                    quantity = 11,
                    um = n)
    bomd5 = Ingredient.objects.create(
                    bom = bom2,
                    ingredient=c,
                    quantity = 15,
                    um = n)
    bomd3 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=d,
                    quantity = 50,
                    um = n)
    bomd4 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=b,
                    quantity = 11,
                    um = n)
    bomd5 = Ingredient.objects.create(
                    bom = bom3,
                    ingredient=c,
                    quantity = 15,
                    um = n)



