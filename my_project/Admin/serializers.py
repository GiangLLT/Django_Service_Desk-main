from rest_framework import serializers
from .models import MailStatus

class MailStatus_Serializer(serializers.ModelSerializer):
    class Meta:
        model = MailStatus
        fields = '__all__'