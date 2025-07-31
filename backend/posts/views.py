from rest_framework import viewsets, permissions, filters, parsers
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Post, Reply
from .serializers import PostSerializer, ReplySerializer
from .permissions import IsOwnerOrReadOnly
from .pagination import PostPagination
from .filters import PostFilter, ReplyFilter
from attachments.models import Attachment, MAX_FILES_PER_OBJ



class BaseAttachmentMixin:
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser
        ]

    def handle_attachments(self, obj):
        files = self.request.FILES.getlist('attachments')
        if len(files) > MAX_FILES_PER_OBJ:
            raise ValidationError(f'Max {MAX_FILES_PER_OBJ} files allowed')
        for f in files:
            Attachment.objects.create(content_object=obj, file=f)


class PostViewSet(BaseAttachmentMixin, viewsets.ModelViewSet):
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
        post = serializer.save(user=self.request.user)
        self.handle_attachments(post)

    def perform_update(self, serializer):
        post = serializer.save()
        if 'attachments' in self.request.FILES:
            self.handle_attachments(post)


class ReplyViewSet(BaseAttachmentMixin, viewsets.ModelViewSet):
    """
    A viewset for viewing and editing replies. 
    List (GET) only returns top-level replies; children are nested via serializer.
    """
    queryset = Reply.objects.all().select_related('user', 'post').prefetch_related('children')
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ReplyFilter

    def get_queryset(self):
        qs = Reply.objects.select_related('user', 'post')\
                          .prefetch_related('children')
        if self.action == 'list':
            return qs.filter(parent__isnull=True)
        return qs

    def perform_create(self, serializer):
        reply = serializer.save(user=self.request.user)
        self.handle_attachments(reply)
        channel_layer = get_channel_layer()
        data = ReplySerializer(reply, context={'request': self.request}).data
        async_to_sync(channel_layer.group_send)(
        f'post_{reply.post_id}',
        {'type': 'new_reply', 'reply': data}
        )

    def perform_update(self, serializer):
        reply = serializer.save()
        if 'attachments' in self.request.FILES:
            self.handle_attachments(reply)