from django.urls import path 
from apps.shipping.views import GetShippingView
app_name = "shipping"

urlpatterns = [    
    path('get-shipping-options',GetShippingView.as_view(), name='shipping_options'),
]

