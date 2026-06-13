"""Integration tests for Calorie Tracker API."""

import pytest

# Authentication Tests


def test_register_user(client):
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"


def test_login_user(client):
    """Test user login."""
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


# Meals Tests


@pytest.fixture
def auth_token(client):
    """Create test user and return token."""
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass123"},
    )
    return response.json()["access_token"]


def test_add_meal(client, auth_token):
    """Test adding a meal."""
    response = client.post(
        "/api/meals",
        json={
            "food_name": "Chicken",
            "calories_per_100g": 165,
            "weight_g": 100,
            "meal_type": "lunch",
        },
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 201
    assert response.json()["total_calories"] == 165


def test_get_meals(client, auth_token):
    """Test retrieving meals."""
    # Add meal
    client.post(
        "/api/meals",
        json={
            "food_name": "Chicken",
            "calories_per_100g": 165,
            "weight_g": 100,
            "meal_type": "lunch",
        },
        headers={"Authorization": f"Bearer {auth_token}"},
    )

    # Get meals
    response = client.get(
        "/api/meals",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) >= 1
