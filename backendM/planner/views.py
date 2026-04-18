from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .models import (
    Hospital, Patient, TreatmentEvent, BloodReport, 
    MedicationAlert, DoctorNote, ChecklistItem, NutritionPlan,
    Notification, AIChat, MedicineSchedule, Appointment
)
from .serializers import (
    HospitalSerializer, PatientSerializer, TreatmentEventSerializer,
    BloodReportSerializer, MedicationAlertSerializer, DoctorNoteSerializer,
    ChecklistItemSerializer, NutritionPlanSerializer, NotificationSerializer,
    AIChatSerializer, MedicineScheduleSerializer, AppointmentSerializer
)
from .permissions import IsDoctorOrReadOnly, MedicineUpdatePermission


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [permissions.IsAuthenticated]

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Patient.objects.filter(assigned_doctors=user) | Patient.objects.filter(id__in=user.assigned_patients.all())
        elif user.role == 'parent_patient':
            return user.children.all()
        elif user.is_staff:
            return Patient.objects.all()
        return Patient.objects.none()

    def perform_create(self, serializer):
        # By default, assign the creating doctor to the patient
        patient = serializer.save()
        if self.request.user.role == 'doctor':
            patient.assigned_doctors.add(self.request.user)

class TreatmentEventViewSet(viewsets.ModelViewSet):
    serializer_class = TreatmentEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        
        if not user.is_authenticated:
            return TreatmentEvent.objects.none()

        if user.role == 'doctor':
            qs = TreatmentEvent.objects.filter(patient__assigned_doctors=user)
        elif user.role == 'parent_patient':
            qs = TreatmentEvent.objects.filter(patient__parent=user)
        else:
            qs = TreatmentEvent.objects.all() if user.is_staff else TreatmentEvent.objects.none()

        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class BloodReportViewSet(viewsets.ModelViewSet):
    serializer_class = BloodReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        
        if not user.is_authenticated:
            return BloodReport.objects.none()

        if user.role == 'doctor':
            qs = BloodReport.objects.filter(patient__assigned_doctors=user)
        elif user.role == 'parent_patient':
            qs = BloodReport.objects.filter(patient__parent=user)
        else:
            qs = BloodReport.objects.all() if user.is_staff else BloodReport.objects.none()

        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class DoctorNoteViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            return DoctorNote.objects.filter(patient_id=patient_id)
        return DoctorNote.objects.none()

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class ChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            return ChecklistItem.objects.filter(patient_id=patient_id)
        return ChecklistItem.objects.none()

class NutritionPlanViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            return NutritionPlan.objects.filter(patient_id=patient_id)
        return NutritionPlan.objects.none()
    
    def perform_create(self, serializer):
        # Allow updating or creating based on patient
        patient_id = self.request.data.get('patient')
        NutritionPlan.objects.filter(patient_id=patient_id).delete()
        serializer.save()

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        
        if user.role == 'parent_patient':
            qs = Notification.objects.filter(patient__parent=user)
        elif user.role == 'doctor':
            qs = Notification.objects.filter(patient__assigned_doctors=user)
        else:
            qs = Notification.objects.none()
            
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs.order_by('-created_at')

    @action(detail=False, methods=['post'])
    def trigger_reminders(self, request):
        from django.utils import timezone
        from datetime import timedelta
        
        # Look for events in next 24 hours that haven't had reminders sent
        now = timezone.now()
        # To avoid timezone misses depending on local TZ, we expand search safely
        upcoming = TreatmentEvent.objects.filter(
            start_time__range=(now - timedelta(hours=1), now + timedelta(hours=48)),
            reminder_sent=False
        )
        
        count = 0
        for event in upcoming:
            Notification.objects.create(
                patient=event.patient,
                title=f"Reminder: {event.get_type_display()}",
                message=f"Upcoming {event.type}: {event.title} at {event.start_time.strftime('%H:%M')}. Please be prepared.",
                type='reminder'
            )
            event.reminder_sent = True
            event.save()
            count += 1
        from rest_framework.response import Response
        return Response({"status": "Reminders triggered", "count": count})

class AIChatViewSet(viewsets.ModelViewSet):
    serializer_class = AIChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIChat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        query = self.request.data.get('query', '').lower()
        patient_id = self.request.data.get('patient')
        
        context = ""
        diag = "a pediatric oncology condition"
        if patient_id:
            try:
                patient = Patient.objects.get(id=patient_id)
                if patient.diagnosis:
                    diag = patient.diagnosis
                    context = f"Based on the diagnosis ({patient.diagnosis}), "
                latest_report = patient.blood_reports.order_by('-uploaded_at').first()
                if latest_report:
                    context += f"and recent blood work showing a {latest_report.review_status} status, "
            except Exception:
                pass

        # Comprehensive Rule-Based AI Logic
        response = "I'm your Onco Assistant. " + context
        
        if any(word in query for word in ['what happened', 'diagnosis', 'my condition', 'what is wrong']):
            response += f"Your medical records indicate a diagnosis of {diag}. This means your care team is actively monitoring and treating this specific condition. Please consult your doctor for a detailed medical translation."
        elif any(word in query for word in ['fever', 'temp', 'hot', 'chills']):
            response += "Fever is critical. If temperature is over 100.4°F (38°C), contact your oncology team immediately. Do not give fever-reducing meds without their permission."
        elif any(word in query for word in ['pain', 'hurt', 'ache']):
            response += "Keep track of where it hurts and the pain level (1-10). If pain is new or severe, please reach out to the clinic for pain management options."
        elif any(word in query for word in ['diet', 'food', 'eat', 'nutrition']):
            response += "Focus on high-protein, calorie-rich foods. Small, frequent meals are often better than three large ones. Avoid raw honey, unpasteurized milk, and raw fish."
        elif any(word in query for word in ['nausea', 'vomit', 'sick', 'throwing up']):
            response += "Ginger tea or dry crackers can help. Ensure they stay hydrated. If vomiting is frequent, use the prescribed anti-nausea meds and inform the doctor."
        elif any(word in query for word in ['tired', 'sleep', 'fatigue', 'weak']):
            response += "Fatigue is common during treatment. Encourage rest periods between activities. Short walks can actually help improve energy levels."
        elif any(word in query for word in ['blood', 'report', 'cbc', 'level', 'count']):
            response += "I'll help you monitor counts. Look at the 'Reports' section for trends. Low ANC means higher infection risk; low platelets mean higher bleeding risk."
        elif any(word in query for word in ['hydration', 'water', 'drink', 'fluid']):
            response += "Hydration is vital to flush chemo from the body. Aim for 6-8 cups of fluids daily (water, diluted juice, or popsicles)."
        elif any(word in query for word in ['mood', 'sad', 'cry', 'scared', 'feeling']):
            response += "Emotional health is just as important as physical health. It's okay to feel scared. Many families find comfort in support groups or professional counseling."
        elif any(word in query for word in ['mouth', 'sore', 'ulcer', 'throat']):
            response += "Mouth sores can occur. Use a soft toothbrush and avoid spicy or acidic foods. Saltwater rinses (1/2 tsp salt in 1 cup water) can be soothing."
        else:
            response += "I can help with guidance on nutrition, side effects (nausea, fever, fatigue), or understanding your diagnosis. What's on your mind today?"
            
        serializer.save(user=self.request.user, response=response, patient_id=patient_id)

class MedicineScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, MedicineUpdatePermission]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        
        if not user.is_authenticated:
            return MedicineSchedule.objects.none()

        if user.role == 'doctor':
            qs = MedicineSchedule.objects.filter(patient__assigned_doctors=user)
        elif user.role == 'parent_patient':
            qs = MedicineSchedule.objects.filter(patient__parent=user)
        else:
            qs = MedicineSchedule.objects.all() if user.is_staff else MedicineSchedule.objects.none()

        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        
        if not user.is_authenticated:
            return Appointment.objects.none()

        if user.role == 'doctor':
            qs = Appointment.objects.filter(patient__assigned_doctors=user)
        elif user.role == 'parent_patient':
            qs = Appointment.objects.filter(patient__parent=user)
        else:
            qs = Appointment.objects.all() if user.is_staff else Appointment.objects.none()

        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class BloodBankViewSet(viewsets.ModelViewSet):
    from .models import BloodBank
    queryset = BloodBank.objects.all()
    from .serializers import BloodBankSerializer
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BloodInventoryViewSet(viewsets.ModelViewSet):
    from .models import BloodInventory
    queryset = BloodInventory.objects.all()
    from .serializers import BloodInventorySerializer
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        qs = super().get_queryset()
        bank_id = self.request.query_params.get('blood_bank_id')
        if bank_id:
            qs = qs.filter(blood_bank_id=bank_id)
        return qs

class BloodDonationProgramViewSet(viewsets.ModelViewSet):
    from .models import BloodDonationProgram
    queryset = BloodDonationProgram.objects.all().order_by('-date')
    from .serializers import BloodDonationProgramSerializer
    serializer_class = BloodDonationProgramSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FundraiserViewSet(viewsets.ModelViewSet):
    from .models import Fundraiser
    queryset = Fundraiser.objects.all().order_by('-created_at')
    from .serializers import FundraiserSerializer
    serializer_class = FundraiserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class CareJournalViewSet(viewsets.ModelViewSet):
    from .models import CareJournal
    queryset = CareJournal.objects.all().order_by('-created_at')
    from .serializers import CareJournalSerializer
    serializer_class = CareJournalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class WellWishViewSet(viewsets.ModelViewSet):
    from .models import WellWish
    queryset = WellWish.objects.all().order_by('-created_at')
    from .serializers import WellWishSerializer
    serializer_class = WellWishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class VolunteerTaskViewSet(viewsets.ModelViewSet):
    from .models import VolunteerTask
    queryset = VolunteerTask.objects.all().order_by('date_needed')
    from .serializers import VolunteerTaskSerializer
    serializer_class = VolunteerTaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

