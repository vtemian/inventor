from django.conf.urls.defaults import patterns

urlpatterns = patterns('products',
    (r'^/?$', 'views.handler'),
    #(r'^(?P<product_id>\d+)/?$', 'views.handler'),
)