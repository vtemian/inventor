from django.db import models
from inventor.companies.manager import CompanyManager
import reversion

class Company(models.Model):

    name = models.CharField(max_length = 50)
    vat = models.CharField(max_length = 50, unique = True)
    regCom = models.CharField(max_length = 50)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def saveFromJson(self, dict):
        fields = self._meta._fields()
        dict.pop('id')
        dict.pop('updated_at')
        dict.pop('created_at')

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

class Address(models.Model):
    
    street = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    zipcode = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="Addresses")
    
class Contact(models.Model):
    
    name = models.CharField(max_length = 50)
    phoneNumber = models.CharField(max_length = 50)
    email = models.EmailField()
    company = models.ForeignKey(Company, related_name="Contacts")
    

class BankAccount(models.Model):
    
    name = models.CharField(max_length = 50)
    iban = models.CharField(max_length = 50)
    company = models.ForeignKey(Company, related_name="Banks")


if not reversion.is_registered(Company):
    reversion.register(Company)
    reversion.register(Address)
    reversion.register(BankAccount)
    reversion.register(Contact)