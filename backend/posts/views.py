from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly
from .pagination import PostPagination
from .filters import PostFilter

class PostViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing post instances.
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = PostPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PostFilter
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)