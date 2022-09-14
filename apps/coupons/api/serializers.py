from rest_framework import serializers
from apps.coupons.models import FixedPriceCoupon, PercentPriceCoupon

class FixPriceCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model =FixedPriceCoupon
        fields = ('name','discount_price',)


class PercentPriceCopuonSerializer(serializers.ModelSerializer):
    class Meta:
        model = PercentPriceCoupon
        fields = ('name','discount_percentage', )