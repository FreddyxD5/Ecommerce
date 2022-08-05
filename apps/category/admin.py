from django.contrib import admin
from apps.category.models import Category
from import_export import resources
from import_export.admin import ImportExportModelAdmin

class CategoryResources(resources.ModelResource):
    class Meta:
        model=Category

# Register your models here.
class CategoryAdmin(ImportExportModelAdmin):
    resource_class = CategoryResources
    list_display = ('id', 'name', 'parent')
    list_display_links = ('id', 'name','parent')
    search_fields = ('name', 'parent')
    list_per_page = 25
    
admin.site.register(Category, CategoryAdmin)