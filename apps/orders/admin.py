from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin
from apps.orders.models import Order, OrderItem
# Register your models here.
class OrderResource(resources.ModelResource):
    class Meta:
        model = Order

class OrderAdmin(ImportExportActionModelAdmin):
    def has_delete_permission(self, request,obj=None):
        return False
    resource_class = OrderResource
    list_display = ('id', 'transaction_id','amount','status',)
    list_display_links = ('id', 'transaction_id', )
    list_filter = ('status',)
    list_editable = ('status', )
    list_per_page = 25


class OrderItemResource(resources.ModelResource):
    class Meta:
        model = OrderItem

class OrderItemAdmin(ImportExportActionModelAdmin):
    def has_delete_permission(self, request,obj=None):
        return False
    resource_class = OrderItemResource
    list_display = ('id', 'name','price','count', )
    list_display_links = ('id', )
    list_filter = ('price',)
    list_editable = ('price', )
    list_per_page = 25

    
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)