from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('parent_patient', 'Parent/Patient'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='parent_patient')
    
    # Common Profile Fields
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    
    # Patient fields
    weight = models.FloatField(null=True, blank=True, help_text="Weight in kg")
    height = models.FloatField(null=True, blank=True, help_text="Height in cm")
    
    # Doctor fields
    experience = models.IntegerField(null=True, blank=True, help_text="Years of experience")
    degree = models.CharField(max_length=100, null=True, blank=True)
    achievements = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
