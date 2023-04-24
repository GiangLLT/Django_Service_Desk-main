from django.urls import path, include
from . import views
from oauth2_provider.views import AuthorizationView, TokenView

urlpatterns = [
    path('Admin/', views.Admin, name='Admin'),
    path('trang-chu/', views.Home, name='Home'),
    path('danh-sach-du-lieu/', views.Page_data, name='DataList'),
    path('danh-sach-san-pham/', views.Product_data, name='Product'), 
    path('danh-sach-test/', views.load_Product, name='test'),
    path('danh-sach-test1/', views.load_data, name='load_data'),
    
    path('delete-product/', views.delete_Product, name='delete_Product'),
    path('data-category/', views.Data_Category, name='Data_Category'),
    path('add_product/', views.add_product, name='add_product'),
    path('load-data-update-product/', views.Data_Update_Product, name='Data_Update_Product'),
    path('update-product/', views.update_product, name='update_product'),

    #login office 365
    path('login/', views.Login_page, name='login'),
    path('system/callback/', views.login_system, name='login_system'),
    path('login/callback/', views.microsoft_login_token, name='login_callback'),    
    path('google/callback/', views.google_login, name='google_login'),
    path('facebook/callback/', views.facebook_login, name='facebook_login'),

    path('logout/', views.logout, name='logout'),
    path('setcookie/', views.SetCookie),
    path('getcookie/', views.GetCookie),
    path('deletecookie/', views.DeleteCookie),

    # path('test/', views.test, name='test'),

]