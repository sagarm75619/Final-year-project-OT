from django.db import models
from django.conf import settings

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    total_beds = models.IntegerField(default=0)
    available_beds = models.IntegerField(default=0)
    medical_ward_beds = models.IntegerField(default=0)
    icu_beds = models.IntegerField(default=0)
    nicu_beds = models.IntegerField(default=0)
    contact_number = models.CharField(max_length=50, blank=True)
    support_email = models.EmailField(blank=True)

    def __str__(self):
        return self.name

class BloodBank(models.Model):
    name = models.CharField(max_length=255) # e.g., Redcross Blood Bank
    location = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    support_email = models.EmailField()

    def __str__(self):
        return self.name

class BloodInventory(models.Model):
    blood_bank = models.ForeignKey(BloodBank, on_delete=models.CASCADE, related_name='inventory')
    blood_type = models.CharField(max_length=10) # A+, O-, etc.
    quantity_ml = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.blood_bank.name} - {self.blood_type}"

class BloodDonationProgram(models.Model):
    title = models.CharField(max_length=255)
    blood_bank = models.ForeignKey(BloodBank, on_delete=models.CASCADE, related_name='programs')
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title

class Fundraiser(models.Model):
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, related_name='fundraisers')
    title = models.CharField(max_length=255)
    story_description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.patient.name}"

class Patient(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    parent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='children')
    assigned_doctors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_patients', limit_choices_to={'role': 'doctor'})
    diagnosis = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TreatmentEvent(models.Model):
    EVENT_TYPES = (
        ('chemo', 'Chemotherapy'),
        ('medicine', 'Medicine'),
        ('test', 'Blood Test'),
        ('appointment', 'Appointment'),
        ('injection', 'Injection'),
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='events')
    type = models.CharField(max_length=20, choices=EVENT_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    reminder_sent = models.BooleanField(default=False)
    color = models.CharField(max_length=20, default='#4361ee') # For FullCalendar

    def __str__(self):
        return f"{self.patient.name} - {self.title}"

class Notification(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, default='reminder') # reminder, result, alert
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patient.name} - {self.title}"

class AIChat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    query = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class BloodReport(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='blood_reports')
    report_file = models.FileField(upload_to='reports/')
    cbc_count = models.CharField(max_length=100, blank=True)
    pbs_count = models.CharField(max_length=100, blank=True)
    ldh_count = models.CharField(max_length=100, blank=True)
    platelets = models.IntegerField(null=True, blank=True)
    doctor_notes = models.TextField(blank=True)
    is_reviewed = models.BooleanField(default=False)
    review_status = models.CharField(max_length=50, default='Pending') # Complete, Medium, Red Flag
    uploaded_at = models.DateTimeField(auto_now_add=True)

class MedicationAlert(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medicine_name = models.CharField(max_length=255)
    stock_remaining = models.IntegerField()
    notify_threshold = models.IntegerField(default=5)

class DoctorNote(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='notes')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class ChecklistItem(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='checklist')
    task = models.CharField(max_length=255)
    is_done = models.BooleanField(default=False)
    category = models.CharField(max_length=100, default='General')

class NutritionPlan(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='nutrition_plan')
    plan_details = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

class MedicineSchedule(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medicines')
    medicine_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    time = models.TimeField()
    taken = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patient.name} - {self.medicine_name}"

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_appointments', limit_choices_to={'role': 'doctor'})
    date = models.DateTimeField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Appointment: {self.patient.name} with {self.doctor.username}"

class CareJournal(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WellWish(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='well_wishes')
    author_name = models.CharField(max_length=255, default='Anonymous Supporter')
    ngo_club_name = models.CharField(max_length=255, blank=True, null=True, help_text="e.g., A star football club")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class VolunteerTask(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='volunteer_tasks')
    task_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date_needed = models.DateField()
    volunteer_name = models.CharField(max_length=255, blank=True) 
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.task_name} for {self.patient.name}"
