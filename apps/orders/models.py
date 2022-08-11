from pickletools import decimalnl_long
from random import choices
from django.db import models
from datetime import datetime
from apps.product.models import Product
from apps.orders.countries import Countries
from django.contrib.auth import get_user_model

user = get_user_model()

# Create your models here.
class Order(models.Model):
    class OrderStatus(models.TextChoices):
        not_processed = 'not_processed'
        processed = 'processed'
        shipping='shipping'
        delivered='delivered'
        cancelled='cancelled'
    
    status = models.CharField(
        max_length=50, choices=OrderStatus.choices, default=OrderStatus.not_processed
    )
    user = models.ForeignKey(user, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    full_name = models.CharField(max_length=255)
    address_line_1 = models.TextField(blank=True)
    address_line_2 = models.TextField(blank=True)
    city = models.CharField(max_length=255, blank=True)
    state_province_region = models.CharField(max_length=255, blank=True)
    postal_zip_code = models.CharField(max_length=20)
    country_region = models.CharField(
        max_length =100, choices= Countries.choices, default=Countries.Peru)
    telephone_number = models.CharField(max_length=15)
    shipping_name = models.CharField(max_length=255)
    shipping_time = models.CharField(max_length=100)
    shipping_price = models.DecimalField(max_digits=5, decimal_places=2) 
    date_issued = models.DateTimeField(default=datetime.now) 

    def __str__(self):
        return self.transaction_id


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    count = models.IntegerField()
    date_added = models.DateTimeField(default = datetime.now)

    def __str__(self):
        return self.name

