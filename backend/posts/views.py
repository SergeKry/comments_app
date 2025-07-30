from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly
from .pagination import PostPagination

class PostViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing post instances.
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = PostPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)