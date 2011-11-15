from django.forms.models import ModelForm
from products.models import Product

class ProductForm(ModelForm):
    class Meta:
        model = Product

  