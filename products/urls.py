from django.conf.urls.defaults import patterns

urlpatterns = patterns('products',
    (r'^/?$', 'views.handler'),
    (r'^list/?$', 'views.productsList')
)