"""Pytest configuration and fixtures."""

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set env vars BEFORE imports
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-12345"
os.environ["CORS_ORIGINS"] = "http://localhost:5173"

from database import Base, get_db
from fastapi.testclient import TestClient
from main import app, init_db


@pytest.fixture
def db_session():
    """Create a test database session."""
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """Create a test client."""

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
