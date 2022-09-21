from django.db import models
from django.conf import settings
from apps.product.models import Product

# Create your models here.
class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_item = models.IntegerField(default=0)

    def total_items(self):
        total_items = WishListItem.objects.filter(wishlist = self.id).count()
        self.total_item = total_items
        self.save()
        return total_items

    def __str__(self):
        return f"Wishlist of user: {self.user}"

class WishListItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete= models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"Item of {self.wishlist}"
