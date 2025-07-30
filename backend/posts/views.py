from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Reply
from .serializers import PostSerializer, ReplySerializer
from .permissions import IsOwnerOrReadOnly
from .pagination import PostPagination
from .filters import PostFilter, ReplyFilter

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


class ReplyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing replies. 
    List (GET) only returns top-level replies; children are nested via serializer.
    """
    queryset = Reply.objects.all().select_related('user', 'post').prefetch_related('children')
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ReplyFilter
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_queryset(self):
        qs = Reply.objects.select_related('user', 'post')\
                          .prefetch_related('children')\
                          .order_by('created_at')
        if self.action == 'list':
            return qs.filter(parent__isnull=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)