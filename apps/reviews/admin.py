from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin
from apps.reviews.models import Review
# Register your models here.
class ReviewResource(resources.ModelResource):
    class Meta:
        model = Review

class ReviewAdmin(ImportExportActionModelAdmin):
    resource_class = ReviewResource
    list_display = ('id','user', 'product','rating','comment')
    list_display_links = ('id','rating','comment' )
    list_filter = ('rating',)    
    search_fields = ('comment',)
    list_per_page = 25

admin.site.register(Review, ReviewAdmin)