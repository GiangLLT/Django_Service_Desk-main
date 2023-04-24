from django.urls import path, include
# from .views import CategoryViewSet, ProductViewSet, UsersViewSet
# from .views import ProductViewSet, UsersViewSet
from rest_framework import routers
from rest_framework_swagger.views import get_swagger_view
from .views import product_list_all, product_by_id, product_update, product_create, product_delete, authenticate_request

schema_view = get_swagger_view(title='API Documentation')  # Tạo view Swagger


router = routers.DefaultRouter()
# router.register(r'products', ProductViewSet)
# router.register(r'users', UsersViewSet)


urlpatterns = [   
    # path('categories/', CategoryViewSet.as_view(), name='category-list'),
    # path('categories/<int:pk>/', CategoryViewSet.as_view(), name='category-detail'),
    # path('products/', ProductViewSet.as_view(), name='product-list'),
    # path('products/<int:pk>/', ProductViewSet.as_view(), name='product-detail'),
    # path('users/', UsersViewSet.as_view(), name='users-list'),
    # path('users/<str:pk>/', UsersViewSet.as_view(), name='users-detail'),

    path('', include(router.urls)),


    path('api/', schema_view),
    path('Product/data-all/', product_list_all),
    path('Product/by-id/<int:id>', product_by_id),
    path('Product/update-data/<int:pk>', product_update),
    path('Product/create-data/', product_create),
    path('Product/detele-data/<int:id>', product_delete),

    path('token/', authenticate_request),
]