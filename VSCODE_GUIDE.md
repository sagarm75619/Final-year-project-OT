# Pediatric OncoPlanner - Development Guide

This project is a comprehensive pediatric cancer treatment tracking system.

## 🚀 How to Run in VS Code

### 1. Backend (Django)
1. Open a terminal in VS Code.
2. Navigate to the root directory.
3. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
4. Install dependencies:
   ```powershell
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt psycopg2-binary
   ```
5. Run migrations:
   ```powershell
   python backendM/manage.py migrate
   ```
6. (Optional) Run the seed script for demo data:
   ```powershell
   python seed_data.py
   ```
7. Start the server:
   ```powershell
   python backendM/manage.py runserver
   ```

### 2. Frontend (React)
1. Open a **new** terminal in VS Code.
2. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the application:
   ```powershell
   npm start
   ```

## 🛠 Fully Functional Features
1. **Doctor Suite**:
   - Built-in patient registration form to create clinical profiles.
   - Dynamic treatment plan generator (chemo, tests, meds).
   - Real-time nutrition plan editor for pediatric cases.
   - Direct-to-parent messaging for clinical advice.
2. **Unified Parent/Patient Portal**:
   - Single view for tracking child's medicine progress and treatment calendar.
   - Functional Blood Report center with file uploads and Platelet graphs.
   - Medication checklists with "Mark as Taken" status persistence.
3. **Master Admin Panel**:
   - Control all hospital nodes and monitor system-wide activity.
   - Full access to manage facility occupancy and security logs.

## 🔑 Demo Access
- **Doctor**: `dr_smith` / `pass123`
- **Parent/Patient**: `parent_doe` / `pass123`
- **Admin**: `admin` / `admin123`
