from django.urls import path
from .views import UpdateUserProfileView, getUserProfileView
urlpatterns = [
    path('user_profile',getUserProfileView.as_view()),
    path('update', UpdateUserProfileView.as_view())
]
