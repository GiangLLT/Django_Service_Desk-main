from rest_framework import viewsets
from rest_framework.response import Response
from Admin.models import Product, Users, Category
from .serializers import ProductSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes, schema
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from datetime import timedelta, datetime

from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework import status
from rest_framework.schemas import AutoSchema
from drf_yasg import openapi


#JWT token
@api_view(['POST'])
def authenticate_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('Authorization header is missing')
    try:      
        username = request.data.get('username')
        password = request.data.get('password')  # lấy password từ request data
        user = Users.objects.get(Mail=username, Password=password)
        if user is None:
            raise AuthenticationFailed('User not found')
        
        token = create_jwt_token(username)
        return Response(token, status=200)
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired')
    except IndexError:
        raise AuthenticationFailed('Token prefix missing')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')

def create_jwt_token(username):
    exp = datetime.utcnow() + timedelta(minutes=30)
    iat = datetime.utcnow()
    payload = {
        'username': username,
        'exp': exp,
        'iat': iat
    }
    JWT_SECRET_KEY = settings.JWT_AUTH["JWT_SECRET_KEY"]
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

    data_token = {
        'token': token,
        'expTime': exp.strftime("%H:%M:%S"),
        'expDate': iat.strftime("%d/%m/%Y")
    }
    return data_token


def token_authentication(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise AuthenticationFailed('Authorization header is missing')
        token = auth_header
        # token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.JWT_AUTH["JWT_SECRET_KEY"], algorithms=['HS256'])
            exp = datetime.fromtimestamp(payload['exp'])
            if exp < datetime.utcnow():
                raise AuthenticationFailed('Token has expired')
            return view_func(request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
    return wrapper
#JWT token


# #API CRUD Product
@api_view(['GET'])
@schema(AutoSchema())
@token_authentication
def product_list_all(request):
    try:
        product = Product.objects.all()
        serializer = ProductSerializer(product, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'No Data'}, status=404)


@api_view(['GET'])
@schema(AutoSchema())
@token_authentication
def product_by_id(request, id):
    try:
        product = Product.objects.get(id = id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=404)
    

@api_view(['POST'])
@schema(AutoSchema())
@token_authentication
def product_create(request):
    try:       
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Product.DoesNotExist:
        return Response({'detail': 'Create failed'}, status=404)

@api_view(['PUT'])
@schema(AutoSchema())
@token_authentication
def product_update(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True) 
    if serializer.is_valid():
        if "id_cate" in request.data:
            cate_id = request.data["id_cate"]        
            category = Category.objects.get(id=cate_id)
            serializer.validated_data["id_cate"] = category
            serializer.validated_data["category"] = category.name
        if "category" in request.data:
            return Response({'detail': 'Category can not update'}, status=404)
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@schema(AutoSchema())
@token_authentication
def product_delete(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=404)
    try:
        product.delete()
        return Response({'detail': 'Delete Success'}, status=204)
    except Exception as ex:
        return Response(ex ,status=204)

# #API CRUD Product



