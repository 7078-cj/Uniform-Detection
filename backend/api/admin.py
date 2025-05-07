from django.contrib import admin
from .models import Student, StudentQR, StudentAttendance

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('fullName', 'studentCode', 'email', 'course', 'year_level', 'created')
    search_fields = ('firstName', 'lastName', 'studentCode', 'email')
    list_filter = ('course', 'year_level')

@admin.register(StudentQR)
class StudentQRAdmin(admin.ModelAdmin):
    list_display = ('student', 'qr_code', 'created', 'updated')
    search_fields = ('student__firstName', 'student__lastName', 'student__studentCode')
    list_filter = ('created', 'updated')

@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'uniform', 'status', 'created')
    search_fields = ('student__firstName', 'student__lastName', 'student__studentCode')
    list_filter = ('uniform', 'status', 'created')
    date_hierarchy = 'created'