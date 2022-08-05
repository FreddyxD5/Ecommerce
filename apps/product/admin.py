from django.contrib import admin
from apps.product.models import Product
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin

# Register your models here.
class ProductResource(resources.ModelResource):
    class Meta:
        model = Product

class ProductAdmin(ImportExportActionModelAdmin):
    resource_class = ProductResource
    list_display = ('id','name', 'price','compare_price','quantity','sold','category')
    list_display_links = ('id','name', )
    list_filter = ('category',)
    list_editable = ('compare_price', 'price','quantity', )
    list_per_page = 25

admin.site.register(Product, ProductAdmin)