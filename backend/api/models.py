from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Student(models.Model):
    firstName = models.CharField(max_length=50)
    middleInitial = models.CharField(max_length=3)
    lastName = models.CharField(max_length=50)
    studentCode = models.CharField(max_length=10)
    email = models.EmailField()
    password = models.CharField(max_length=20)
    course = models.CharField(max_length=20)
    year_level = models.IntegerField()
    update = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    role = "Student"
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="studentAccount", null=True, blank=True)
    
    @property
    def fullName(self):
        return f'{self.firstName} {self.middleInitial}. {self.lastName}'

class StudentQR(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="studentQr")
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    
class StudentAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    uniform = models.CharField(max_length=11, choices=[('Complete', 'Complete'), ('Incomeplete', 'Incomplete')])
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class StudentLogs(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="student_logs")
    log_type = models.CharField(max_length=10, choices=[('IN', 'IN'), ('OUT', 'OUT')])
    log_type = models.CharField(max_length=20, choices=[('CU', 'Complete Uniform'), ('IU', 'Incomplete Uniform')])
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)