from django.urls import path
from apps.payment.views import ProcessPaymentView, GenerateTokenView, GetPaymentTotalView

urlpatterns = [
    path('get-token',GenerateTokenView.as_view()),
    path('get-total-payment',GetPaymentTotalView.as_view()),
    path('make-payment',ProcessPaymentView.as_view()),
]
