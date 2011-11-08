from django.http import HttpResponse, HttpResponseNotModified
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.utils import simplejson
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
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
                'DELETE': _umDelete,}
    return handlers[request.method].__call__(request)

@csrf_exempt
def _productCreate(request):

    data = []
    try:
        postData = json.loads(request.read())
        if isinstance(postData, dict) and postData.has_key('id') and postData.get('id') > 0:
            print postData
            print postData.get('id')
            product = Product.objects.create(
                #dumy code generation
                code=postData.get('id')
            )

            data = {'id': postData.get('id'), 'pk': product.pk, 'name':'', 'code':postData.get('id'), \
                    'description':'', 'category':'', 'modified':'false', 'notes':'', 'barcode':'', 'um':'' }

        
    except Exception, err:
        print '[ err ] Exception at productsCreate: \t',
        print err

    response = simplejson.dumps({"success": True, "data":data})
    return HttpResponse(response, mimetype="application/json")


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


def _productUpdate(request, product_id):

    pass


def _productDelete(request):
    
    id = json.loads(request.read())
    product = get_object_or_404(Product, pk = id['id']);
    product.delete()
    
    return HttpResponse({'success':'true'}, mimetype='application/json')


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
