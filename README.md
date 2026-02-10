# Insurance Data Orchestration Platform (Demo)

This is a **Node.js + Express** demo app that runs locally with **Docker** services:
- **Elasticsearch** (search/index)
- **Redis** (cache)
- **RabbitMQ** (message broker)
- **Kibana** (Elastic UI)

✅ **This version includes a simple login page** (fixed demo username/password) so you can run it without API keys or JWT setup.

---

## 1) Prerequisites
- Node.js (recommended: LTS)
- Docker Desktop

---

## 2) Start Docker services
From the project folder:

```bash
docker compose up -d
```

Services:
- Elasticsearch: `http://localhost:9200`
- Kibana: `http://localhost:5601`
- RabbitMQ UI: `http://localhost:15672` (guest / guest)
- Redis: `localhost:6379`

---

## 3) Install & run the app
```bash
npm install
npm start
```

Open:
- **Login page:** `http://localhost:3000/login`
- **Dashboard:** `http://localhost:3000/dashboard`

Demo login (fixed):
- **Username:** `stock@gmail.com`
- **Password:** `Stock1234`

> You can change these in `config/local.json`.

---

## Optional API (for testing)
These routes are available (but not required to use the app):

- `GET  /api/health`
- `POST /api/plan`
- `GET  /api/plan/:id`

Example:
```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```
