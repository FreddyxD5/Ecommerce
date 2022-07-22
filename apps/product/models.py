from datetime import datetime
from unicodedata import decimal
from django.db import models
from apps.category.models import Category
# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='photos/%Y/%m/')
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    compare_price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=datetime.now())
    sold = models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
