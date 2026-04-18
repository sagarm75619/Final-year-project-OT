from rest_framework import serializers
from .models import (
    Hospital, Patient, TreatmentEvent, BloodReport, 
    MedicationAlert, DoctorNote, ChecklistItem, NutritionPlan,
    Notification, AIChat, MedicineSchedule, Appointment,
    BloodBank, BloodInventory, BloodDonationProgram, Fundraiser,
    CareJournal, WellWish, VolunteerTask
)
from accounts.models import CustomUser

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AIChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChat
        fields = '__all__'
        read_only_fields = ['user', 'response']

class PatientSerializer(serializers.ModelSerializer):
    parent_username = serializers.ReadOnlyField(source='parent.username')
    parent_email = serializers.ReadOnlyField(source='parent.email')
    assigned_doctors = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'parent', 'parent_username', 'parent_email', 'assigned_doctors', 'diagnosis', 'created_at']

class TreatmentEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentEvent
        fields = '__all__'

class BloodReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodReport
        fields = '__all__'

class DoctorNoteSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.username')
    class Meta:
        model = DoctorNote
        fields = '__all__'

class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'

class NutritionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionPlan
        fields = '__all__'

class MedicationAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationAlert
        fields = '__all__'

class MedicineScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineSchedule
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.username')
    class Meta:
        model = Appointment
        fields = '__all__'

class BloodInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = '__all__'

class BloodDonationProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodDonationProgram
        fields = '__all__'

class BloodBankSerializer(serializers.ModelSerializer):
    inventory = BloodInventorySerializer(many=True, read_only=True)
    programs = BloodDonationProgramSerializer(many=True, read_only=True)
    class Meta:
        model = BloodBank
        fields = '__all__'

class FundraiserSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')
    class Meta:
        model = Fundraiser
        fields = '__all__'

class CareJournalSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = CareJournal
        fields = '__all__'

class WellWishSerializer(serializers.ModelSerializer):
    class Meta:
        model = WellWish
        fields = '__all__'

class VolunteerTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerTask
        fields = '__all__'

