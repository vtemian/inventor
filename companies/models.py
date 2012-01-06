from django.db import models
from inventor.companies.manager import CompanyManager
import reversion

class Company(models.Model):

    name = models.CharField(max_length = 50)
    cif = models.CharField(max_length = 50, unique = True)
    regCom = models.CharField(max_length = 50)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def saveFromJson(self, dict):
        fields = self._meta._fields()
        dict.pop('id')
        dict.pop('updated_at')
        dict.pop('created_at')
        print fields
        print dict

        try:
            for field in fields:
                if field.name in dict:
                    if isinstance(field, models.ForeignKey):
                        #print 'FK: %s '% field.related.parent_model.__name__
                        model = field.related.parent_model
                        try:
                            modelInstance = model.objects.get(pk = dict[field.name])
                            setattr(self, field.name, modelInstance)
                        except Exception: #ObjectDoesNotExist:
                            setattr(self, field.name, None )
                    else:
                        setattr(self, field.name, dict[field.name])
        except Exception, err:
            print '[ err ] Exception Company-saveFromJson: \t',
            print err
            raise

        super(Company, self).save()

    def delete(self, using=None):
        # save last state as a revision
        with reversion.revision:
            self.save()

        with reversion.revision:
            super(Company, self).delete(using)

class AssocData(models.Model):

    class Meta:
        abstract = True

    def saveFromJson(self, dict):
        fields = self._meta._fields()
        dict.pop('id')

        try:
            for field in fields:
                if field.name in dict:
                    if isinstance(field, models.ForeignKey):
                        #print 'FK: %s '% field.related.parent_model.__name__
                        model = field.related.parent_model
                        try:
                            modelInstance = model.objects.get(pk = dict[field.name])
                            setattr(self, field.name, modelInstance)
                        except Exception: #ObjectDoesNotExist:
                            setattr(self, field.name, None )
                    else:
                        setattr(self, field.name, dict[field.name])
        except Exception, err:
            print '[ err ] Exception Company Address-saveFromJson: \t',
            print err
            raise

        super(AssocData, self).save()

class Address(AssocData):
    
    street = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    zip = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="Addresses")

class BankAccount(AssocData):
    
    name = models.CharField(max_length = 50)
    iban = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="BankAccounts")

class Contact(AssocData):

    name = models.CharField(max_length = 50)
    phone = models.CharField(max_length = 50)
    email = models.EmailField()
    company = models.ForeignKey(Company, related_name="Contacts")

if not reversion.is_registered(Company):
    reversion.register(Company)
    reversion.register(Address)
    reversion.register(BankAccount)
    reversion.register(Contact)