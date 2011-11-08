from django.conf.urls.defaults import patterns

urlpatterns = patterns('products',
    (r'^(?P<product_id>\d+)/?$', 'views.handler'),
)