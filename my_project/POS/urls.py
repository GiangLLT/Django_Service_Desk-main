from django.urls import path, include
from . import views
# from oauth2_provider.views import AuthorizationView, TokenView

urlpatterns = [
    # path('test/', views.test, name='test'),
    path('login-pos/', views.POS, name='Pos Login'),
    path('order-pos/', views.Order_POS, name='Order Login'),

    #Function
    path('login-pos-check/', views.login_pos_system, name='login_pos_system'),

]