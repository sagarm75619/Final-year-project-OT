from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HospitalViewSet, PatientViewSet, TreatmentEventViewSet,
    BloodReportViewSet, DoctorNoteViewSet, ChecklistViewSet,
    NutritionPlanViewSet, NotificationViewSet, AIChatViewSet,
    MedicineScheduleViewSet, AppointmentViewSet,
    BloodBankViewSet, BloodInventoryViewSet, BloodDonationProgramViewSet, FundraiserViewSet,
    CareJournalViewSet, WellWishViewSet, VolunteerTaskViewSet
)

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'treatments', TreatmentEventViewSet, basename='treatment')
router.register(r'medicines', MedicineScheduleViewSet, basename='medicine')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'reports', BloodReportViewSet, basename='report')
router.register(r'events', TreatmentEventViewSet, basename='event') # keeping old one for compatibility
router.register(r'notes', DoctorNoteViewSet, basename='note')
router.register(r'checklist', ChecklistViewSet, basename='checklist')
router.register(r'nutrition', NutritionPlanViewSet, basename='nutrition')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'ai-chat', AIChatViewSet, basename='ai-chat')
router.register(r'blood-banks', BloodBankViewSet, basename='blood-bank')
router.register(r'blood-inventory', BloodInventoryViewSet, basename='blood-inventory')
router.register(r'donation-programs', BloodDonationProgramViewSet, basename='donation-program')
router.register(r'fundraisers', FundraiserViewSet, basename='fundraiser')
router.register(r'care-journals', CareJournalViewSet, basename='care-journal')
router.register(r'well-wishes', WellWishViewSet, basename='well-wish')
router.register(r'volunteer-tasks', VolunteerTaskViewSet, basename='volunteer-task')

urlpatterns = [
    path('', include(router.urls)),
]
