
# MediTrack — Health Metrics Management API

A Flask + SQLAlchemy REST API to track patient vitals, symptoms, and medication adherence.
Includes JWT auth, unit tests, and Docker-ready configuration. Ideal as a portfolio project for healthcare tech roles.

## Features
- Python **Flask** backend with **SQLAlchemy** ORM
- **JWT** authentication (register/login)
- Patients CRUD
- Vitals CRUD + date range queries
- Summary analytics (averages, last reading, abnormal flags)
- **Pytest** unit tests
- **PostgreSQL** (prod) / **SQLite** (dev/test) support

## Quickstart (Dev / SQLite)
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Env vars (optional)
export FLASK_ENV=development
export SECRET_KEY=dev-secret
export DATABASE_URL=sqlite:///meditrack.db

# Initialize DB and run
python run.py
```
Open `http://127.0.0.1:5000/health` to verify the service.

## Example Endpoints
| Method | Endpoint                         | Description                     |
|-------:|----------------------------------|---------------------------------|
| POST   | /auth/register                   | Create account (email, password)|
| POST   | /auth/login                      | JWT login                       |
| POST   | /patients                        | Create patient                  |
| GET    | /patients                        | List patients                   |
| GET    | /patients/<id>                   | Get patient                     |
| PATCH  | /patients/<id>                   | Update patient                  |
| DELETE | /patients/<id>                   | Delete patient                  |
| POST   | /vitals                          | Add vitals record               |
| GET    | /vitals/<patient_id>             | List vitals for a patient       |
| GET    | /vitals/summary/<patient_id>     | Summary analytics               |

### Sample cURL
```bash
# Register
curl -X POST http://127.0.0.1:5000/auth/register -H "Content-Type: application/json"   -d '{"email":"demo@demo.com","password":"Passw0rd!"}'

# Login
TOKEN=$(curl -s -X POST http://127.0.0.1:5000/auth/login -H "Content-Type: application/json"   -d '{"email":"demo@demo.com","password":"Passw0rd!"}' | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# Create patient
curl -X POST http://127.0.0.1:5000/patients -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"Alex Smith","age":34,"gender":"Male"}'
```

## Testing
```bash
pytest -q
```

## Environment Variables
- `SECRET_KEY` — Flask secret key (default: generated)
- `DATABASE_URL` — SQLAlchemy URL (e.g., `postgresql+psycopg2://user:pwd@host/db` or `sqlite:///meditrack.db`)

## Deployment (Docker example)
```bash
# Build and run
docker build -t meditrack .
docker run -p 5000:5000 -e DATABASE_URL=sqlite:///meditrack.db meditrack
```

---

MIT License © Akshay Veerabhadraiah
