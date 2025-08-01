from rest_framework.routers import DefaultRouter
from .views import PostViewSet, ReplyViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'replies', ReplyViewSet, basename='reply')

urlpatterns = router.urls