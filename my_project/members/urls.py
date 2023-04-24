from django.urls import path
from . import views

urlpatterns = [
    path('members/', views.members, name='members'),
    path('members/datalist', views.Data_list, name='datalist'),
    path('members/datalist/<int:id>', views.Data_list_id, name='datalist_id'),
]