from django.urls import path
from .views import UpdateUserProfileView, getUserProfileView
urlpatterns = [
    path('profile',getUserProfileView.as_view()),
    path('update', UpdateUserProfileView.as_view())
]
