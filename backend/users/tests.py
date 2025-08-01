import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from posts.models import Post

username = "alice"
email = "alice@example.com"
password ="secret123"

login_url = "/api/auth/login/"
me_url    = "/api/auth/me/"
authors_url = "/api/auth/authors/"


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(django_user_model):
    """
    Create a user.
    """
    return django_user_model.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

@pytest.fixture
def author_with_post(django_user_model):
    """
    Create an author and a post.
    """
    user = django_user_model.objects.create_user(
        username="poster",
        email="poster@example.com",
        password="pass1234",
    )
    Post.objects.create(
        user=user,
        title="Hello",
        text="This is a test post.",
    )
    return user

@pytest.mark.django_db
def test_login_returns_tokens(api_client, user):
    """
    Positive login test
    """

    response = api_client.post(
        login_url,
        {'username': username, 'password': password},
        format='json'
    )

    assert response.status_code == 200, response.content
    data = response.json()
    assert 'access' in data and 'refresh' in data

@pytest.mark.django_db
def test_login_failed(api_client, user):
    """
    Negative login test
    """

    response = api_client.post(
        login_url,
        {'username': username, 'password': f'{password}123'},
        format='json'
    )

    assert response.status_code == 401, response.content
    data = response.json()

@pytest.mark.django_db
def test_me_requires_auth(api_client):
    """
    GET /me/ without a token should be rejected.
    """
    resp = api_client.get(me_url)
    assert resp.status_code == 401

@pytest.mark.django_db
def test_me_returns_user_profile(api_client, user):
    """
    After logging in, GET /me/ should return the current user's info.
    """
    # login and obtain token
    login_resp = api_client.post(
        login_url,
        {"username": username, "password": password},
        format="json",
    )
    assert login_resp.status_code == 200, login_resp.content
    access = login_resp.json()["access"]

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    me_resp = api_client.get(me_url)
    assert me_resp.status_code == 200, me_resp.content
    data = me_resp.json()
    assert data["username"] == username
    assert data["email"] == email

@pytest.mark.django_db
def test_authors_endpoint_returns_only_users_with_posts(api_client, user, author_with_post):
    """
    Given two users in the database, only the one with at least one Post
    should be returned by GET /api/auth/authors/
    """

    # hit the authors endpoint
    resp = api_client.get(authors_url)
    assert resp.status_code == 200, resp.content

    data = resp.json()
    # exactly one author should be returned
    assert isinstance(data, list)
    assert len(data) == 1

    author_data = data[0]
    assert author_data["username"] == author_with_post.username
    assert author_data["email"]    == author_with_post.email