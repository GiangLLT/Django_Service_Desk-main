from django.urls import path
from . import views

urlpatterns = [
    path('barcode/', views.function_get_user, name='barcode'),
    path('load-article/', views.function_get_article, name='article'),
    path('load-list-article/', views.load_data, name='list_mara'),
]