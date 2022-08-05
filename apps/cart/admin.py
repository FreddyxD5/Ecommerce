from django.contrib import admin
from apps.cart.models import Cart, CartItem
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin
# Register your models here.

class CartResources(resources.ModelResource):
    class Meta:
        model = Cart


class CartAdmin(ImportExportActionModelAdmin):    
    resource_class = CartResources
    list_display = ('id','user','total_item')


class CartItemResources(resources.ModelResource):
    class Meta:
        model = Cart


class CartItemAdmin(ImportExportActionModelAdmin):    
    resource_class = CartItemResources
    list_display = ('id','cart','product','count')


admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)    
