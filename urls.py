from django.conf.urls.defaults import *
import settings
 


urlpatterns = patterns('',
    (r'^$', 'django.views.generic.simple.direct_to_template', {'template': 'index.html'}),
    (r'^companies/', include('companies.urls')),
    (r'^addresses/', 'companies.views.addressesHandler'),
    (r'^banks/', 'companies.views.banksHandler'),
    (r'^contacts/', 'companies.views.contactsHandler'),
    (r'^products/', include('products.urls')),
    (r'^ingredients/', 'products.views.ingredientHandler'),
    (r'^categories/', 'products.views.categoriesHandler'),
    (r'^ums/', 'products.views.umHandler')
)
if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_URL,
        }),
)