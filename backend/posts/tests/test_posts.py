# backend/posts/tests.py
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from posts.models import Post

CREATE_URL = "/api/posts/"
DETAIL_URL = lambda pk: f"/api/posts/{pk}/"

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(
        username="bob",
        email="bob@example.com",
        password="secret!"
    )

@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_create_post_success(auth_client):
    """Positive test to create a post"""
    payload = {"title": "My Post", "text": "Hello world"}
    resp = auth_client.post(CREATE_URL, payload, format="json")
    assert resp.status_code == 201, resp.content
    data = resp.json()
    assert data["title"] == payload["title"]
    assert data["text"] == payload["text"]
    assert Post.objects.filter(id=data["id"], user__username="bob").exists()

@pytest.mark.django_db
def test_create_post_without_title(auth_client):
    """Negative: missing title should yield 400"""
    payload = {"text": "No title here"}
    resp = auth_client.post(CREATE_URL, payload, format="json")
    assert resp.status_code == 400
    assert "title" in resp.json()

@pytest.mark.django_db
def test_create_post_without_text(auth_client):
    """Negative: missing text should yield 400"""
    payload = {"title": "No text"}
    resp = auth_client.post(CREATE_URL, payload, format="json")
    assert resp.status_code == 400
    assert "text" in resp.json()

@pytest.mark.django_db
def test_list_posts(auth_client, user):
    """Positive: retrieve list of posts"""
    # create two posts
    Post.objects.create(user=user, title="A", text="a")
    Post.objects.create(user=user, title="B", text="b")

    resp = auth_client.get(CREATE_URL)
    assert resp.status_code == 200, resp.content
    payload = resp.json()
    assert "results" in payload
    
    # Check pagination fields
    assert "count" in payload
    assert "next" in payload
    assert "previous" in payload

    titles = {p["title"] for p in payload["results"]}
    assert titles == {"A", "B"}

@pytest.mark.django_db
def test_list_posts_guest(api_client, user):
    """Positive: retrieve list of posts (guest user)"""
    # create two posts
    Post.objects.create(user=user, title="A", text="a")
    Post.objects.create(user=user, title="B", text="b")

    resp = api_client.get(CREATE_URL)
    assert resp.status_code == 200, resp.content


@pytest.mark.django_db
def test_get_post_detail_success(auth_client, user):
    """Positive: retrieve a single post by id"""
    post = Post.objects.create(user=user, title="Detail", text="Here")
    resp = auth_client.get(DETAIL_URL(post.id))
    assert resp.status_code == 200, resp.content
    data = resp.json()
    assert data["id"] == post.id
    assert data["title"] == "Detail"
    assert data["text"] == "Here"

@pytest.mark.django_db
def test_get_post_detail_success_guest(api_client, user):
    """Positive: retrieve a single post by id (guest user)"""
    post = Post.objects.create(user=user, title="Detail", text="Here")
    resp = api_client.get(DETAIL_URL(post.id))
    assert resp.status_code == 200, resp.content

@pytest.mark.django_db
def test_get_post_detail_not_found(auth_client):
    """Negative: requesting non-existent post returns 404"""
    resp = auth_client.get(DETAIL_URL(9999))
    assert resp.status_code == 404