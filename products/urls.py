from django.conf.urls.defaults import patterns

urlpatterns = patterns('products',
    (r'^/?$', 'views.products_list'),
)
  