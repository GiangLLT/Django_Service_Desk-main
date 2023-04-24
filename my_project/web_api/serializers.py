from rest_framework import serializers
from Admin.models import Product, Category, Users

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # fields = ('id','name')
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# class ProductSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(read_only=True)
#     name = serializers.CharField(required=False, allow_blank=True, max_length=255)
#     id_cate = serializers.IntegerField(required=False, allow_null=True)
#     # id_cate = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
#     category = CategorySerializer(read_only=True)
#     # category = serializers.StringRelatedField(read_only=True)
#     price = serializers.DecimalField(max_digits=20, decimal_places=0, required=False, allow_null=True)
#     class Meta:
#         model = Product
#         # fields = ('id','name')
#         fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        # fields = ('id','name')
        fields = '__all__'
        