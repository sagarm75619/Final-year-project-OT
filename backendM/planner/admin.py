from django.contrib import admin
from .models import (
    Hospital, Patient, TreatmentEvent, BloodReport, 
    MedicationAlert, DoctorNote, ChecklistItem, NutritionPlan,
    Notification, AIChat, MedicineSchedule, Appointment
)

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'total_beds', 'available_beds')
    search_fields = ('name', 'location')

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'parent', 'created_at')
    search_fields = ('name', 'parent__username', 'parent__email')
    list_filter = ('created_at',)

@admin.register(TreatmentEvent)
class TreatmentEventAdmin(admin.ModelAdmin):
    list_display = ('patient', 'title', 'type', 'start_time', 'is_completed', 'reminder_sent')
    search_fields = ('patient__name', 'title')
    list_filter = ('type', 'is_completed', 'reminder_sent')

@admin.register(BloodReport)
class BloodReportAdmin(admin.ModelAdmin):
    list_display = ('patient', 'uploaded_at', 'is_reviewed')
    search_fields = ('patient__name',)
    list_filter = ('is_reviewed', 'uploaded_at')

@admin.register(MedicineSchedule)
class MedicineScheduleAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medicine_name', 'dosage', 'time', 'taken')
    search_fields = ('patient__name', 'medicine_name')
    list_filter = ('taken', 'time')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date')
    search_fields = ('patient__name', 'doctor__username')
    list_filter = ('date',)

admin.site.register(MedicationAlert)
admin.site.register(DoctorNote)
admin.site.register(ChecklistItem)
admin.site.register(NutritionPlan)
admin.site.register(Notification)
admin.site.register(AIChat)
