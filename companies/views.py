from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from companies.models import *
from inventor.helpers import dictFromModel


@csrf_exempt
def handler(request):
    
    handlers = {'POST'  : _companyCreate,
                'GET'   : _companyRead,
                'PUT'   : _companyUpdate,
                'DELETE': _companyDelete,}
    return handlers[request.method].__call__(request)
@csrf_exempt
def addressesHandler(request):

    handlers = {'POST'  : _addressCreate,
                'GET'   : _addressRead,
                'PUT'   : _addressUpdate,
                'DELETE': _addressDelete,}
    return handlers[request.method].__call__(request)
@csrf_exempt
def banksHandler(request):

    handlers = {'POST'  : _bankCreate,
                'GET'   : _bankRead,
                'PUT'   : _bankUpdate,
                'DELETE': _bankDelete,}
    return handlers[request.method].__call__(request)
@csrf_exempt
def contactsHandler(request):

    handlers = {'POST'  : _contactCreate,
                'GET'   : _contactRead,
                'PUT'   : _contactUpdate,
                'DELETE': _contactDelete,}
    return handlers[request.method].__call__(request)


@csrf_exempt
def _companyCreate(request):

    response = {}
    try:
        postData = json.loads(request.read())
        company = Company.objects.create()
        company.saveFromJson(postData)

        company = Company.objects.filter(pk=company.pk)

        response = serializers.serialize('json4ext', company, relations={'Addresses','Contacts', 'Banks'} )


    except Exception, err:
        print '[ err ] Exception at companyCreate: \t',
        print err

        response['data'] = []
        response['msg'] =  '%s' % err
        response['success'] = False
        response = simplejson.dumps(response, use_decimal=True)


    return HttpResponse(response, mimetype="application/json")

def _companyRead(request):

    direction = {"ASC": '', "DESC": "-"}
    start = int(request.GET.get("start"))
    limit = int(request.GET.get("limit"))
    sort  = json.loads(request.GET.get("sort"))
    sort.reverse()

    for field in sort:
        companies = Company.objects.all().order_by(direction[field['direction']] + field['property'])
    total = companies.count()
    companies = companies[start:start+limit]

    response = serializers.serialize('json4ext', companies, relations={'Addresses','Contacts', 'Banks'} )
    response = response[:len(response)-1] + ',"total":%s}' % total

    #_initialdata()

    return HttpResponse(response, mimetype="application/json")
@csrf_exempt
def _companyUpdate(request):
    try:
        comp = json.loads(request.read())
        company = Company.objects.get(pk=comp['id'])
        company.saveFromJson(comp)

    except Exception, err:
        print '[ err ] Exception @ _companyUpdate: \t',
        print err

    company = Company.objects.filter(pk=company.pk)
    return HttpResponse(serializers.serialize('json4ext', company, relations={'Addresses','Contacts', 'Banks'} ), mimetype="application/json")

def _companyDelete(request):

    response = {}
    response['data'] = []
    company = json.loads(request.read())
    try:
        company = Company.objects.get(pk = company['id']);
        company.delete()
        response['success'] = True
    except ObjectDoesNotExist:
        response['msg'] =  'Company not found!'
        response['success'] = False

    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

@csrf_exempt
def _addressCreate(request):
    response = {}
    try:
        postData = json.loads(request.read())
        address = Address.objects.create()
        address.saveFromJson(postData)

        address = Address.objects.filter(pk=address.pk)

        response = serializers.serialize('json4ext', address)


    except Exception, err:
        print '[ err ] Exception at addressCreate: \t',
        print err

        response['data'] = []
        response['msg'] =  '%s' % err
        response['success'] = False
        response = simplejson.dumps(response, use_decimal=True)


    return HttpResponse(response, mimetype="application/json")

def _addressRead(request):
    pass
@csrf_exempt
def _addressUpdate(request):
    pass
def _addressDelete(request):

    response = {}
    response['data'] = []
    address = json.loads(request.read())
    try:
        address = Address.objects.get(pk=address['id'])
        address.delete()
        response['success'] = True
    except Exception, err:
        print err.message
        response['msg'] =  'Address not found'
        response['success'] = False

    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

@csrf_exempt
def _bankCreate(request):
    pass
def _bankRead(request):
    pass
@csrf_exempt
def _bankUpdate(request):
    pass
def _bankDelete(request):
    pass

@csrf_exempt
def _contactCreate(request):
    pass
def _contactRead(request):
    pass
@csrf_exempt
def _contactUpdate(request):
    pass
def _contactDelete(request):
    pass


def _initialdata():
    a = Company.objects.create(name="1st Company",
                           vat="11111221",
                           regCom="54321")
    aa = Company.objects.create(name="2nd Company",
                           vat="3333",
                           regCom="54321")
    b = Address.objects.create(street="str LuGogu, nr 99, ap 4",
                           city="Timisoara, Timis",
                           zipcode="999999",
                           company = Company.objects.get(pk=1))
    bb = Address.objects.create(street="str LuGogu, nr 99, ap 4",
                           city="Timisoara, Timis",
                           zipcode="999999",
                           company = Company.objects.get(pk=2))
    bbb = Address.objects.create(street="str LuGogu, nr 99, ap 4",
                           city="Timisoara, Timis",
                           zipcode="999999",
                           company = Company.objects.get(pk=2))
    c = Contact.objects.create(name="Gogu",
                               phoneNumber="0988888",
                               email="gogu@gmail.com",
                               company=Company.objects.get(pk=1))
    cc = Contact.objects.create(name="Gogu",
                               phoneNumber="0988888",
                               email="gogu@gmail.com",
                               company=Company.objects.get(pk=2))
    d = BankAccount.objects.create(name="BNR",
                                       iban="iii33434",
                                       company=Company.objects.get(pk=1))
    dd = BankAccount.objects.create(name="BNR",
                                       iban="iii33434",
                                       company=Company.objects.get(pk=2))
    ddd = BankAccount.objects.create(name="BNR",
                                       iban="iii33434",
                                       company=Company.objects.get(pk=2))