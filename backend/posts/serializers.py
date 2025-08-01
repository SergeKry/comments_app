from rest_framework import serializers
from .models import Post, Reply
from attachments.models import Attachment
from .utils import validate_allowed_html
from rest_framework.exceptions import ValidationError


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id','file','uploaded_at']


class PostSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'email', 'title', 'text', 'created_at', 'updated_at', 'attachments']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_text(self, value):
        try:
            validate_allowed_html(value)
        except ValidationError as e:
            raise ValidationError(e.detail)
        return value
    
class RecursiveField(serializers.Serializer):
    '''Recursive field for nested replies'''
    def to_representation(self, value):
        parent_serializer = self.parent.parent.__class__
        return parent_serializer(value, context=self.context).data
    

class ReplySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    children = RecursiveField(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Reply
        fields = [
            'id', 'post', 'parent', 'username', 'email',
            'text', 'created_at', 'updated_at', 'children', 'attachments'
        ]
        read_only_fields = [
            'id', 'username', 'email', 'created_at', 'updated_at', 'children'
        ]

    def validate_text(self, value):
        try:
            validate_allowed_html(value)
        except ValidationError as e:
            raise ValidationError(e.detail)
        return value