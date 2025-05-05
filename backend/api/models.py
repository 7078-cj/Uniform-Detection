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