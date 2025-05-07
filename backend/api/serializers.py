from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, StudentAttendance, StudentQR

class UserSerializer(serializers.ModelSerializer):
    class Meta:
       model = User
       fields = ('id', 'username', 'email', 'password')
       extra_kwargs = {'password': {'write_only': True}}
       
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user
    
class StudentQRSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentQR
        fields = "__all__"

class StudentAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendance
        fields = ['uniform', 'status']
    
class StudentSerializer(serializers.ModelSerializer):
    studentQr = StudentQRSerializer(read_only=True)
    attendance_records = StudentAttendanceSerializer(many=True, read_only=True)
    fullName = serializers.CharField(read_only=True)
   
    class Meta:
        model = Student
        fields = '__all__'
