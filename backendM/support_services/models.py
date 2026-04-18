from django.db import models
from planner.models import Patient

class BloodBank(models.Model):
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A Positive'),
        ('A-', 'A Negative'),
        ('B+', 'B Positive'),
        ('B-', 'B Negative'),
        ('O+', 'O Positive'),
        ('O-', 'O Negative'),
        ('AB+', 'AB Positive'),
        ('AB-', 'AB Negative'),
    )

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contact = models.CharField(max_length=50)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    units_available = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.get_blood_group_display()} ({self.units_available} units)"

class HospitalBed(models.Model):
    hospital_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    
    ICU_beds = models.IntegerField(default=0)
    NICU_beds = models.IntegerField(default=0)
    general_beds = models.IntegerField(default=0)
    
    available_ICU = models.IntegerField(default=0)
    available_NICU = models.IntegerField(default=0)
    available_general = models.IntegerField(default=0)

    @property
    def status(self):
        total_beds = self.ICU_beds + self.NICU_beds + self.general_beds
        total_available = self.available_ICU + self.available_NICU + self.available_general
        
        if total_beds == 0 or total_available == 0:
            return 'Full'
            
        availability_ratio = total_available / total_beds
        if availability_ratio < 0.20:
            return 'Limited'
        else:
            return 'Available'

    def __str__(self):
        return f"{self.hospital_name} - Status: {self.status}"

class Fundraiser(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    collected_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='support_fundraisers')
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Approved: {self.is_approved})"
