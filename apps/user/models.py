from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from apps.cart.models import Cart

from apps.user_profile.models import UserProfile
from apps.wishlist.models import Wishlist


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        
        shopping_cart = Cart.objects.create(user=user)
        shopping_cart.save()

        user_profile = UserProfile.objects.create(user=user)
        user_profile.save()

        wishlist = Wishlist.objects.create(user=user)
        wishlist.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        user  = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=200)
    is_active=models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects=UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    def get_full_name(self):
        return self.first_name + ' '+ self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


