from django.contrib import admin
from apps.shipping.models import Shipping
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin
# Register your models here.
class ShippingResources(resources.ModelResource):
    class Meta:
        model = Shipping
    
class ShippingAdmin(ImportExportActionModelAdmin):
    resource_class = ShippingResources
    list_display = ('id','name','time_to_delivery','price')

admin.site.register(Shipping, ShippingAdmin)