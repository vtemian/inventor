from django.conf.urls.defaults import patterns

urlpatterns = patterns('companies',
    (r'^/?$', 'views.handler'),
)