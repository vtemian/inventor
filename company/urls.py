from django.conf.urls.defaults import patterns

urlpatterns = patterns('company',
    (r'^/?$', 'views.handler'),
)
  