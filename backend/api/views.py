from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, StudentSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Student, StudentQR, StudentAttendance
from django.shortcuts import get_object_or_404
import base64
import cv2
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.conf import settings

import io

from .utils import generate_and_save_qr_to_model, qr_scanner , uniform_scanner

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
        fullName = serializer.validated_data['firstName'] + ' ' + serializer.validated_data['middleInitial'] + '. ' + serializer.validated_data['lastName']
        user = User.objects.create_user(
        username= fullName,
        email=serializer.validated_data['email'],
        password=serializer.validated_data['password']  
        )
        Student = serializer.save(user=user)
        instance = StudentQR.objects.create(student=Student)
        generate_and_save_qr_to_model(Student.studentCode, instance, Student)
        instance.save()
        
        
        return Response(serializer.data, status=201)
        
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
        

@api_view(['POST'])
def qr_scanner_view(request):
    image_file = request.FILES.get("image")
    if not image_file:
        return Response({'error': 'No file provided'}, status=400)

    decoded_data = qr_scanner(image_file)
    if not decoded_data:
        return Response({'error': 'Invalid or unreadable QR code'}, status=400)

    student = Student.objects.filter(studentCode=decoded_data).first()
    if student:
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=200)
    else:
        return Response({'error': 'Student not found'}, status=404)
    
@api_view(['POST'])
def uniform_scanner_view(request,pk):
    
    print(request.data)
    
    student = get_object_or_404(Student, id=pk)
    if not student:
        return Response({'error': 'Student not found'}, status=404)
    
    image_file = request.FILES.get("image")
    if not image_file:
        return Response({'error': 'No file provided'}, status=400)
    
   
    image_bytes = image_file.read()
    

    frame, detectedObjects = uniform_scanner(image_file,student)
    if frame is None:
        return Response({'error': 'Failed to process image'}, status=500)

    email = EmailMessage(
        subject='Uniform Scanner Result',
        body='Detected objects: {}'.format(detectedObjects),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=['lovelypintes@gmail.com','faceless7078@gmail.com'],
    )
    email.attach('image.jpg', image_bytes, 'image/jpeg')
    email.send()
    
    _, buffer = cv2.imencode('.jpg', frame)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')

    return Response({'image': jpg_as_text, "detectedObjects": detectedObjects}, status=200)
    