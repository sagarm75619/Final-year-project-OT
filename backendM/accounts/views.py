from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


from rest_framework import generics
from .serializers import RegisterSerializer
from .models import CustomUser as User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == 'PATCH':
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.age = request.data.get('age', user.age)
        user.gender = request.data.get('gender', user.gender)
        user.weight = request.data.get('weight', user.weight)
        user.height = request.data.get('height', user.height)
        user.experience = request.data.get('experience', user.experience)
        user.degree = request.data.get('degree', user.degree)
        user.achievements = request.data.get('achievements', user.achievements)
        user.save()
        return Response({"message": "Profile updated successfully"})
        
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'age': user.age,
        'gender': user.gender,
        'weight': user.weight,
        'height': user.height,
        'experience': user.experience,
        'degree': user.degree,
        'achievements': user.achievements,
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    if request.user.role != 'doctor' and not request.user.is_staff:
        return Response({"error": "Unauthorized"}, status=403)
    
    from .models import CustomUser
    users = CustomUser.objects.filter(role='parent_patient')
    data = [{'id': u.id, 'username': u.username, 'email': u.email} for u in users]
    return Response(data)