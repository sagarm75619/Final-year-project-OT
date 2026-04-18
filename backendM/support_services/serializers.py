from rest_framework import serializers
from .models import BloodBank, HospitalBed, Fundraiser
from planner.models import Patient

class BloodBankSerializer(serializers.ModelSerializer):
    blood_group_display = serializers.CharField(source='get_blood_group_display', read_only=True)

    class Meta:
        model = BloodBank
        fields = ['id', 'name', 'location', 'contact', 'blood_group', 'blood_group_display', 'units_available', 'last_updated']

class HospitalBedSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)

    class Meta:
        model = HospitalBed
        fields = ['id', 'hospital_name', 'location', 'ICU_beds', 'NICU_beds', 'general_beds',
                  'available_ICU', 'available_NICU', 'available_general', 'status']

class FundraiserSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = Fundraiser
        fields = ['id', 'title', 'description', 'target_amount', 'collected_amount', 'patient', 'patient_name', 'is_approved', 'created_at']
