import pytest
from rest_framework.test import APIClient
from posts.models import Post, Reply

REPLIES_URL = "/api/replies/"
REPLY_DETAIL_URL = lambda pk: f"/api/replies/{pk}/"

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(
        username="charlie",
        email="charlie@example.com",
        password="passw0rd",
    )

@pytest.fixture
def auth_client(api_client, user):
    # force authenticate all requests as our test user
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def post(user):
    return Post.objects.create(user=user, title="Post for Replies", text="Some text")

@pytest.mark.django_db
def test_create_reply_without_text(auth_client, post):
    """Negative: missing text should error"""
    resp = auth_client.post(REPLIES_URL, {"post": post.id}, format="json")
    assert resp.status_code == 400
    assert "text" in resp.json()

@pytest.mark.django_db
def test_create_reply_without_post(auth_client):
    """Negative: missing post should error"""
    resp = auth_client.post(REPLIES_URL, {"text": "no post"}, format="json")
    assert resp.status_code == 400
    assert "post" in resp.json()

@pytest.mark.django_db
def test_list_replies(auth_client, post):
    """List only top-level replies, nested children in `children`"""
    # create two top-level replies and one child
    r1 = Reply.objects.create(user=post.user, post=post, text="first")
    r2 = Reply.objects.create(user=post.user, post=post, text="second")
    Reply.objects.create(user=post.user, post=post, parent=r1, text="child")
    # fetch
    resp = auth_client.get(REPLIES_URL, {"post": post.id})
    assert resp.status_code == 200, resp.content
    data = resp.json()
    # expect exactly the two top-level IDs
    ids = {item["id"] for item in data}
    assert ids == {r1.id, r2.id}
    # verify the child shows up under r1.children
    for item in data:
        if item["id"] == r1.id:
            assert len(item["children"]) == 1
            assert item["children"][0]["text"] == "child"

@pytest.mark.django_db
def test_list_replies_guest(api_client, post):
    """List only top-level replies, nested children in `children` (guest user)"""
    # create two top-level replies and one child
    r1 = Reply.objects.create(user=post.user, post=post, text="first")
    r2 = Reply.objects.create(user=post.user, post=post, text="second")
    Reply.objects.create(user=post.user, post=post, parent=r1, text="child")

    resp = api_client.get(REPLIES_URL, {"post": post.id})
    assert resp.status_code == 200, resp.content

@pytest.mark.django_db
def test_get_reply_detail_success(auth_client, post):
    """Fetch a single reply by ID"""
    reply = Reply.objects.create(user=post.user, post=post, text="detail")
    resp = auth_client.get(REPLY_DETAIL_URL(reply.id))
    assert resp.status_code == 200, resp.content
    data = resp.json()
    assert data["id"] == reply.id
    assert data["text"] == "detail"

@pytest.mark.django_db
def test_get_reply_detail_success_guest(api_client, post):
    """Fetch a single reply by ID (guest)"""
    reply = Reply.objects.create(user=post.user, post=post, text="detail")
    resp = api_client.get(REPLY_DETAIL_URL(reply.id))
    assert resp.status_code == 200, resp.content

@pytest.mark.django_db
def test_get_reply_detail_not_found(auth_client):
    """404 on non-existent reply"""
    resp = auth_client.get(REPLY_DETAIL_URL(9999))
    assert resp.status_code == 404

@pytest.mark.django_db
def test_delete_reply_detail_success(auth_client, post):
    """Delete a single reply by ID"""
    reply = Reply.objects.create(user=post.user, post=post, text="detail")
    resp = auth_client.delete(REPLY_DETAIL_URL(reply.id))
    assert resp.status_code == 204, resp.content

@pytest.mark.django_db
def test_delete_reply_detail_guest(api_client, post):
    """Delete a single reply by ID (Guest user)"""
    reply = Reply.objects.create(user=post.user, post=post, text="detail")
    resp = api_client.delete(REPLY_DETAIL_URL(reply.id))
    assert resp.status_code == 401, resp.content