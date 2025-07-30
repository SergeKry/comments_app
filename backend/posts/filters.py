from django_filters import rest_framework as filters
from .models import Post

class PostFilter(filters.FilterSet):
    '''filter params: ?username=... & ?email=...'''
    username = filters.CharFilter(field_name='user__username', lookup_expr='iexact')
    email = filters.CharFilter(field_name='user__email', lookup_expr='iexact')

    class Meta:
        model = Post
        fields = ['username', 'email']