from rest_framework import serializers
from .models import Post
from .utils import validate_allowed_html
from rest_framework.exceptions import ValidationError

class PostSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'title', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_text(self, value):
        try:
            validate_allowed_html(value)
        except ValidationError as e:
            raise ValidationError(e.detail)
        return value