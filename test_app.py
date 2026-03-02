import pytest
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_index_page(client):
    response = client.get('/')
    assert response.status_code == 200

def test_ping_endpoint(client):
    response = client.get('/api/ping')
    assert response.status_code == 200
    data = response.get_json()
    assert data['ok'] is True
    assert 'name' in data