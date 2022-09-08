from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin

from apps.coupons.models import FixedPriceCoupon, PercentPriceCoupon

# Register your models here.

class FixedPriceCouponResources(resources.ModelResource):
    class Meta:
        model = FixedPriceCoupon

class FixedPriceCouponAdmin(ImportExportActionModelAdmin):
    resource_class = FixedPriceCouponResources
    list_display = ('id','name','discount_price',)  
    list_editable = ('discount_price', )
    list_display_links = ('name',)
    search_fields = ('name', )
    list_per_page=25

class PercentPriceCouponResources(resources.ModelResource):
    class Meta:
        model = PercentPriceCoupon


class PercentPriceCouponAdmin(ImportExportActionModelAdmin):
    resource_class = PercentPriceCouponResources
    list_display = ('id','name','discount_percentage', )
    list_editable = ('discount_percentage', )
    list_display_links = ('name',)
    search_fields = ('name', )
    list_per_page = 25


admin.site.register(FixedPriceCoupon, FixedPriceCouponAdmin)
admin.site.register(PercentPriceCoupon, PercentPriceCouponAdmin)