from django.urls import path
from apps.reviews.views import (
    GetProductReviewView,GetProductReviewsView, CreateProductReviewView,
    UpdateProductReview, DeleteProductReviewView, FilterProductReviewsView
    )

urlpatterns = [
    path('filter_reviews/<productId>',FilterProductReviewsView.as_view()),
    path('get_review/<productId>',GetProductReviewView.as_view()),
    path('get_reviews/<productId>',GetProductReviewsView.as_view()),
    path('add_review/<productId>',CreateProductReviewView.as_view()),
    path('update_review/<productId>', UpdateProductReview.as_view()),
    path('remove_review/<productId>',DeleteProductReviewView.as_view()),
   
]
