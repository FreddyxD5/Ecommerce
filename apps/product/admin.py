from django.contrib import admin
from apps.product.models import Product

# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'price','compare_price','quantity','sold','category')
    list_display_links = ('id','name', )
    list_filter = ('category',)
    list_editable = ('compare_price', 'price','quantity', )
    list_per_page = 25
admin.site.register(Product, ProductAdmin)