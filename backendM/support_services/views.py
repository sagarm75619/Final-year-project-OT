from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from decimal import Decimal, InvalidOperation

from .models import BloodBank, HospitalBed, Fundraiser
from .serializers import BloodBankSerializer, HospitalBedSerializer, FundraiserSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow administrators to edit and delete.
    Safe methods (GET, HEAD, OPTIONS) are allowed for any authenticated user.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class BloodBankViewSet(viewsets.ModelViewSet):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        """
        Optionally restricts the returned blood banks to a given blood group,
        by filtering against a `blood_group` query parameter in the URL.
        """
        queryset = super().get_queryset()
        blood_group = self.request.query_params.get('blood_group', None)
        if blood_group:
            queryset = queryset.filter(blood_group__iexact=blood_group)
        return queryset

class HospitalBedViewSet(viewsets.ModelViewSet):
    queryset = HospitalBed.objects.all()
    serializer_class = HospitalBedSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

class FundraiserViewSet(viewsets.ModelViewSet):
    serializer_class = FundraiserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        """
        Admins can view all fundraisers, but standard users can only view approved ones.
        """
        user = self.request.user
        if user.is_staff:
            return Fundraiser.objects.all()
        return Fundraiser.objects.filter(is_approved=True)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def donate(self, request, pk=None):
        """
        Custom endpoint to simulate donating to a fundraiser.
        """
        fundraiser = self.get_object()
        amount_str = request.data.get('amount')
        
        if not amount_str:
            return Response({'error': 'Donation amount is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            amount = Decimal(amount_str)
            if amount <= 0:
                return Response({'error': 'Donation amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)
        except InvalidOperation:
            return Response({'error': 'Invalid amount format.'}, status=status.HTTP_400_BAD_REQUEST)
            
        fundraiser.collected_amount += amount
        fundraiser.save()
        
        serializer = self.get_serializer(fundraiser)
        return Response({
            'message': 'Donation successful!',
            'fundraiser': serializer.data
        }, status=status.HTTP_200_OK)
