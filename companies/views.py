from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
import json
from django.views.decorators.csrf import csrf_exempt
from companies.models import *
from inventor.helpers import dictFromModel



def handler(request):
    
    handlers = {'POST'  : _create,
                'GET'   : _read,
                'PUT'   : _update,
                'DELETE': _delete,}
    return handlers[request.method].__call__(request)

def _read(request):
    
    response = Company.objects.asDict()
    response['success'] = True

    #_initialdata()
    
    
    #print json.dumps(response, indent=4)
    return HttpResponse(simplejson.dumps(response))
    

def _create(request):
    
    print request.method


def _delete(request):
    
    print request.method


def _update(request):
    
    print request.method

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