from django.shortcuts import render
from apps.shipping.models import Shipping
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from apps.shipping.api.serializers import ShippingSerializer

# Create your views here.
class GetShippingView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, format=None):
        if Shipping.objects.all().exists():
            shipping_options = Shipping.objects.order_by('price').all()
            shipping_options = ShippingSerializer(shipping_options, many=True)

            return Response({
                'shipping_options':shipping_options.data
                }, status = status.HTTP_200_OK)

        else:
            return Response({
                'error':'No Shipping options available'
                }, status = status.HTTP_404_NOT_FOUND)