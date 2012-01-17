from django.test import TestCase
from inventor.products.models import Product
import json




class ProductsTest(TestCase):
    
    fixtures = ["data.json"]
    
    def test_create(self):
        
        data = {"code": 1000}
        
        prod = Product.objects.create(**data)
        self.assertEqual(prod.code, 1000)
        self.assertTrue(Product.objects.all().count(), 3)
        Product.objects.get(pk = 3).delete()
        self.assertTrue(Product.objects.all().count(), 2)
    
    
    def test_read_all(self):
        
        prod_1 = Product.objects.get(pk=1)
        prod_2 = Product.objects.get(pk=2)
        
        self.assertEqual(prod_1.name, "bomboane roz")
        self.assertEqual(prod_2.name, "alt produs important")
        
        
    def test_read_sorted(self):
        
        sort  = r'[{"property": "name", "direction": "DESC"}]'
        start = "0"
        limit = "10"
        
        objects = Product.objects.all().order_by('-name')[start:start+limit]
        response = json.loads(self.client.get("/products/?start=" + start + "&limit=" + limit + "&sort=" + str(sort)).content)
        
        data = response.copy()
        data.pop('success')
        data.pop("total")
        
        
        self.assertEqual(response['total'], Product.objects.all().count())
        self.assertEqual(len(response['data']), objects.count()) 
        self.assertDictEqual(Product.objects.asDict(objects), data)
        
        return response
    
    
    def test_read_associated(self):
        
        obj = self.test_read_sorted()
        data = obj['data']
        
        for index in range(len(data)):
            id = data[index]['id']
            product = Product.objects.get(pk=id)
        
            self.assertTrue(product.category.id, data[index]['category']['id'])
            self.assertEqual(product.um.select_related().count(), len(data[index]['um']))
        
        
        
        