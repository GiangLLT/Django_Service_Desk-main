"""
Django settings for my_project project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import os
from django.urls import reverse_lazy
from datetime import timedelta


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-vg&dj1k=gg4gjv3))wwfai6uvqxblhqkw&5ap8#=3_++c%mjj4'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [   
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',

    'web_api',
    'Admin',
    'barcode',
    'POS',

    'rest_framework', #API
    'rest_framework_swagger',  # Thêm vào danh sách ứng dụng
    'drf_yasg',
    'rest_framework_simplejwt', #JWT

    'oauth2_provider', #authen office 365
    'corsheaders',
    'sslserver',

    'django.contrib.sites',
]

#JWT export token API
JWT_AUTH = {
    'JWT_SECRET_KEY': 'django-insecure-vg&dj1k=gg4gjv3))wwfai6uvqxblhqkw&5ap8#=3_++c%mjj4',
    # 'JWT_SECRET_KEY': 'http://localhost:8000/api?username=Giang@1622',
    'JWT_ALGORITHM': 'HS256',
    'JWT_ALLOW_REFRESH': True,
    # 'JWT_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_EXPIRATION_DELTA': timedelta(minutes=30),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=30),
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
    ),
    'DEFAULT_SCHEMA_CLASS': ('rest_framework.schemas.coreapi.AutoSchema'),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ], #JWT
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'oauth2_provider.middleware.OAuth2TokenMiddleware', #authen office 365
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'my_project.urls'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8000',
    'https://localhost:44386',
    'http://xxx.xxx.xxx.xxx:portNum',
]
CORS_ALLOW_HEADERS = [
  'accept',
  'accept-encoding',
  'authorization',
  'content-type',
  'origin',
  'dnt',
  'user-agent',
  'x-csrftoken',
  'x-requested-with']
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ORIGIN_WHITELIST = [
    'https://login.microsoftonline.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://localhost:8000',
    'https://127.0.0.1:8000',
    'https://localhost:44386',
    'https://192.168.16.34:8000/',
    'https://192.168.16.30:8000/',
    'https://192.168.16.32:8000/',

]
ALLOWED_HOSTS = [
    'https://login.microsoftonline.com',
    'http://localhost:8000',
    'localhost',
    'https://localhost:44386',
    'http://127.0.0.1:8000',
    '127.0.0.1',
    '192.168.16.34',
    '192.168.16.30',
    '192.168.16.32',
    'https://192.168.16.34:8000/',
    'https://192.168.16.30:8000/'
    'https://192.168.16.32:8000/'
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


#authen office 365
OAUTH2_PROVIDER_APPLICATION_NAME = 'WebPortal_Authen'
OAUTH2_PROVIDER_CLIENT_ID = '5c17ff26-50a1-4003-bc31-f0545709c2f7'
# OAUTH2_PROVIDER_CLIENT_SECRET = 'EeJ8Q~ip-6TA~p1C7Y9t24l81qig0lFv1t5CPdwO'
OAUTH2_PROVIDER_CLIENT_SECRET = 'lDs8Q~-HtjOcJn1fu6PZJoXSMLNhuD1QPIB0Hazp'
OAUTH2_PROVIDER_REDIRECT_URI = 'https://localhost:8000/danh-sach-test/'


MICROSOFT_CLIENT_ID = '5c17ff26-50a1-4003-bc31-f0545709c2f7'
# MICROSOFT_CLIENT_SECRET = 'EeJ8Q~ip-6TA~p1C7Y9t24l81qig0lFv1t5CPdwO'
MICROSOFT_CLIENT_SECRET = 'lDs8Q~-HtjOcJn1fu6PZJoXSMLNhuD1QPIB0Hazp'

AUTHENTICATION_BACKENDS = [
    'microsoft_auth.backends.MicrosoftAuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

OAUTH2_PROVIDER = {
    'ACCESS_TOKEN_EXPIRE_SECONDS': 60 * 60 * 24, # Token hết hạn sau 1 ngày
    'SCOPES': {'read': 'Read scope', 'write': 'Write scope', 'groups': 'Access to your groups'},
}


#authen Google API
GOOGLE_OAUTH2_CLIENT_ID = '76045418295-6f2usr0sr610lm51rvph28uutjmilm6s.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET = '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'
GOOGLE_OAUTH2_REDIRECT_URI = 'https://localhost:8000/login/callback/'


SOCIAL_AUTH_FACEBOOK_KEY = '899604034596998'
SOCIAL_AUTH_FACEBOOK_SECRET = '<your-app-secret>'


WSGI_APPLICATION = 'my_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

#MýQL
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

#SQL server
# DATABASES = {
#     "default": {
#         "ENGINE": "mssql",
#         "NAME": "Python_Test",
#         "USER": "sa",
#         "PASSWORD": "Abc@123",
#         "HOST": "localhost\SQLEXPRESS",
#         # "PORT": "1433",
#         "OPTIONS": {"driver": "ODBC Driver 17 for SQL Server", 
#         },
#     },
# }

DATABASES = {
    "default": {
        "ENGINE": "mssql",
        "NAME": "BCG_HelDesk",
        "USER": "sa",
        "PASSWORD": "Abc@123",
        "HOST": "localhost\SQLEXPRESS",
        # "PORT": "1433",
        "OPTIONS": {"driver": "ODBC Driver 17 for SQL Server", 
        },
    },
}



# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

MEDIA_ROOT = os.path.join(BASE_DIR, 'static/detect_image/')
MEDIA_URL = '/media/'

STATIC_URL = '/static/'
if not DEBUG:
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# LOGIN_REDIRECT_URL = reverse_lazy('Home')

#AUTOMATION MAIL 365
# MICROSOFT_CLIENT_ID_EMAIL = '5c17ff26-50a1-4003-bc31-f0545709c2f7'
# MICROSOFT_CLIENT_SECRET_EMAIL = 'EeJ8Q~ip-6TA~p1C7Y9t24l81qig0lFv1t5CPdwO'
# MICROSOFT_TENANT_ID_EMAIL = 'c43d3f81-f57a-48cc-8b07-74b39935d876'
# MICROSOFT_EMAIL = 'giang.llt@bamboocap.com.vn'

MICROSOFT_CLIENT_ID_EMAIL = '7c30d987-4ce4-4e5e-9f95-003962116f0a'
MICROSOFT_CLIENT_SECRET_EMAIL = 'ySx8Q~Y.q6ZlzM1WmwEijRWdvE2UnJFOD81tLbYy'
MICROSOFT_TENANT_ID_EMAIL = 'c43d3f81-f57a-48cc-8b07-74b39935d876'
MICROSOFT_EMAIL = 'noreply-hrm@bamboocap.com.vn'

#SEND MAIL
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply-hrm@bamboocap.com.vn'
EMAIL_HOST_PASSWORD = 'TinhVan123!'
# EMAIL_HOST_USER = 'GIANG.LLT@BAMBOOCAP.COM.VN'
# EMAIL_HOST_PASSWORD = 'Gllt@1622'


#GITHUB TOKEN
GITHUB_TOKEN = "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"
GITHUB_USERNAME = "GiangLLT"
GITHUB_REPO_NAME = "Django_Service_Desk-main"

GITHUB_CLIENT_ID ="7eaf033474b53b7aafa1"
GITHUB_CLIENT_SECRECT ="8d51d345a7bf149358ff45c91024f699da785f37"
GITHUB_REDIRECT_URL ="https://localhost:8000/callback-github"


