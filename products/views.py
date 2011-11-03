from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from products.models import *

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

    products_list = Products.objects.select_related('category','properties').all()

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

def index(request):

    return render_to_response(
        'index.html',
        {
        },
        context_instance=RequestContext(request)
    )