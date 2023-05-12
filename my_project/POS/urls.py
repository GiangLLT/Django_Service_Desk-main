from django.urls import path, include
from . import views
# from oauth2_provider.views import AuthorizationView, TokenView

urlpatterns = [
    # path('test/', views.test, name='test'),
    path('login-pos/', views.POS, name='Pos Login'),
    path('order-pos/', views.Order_POS, name='Order Login'),
    path('home-pos/', views.Home_POS, name='Home POS'),

    #Function
    path('login-pos-check/', views.login_pos_system, name='login_pos_system'),
    path('check-promotion/', views.Check_promotion, name='Check_promotion'),
    path('check-promotion-member/', views.Check_promotion_member, name='Check_promotion_member'),

]