from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BloodBankViewSet, HospitalBedViewSet, FundraiserViewSet

router = DefaultRouter()
router.register(r'bloodbanks', BloodBankViewSet, basename='bloodbank')
router.register(r'hospitalbeds', HospitalBedViewSet, basename='hospitalbed')
router.register(r'fundraisers', FundraiserViewSet, basename='fundraiser')

urlpatterns = [
    path('', include(router.urls)),
]
