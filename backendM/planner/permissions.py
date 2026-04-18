from rest_framework import permissions

class IsDoctorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Admin has full access
        if request.user.is_staff:
            return True
            
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Let parents patch events (e.g. mark medicine taken)
        if request.user.role == 'parent_patient' and request.method in ['PATCH', 'PUT']:
            return True
            
        return request.user.role == 'doctor'

class IsParentOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.is_staff:
            return True
            
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return request.user.role == 'parent_patient'

class MedicineUpdatePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_staff:
            return True
        if request.user.role == 'doctor':
            return True
        
        # Parent can only update taken status (handled in view typically, but allow PATCH)
        if request.user.role == 'parent_patient' and request.method in ['PATCH', 'PUT']:
            return True
            
        return False
