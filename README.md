# Waybill: Shipment full-stack app

- `shipment-django/` the Django REST backend (your project, with 2 small additions)
- `shipment-frontend/` the React frontend (Vite + React Router + Framer Motion + Lucide icons)

## Run it (two terminals)

### 1. Backend
```bash
cd shipment-django
python -m venv venv
venv\Scripts\activate          # Windows   (Linux/macOS: source venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env         # Linux/macOS: cp .env.example .env
python manage.py makemigrations accounts customers shipments
python manage.py migrate
python manage.py createsuperuser   # this account becomes the admin
python manage.py runserver         # http://127.0.0.1:8000
```

### 2. Frontend
```bash
cd shipment-frontend
npm install
copy .env.example .env         # Linux/macOS: cp .env.example .env
npm run dev                    # http://localhost:5173
```

## Try the flow
1. Open http://localhost:5173 and click **Create account**.
2. Fill in your contact details (one time).
3. Click **New shipment**, fill the 3 steps, and open it from the dashboard.
4. Log in with the superuser account to see **all** shipments and the **Customers** page.

## How the frontend is organised
```
src/
  styles/      tokens.css (colors, fonts, spacing) + base / components / pages
  api/         client.js (fetch + JWT + auto refresh), services.js (one function per endpoint)
  context/     AuthContext (login, profile), ToastContext (messages)
  components/  ui/ (Button, Field, StatusBadge, Feedback), AppShell, StatusTimeline, ShipmentCard ...
  pages/       Landing, Login, Register, Welcome, Dashboard, NewShipment, ShipmentDetail, Profile, Customers
```
