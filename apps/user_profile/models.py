from django.db import models
# Create your models here.
from apps.orders.countries import Countries
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    address_line_1 = models.CharField(max_length=255, default='')
    address_line_2 = models.CharField(max_length=255, default='')
    city = models.CharField(max_length=255, default='')
    state_province_region = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=20)
    phone = models.CharField(max_length=255, default='')
    country_region = models.CharField(
        max_length=255, choices =Countries.choices, default = Countries.Canada
    )

    def __str__(self):
        return self.user.first_name

