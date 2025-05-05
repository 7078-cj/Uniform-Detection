from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, StudentSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Student
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

# Create your views here.


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        try:
            student = self.user.studentAccount
            data['role'] = 'Student'
            data['student'] = {
                'id': student.id,
                'fullName': student.fullName,
                'email': student.email,
                'course': student.course,
                'year_level': student.year_level,
            }
        except Student.DoesNotExist:
            data['role'] = 'Admin'
            data['admin'] = {
                'id': self.user.id,
                'username': self.user.username,
                'email': self.user.email,
            }

        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['POST'])
def registerUser(request):
     if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            return Response({'message': 'User registered successfully'})
        return Response(serializer.errors, status=400)

class StudentView(ListCreateAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        return Student.objects.all().order_by('-created', '-update')  

    def perform_create(self, serializer):
        
        user = User.objects.create_user(
        username=serializer.validated_data['fullName'],
        email=serializer.validated_data['email'],
        password=serializer.validated_data['password']  
        )

        
        serializer.save(user=user)
        
class StudentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def get_object(self):
        student_id = self.kwargs.get("pk")
        return get_object_or_404(Student, id=student_id)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()