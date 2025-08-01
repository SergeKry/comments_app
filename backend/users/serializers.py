import requests
from django.conf import settings
from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    recaptcha_token = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'homepage', 'password', 'recaptcha_token')

    def validate(self, data):
            if not settings.ENABLE_RECAPTCHA:
                pass
            token = data.pop('recaptcha_token')
            resp = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': settings.RECAPTCHA_SECRET_KEY,
                    'response': token,
                }
            ).json()
            if not resp.get('success'):
                raise serializers.ValidationError('reCAPTCHA failed')
            return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'homepage')

        
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')