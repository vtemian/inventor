from django.conf.urls.defaults import *
import settings
 


urlpatterns = patterns('',
    (r'^$', 'django.views.generic.simple.direct_to_template', {'template': 'index.html'}),
    (r'^companies/', include('companies.urls')),
    (r'^products/', include('products.urls')),
    (r'^categories/', 'products.views.categories_list'),
    (r'^ums/', 'products.views.umHandler')
)
if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_URL,
        }),
)