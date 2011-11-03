import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    #('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.mysql',
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'inventordb',
        'USER': '',#'root',
        'PASSWORD': '',#'c0c0nuts',
        'HOST': '',
        'PORT': '',
    }
}

TIME_ZONE = 'Europe/Bucharest'


LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = True
USE_L10N = True

STATIC_FILE_PATH = os.path.join(os.getcwd(), "static")

MEDIA_ROOT = STATIC_FILE_PATH
MEDIA_URL = ''
STATIC_ROOT = ''
STATIC_URL = STATIC_FILE_PATH

ADMIN_MEDIA_PREFIX = '/static/admin/'

STATICFILES_DIRS = (

)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = '1yiep)022_2-l(bg*=#!*##w8=gv)fex1+sxdk_24e4if(cab+'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
    'reversion.middleware.RevisionMiddleware',
)

ROOT_URLCONF = 'inventor.urls'

#TEMPLATE_DIRS = ('C:/Python27/Scripts/inventor/templates',)
TEMPLATE_DIRS = (os.path.join(os.getcwd(), "templates"),)

INSTALLED_APPS = (
    #'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'reversion',
    'inventor.products',
    'inventor.company',
    'wadofstuff',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
SERIALIZATION_MODULES = {
    'json': 'wadofstuff.django.serializers.json'
}