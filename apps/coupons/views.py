from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import FixedPriceCoupon, PercentPriceCoupon
from apps.coupons.api.serializers import FixPriceCouponSerializer, PercentPriceCopuonSerializer

# Create your views here.

class CheckCouponView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        print(user)
        try:
            coupon_name = request.query_params.get('coupon_name')
            if FixedPriceCoupon.objects.filter(name=coupon_name).exists():
                coupon = FixedPriceCoupon.objects.get(name = coupon_name)
                coupon = FixPriceCouponSerializer(coupon)
                return Response({
                    'coupon':coupon.data
                }, status=status.HTTP_200_OK)

            elif PercentPriceCoupon.objects.filter(name=coupon_name).exists():
                coupon = PercentPriceCoupon.objects.get(name=coupon_name)
                coupon = PercentPriceCopuonSerializer(coupon)
                return Response({
                    'coupon':coupon.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error':'Coupon code not found'
                }, status = status.HTTP_404_NOT_FOUND)
            
        except:
            return Response({
                'error':'smtg went wrong with the server'
                }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

