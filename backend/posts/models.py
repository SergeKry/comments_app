from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from attachments.models import Attachment

class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    title = models.CharField(max_length=255)
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    attachments = GenericRelation(
        Attachment,
        content_type_field='content_type',
        object_id_field='object_id',
        related_query_name='post'
    )

    def __str__(self):
        return self.title
    

class Reply(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='children'
    )
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    attachments = GenericRelation(
        Attachment,
        content_type_field='content_type',
        object_id_field='object_id',
        related_query_name='reply'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Reply by {self.user.username} on Post {self.post.id}'