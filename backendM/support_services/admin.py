from django.contrib import admin
from .models import BloodBank, HospitalBed, Fundraiser

@admin.register(BloodBank)
class BloodBankAdmin(admin.ModelAdmin):
    list_display = ('name', 'blood_group', 'units_available', 'last_updated')
    list_filter = ('blood_group',)
    search_fields = ('name', 'location')

@admin.register(HospitalBed)
class HospitalBedAdmin(admin.ModelAdmin):
    list_display = ('hospital_name', 'location', 'available_ICU', 'available_NICU', 'available_general', 'status')
    search_fields = ('hospital_name', 'location')

@admin.register(Fundraiser)
class FundraiserAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'target_amount', 'collected_amount', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('title', 'patient__name')
