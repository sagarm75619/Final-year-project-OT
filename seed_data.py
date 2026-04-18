import os
import django
import sys

# Add the project path to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backendM'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import CustomUser
from planner.models import Hospital, Patient, TreatmentEvent
from django.utils import timezone
from datetime import timedelta

def seed():
    # Create Users
    admin, _ = CustomUser.objects.get_or_create(username='admin', email='admin@onco.com', role='admin')
    admin.set_password('admin123')
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()

    doctor, _ = CustomUser.objects.get_or_create(username='dr_smith', email='smith@hospital.com', role='doctor')
    doctor.set_password('pass123')
    doctor.save()

    parent, _ = CustomUser.objects.get_or_create(username='parent_doe', email='doe@gmail.com', role='parent_patient')
    parent.set_password('pass123')
    parent.save()

    # Create Hospitals
    h1, _ = Hospital.objects.get_or_create(name='City Children Hospital', location='Downtown', total_beds=50, available_beds=12)
    h2, _ = Hospital.objects.get_or_create(name='Oncology Specialty Care', location='West Wing', total_beds=30, available_beds=3)

    # Create Patient
    p1, _ = Patient.objects.get_or_create(name='Junior Doe', age=6, parent=parent, diagnosis='ALL - Phase 1')
    p1.assigned_doctors.add(doctor)

    # Create Events
    now = timezone.now()
    TreatmentEvent.objects.get_or_create(
        patient=p1, title='Morning Chemo', type='chemo', 
        start_time=now, color='#e63946'
    )
    TreatmentEvent.objects.get_or_create(
        patient=p1, title='Medicine A', type='medicine', 
        start_time=now + timedelta(hours=2), color='#4361ee'
    )
    TreatmentEvent.objects.get_or_create(
        patient=p1, title='Blood Test (CBC)', type='test', 
        start_time=now + timedelta(days=1), color='#ffb703'
    )

    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed()
