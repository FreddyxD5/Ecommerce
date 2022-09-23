from math import prod
from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
from apps.product.models import Product
from apps.reviews.models import Review

from apps.reviews.api.serializers import ReviewSerializer, ReviewUpdateSerializer




class GetProductReviewsView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, productId, format=None):
        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status = status.HTTP_400_BAD_REQUEST)
        
        try:
            review = Review.objects.filter(product = product_id)
            if review:
                review = ReviewSerializer(review, many=True)
                return Response({
                    'reviews':review.data
                }, status = status.HTTP_200_OK)
            else:
                return Response({
                    'reviews':''
                }, status = status.HTTP_200_OK)

        except:
            return Response({
                'error':'There was an error with server'
            }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class GetProductReviewView(APIView):
    def get(self, request, productId, format=None):
        user = self.request.user

        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status = status.HTTP_400_BAD_REQUEST)

        if not Product.objects.filter(id=product_id).exists():
            return Response({
                'error':'There\'s no product with this ID'
                }, error = status.HTTP_404_NOT_FOUND)
        
        review = Review.objects.filter(user=user, product=product_id).first()
        if review:
            review = ReviewSerializer(review)
            return Response({
                'review':review.data
            }, status = status.HTTP_200_OK)
        return Response({
            'error':'You\'re not created a review for this item yet'
            }, status = status.HTTP_400_BAD_REQUEST)



class CreateProductReviewView(APIView):
    def post(self, request, productId):
        user = self.request.user
        data = self.request.data
        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status = status.HTTP_400_BAD_REQUEST)

        try:            
            if Product.objects.filter(id=product_id).exists():                            
                product = Product.objects.get(id=product_id)                
                if Review.objects.filter(user=user, product=product).exists():
                    return Response({
                        'error':'You\'re already created a review for this product'
                    }, status = status.HTTP_409_CONFLICT)
                else:                        
                    review = Review.objects.create(
                        user=user,
                        product = product,
                        rating = data['rating'],
                        comment = data['comment'],
                        
                        )                    
                    review = ReviewSerializer(review)                    

                    product_reviews = Review.objects.filter(product=product).order_by('-date_created')
                    product_reviews = ReviewSerializer(product_reviews, many=True)

                    return Response({
                        'review':review.data,
                        'reviews':product_reviews.data
                        }, status = status.HTTP_201_CREATED)
            else:
                return Response({
                    'error':'Product with this ID does not exists'
                }, status=status.HTTP_404_NOT_FOUND)

        except:
            return Response({
                'error':'There was an error with server'
            }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)




class UpdateProductReview(APIView):
    def put(self, request, productId, format=None):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status=status.HTTP_400_BAD_REQUEST)

          
        try:            
            data_review = ReviewUpdateSerializer(data = data)               
            if data_review.is_valid():                
                review = Review.objects.filter(
                    user= user,
                    product=data_review.validated_data['product']
                    ).update(
                    comment = data_review.validated_data['comment'],
                    rating = data_review.validated_data['rating'],
                    )                
                review = Review.objects.get(
                    user= user,
                    product=data_review.validated_data['product']
                    )
                review = ReviewSerializer(review)

                product_reviews = Review.objects.filter(
                    product=data_review.validated_data['product']
                    ).order_by('-date_created')
                product_reviews = ReviewSerializer(product_reviews, many=True)                
                return Response({
                    'review':review.data,
                    'reviews':product_reviews.data
                }, status = status.HTTP_200_OK)
            else:                    
                return Response({
                            'error':data_review.errros
                        }, status = status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'error':'There was an problem with the server'
            }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteProductReviewView(APIView):
    def delete(self, request, productId, format=None):
        user= self.request.user
        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status=status.HTTP_400_BAD_REQUEST)

        
        try:
            if Review.objects.filter(user = user, product = product_id).exists():
                Review.objects.filter(user = user, product = product_id).delete()
                reviews = Review.objects.filter(product=product_id).order_by('-date_created')
                reviews = ReviewSerializer(reviews,many=True)
                return Response({
                    'reviews':reviews.data
                }, status = status.HTTP_200_OK)
        except:
            return Response({
                'error':'There was an problem with the server'
            }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class FilterProductReviewsView(APIView):
    permissions_classes = (permissions.AllowAny, )
    def get(self, request, productId, format=None):        
        try:
            product_id = int(productId)
        except:
            return Response({
                'error':'Product ID must be an integer'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not Product.objects.filter(id=product_id).exists():
            return Response({
                'error':'This product doesn\'t exists'
            }, status = status.HTTP_404_NOT_FOUND)

        product = Product.objects.get(id = product_id)
        rating = request.query_params.get('rating')

        try:
            rating = float(rating)
        except:
            return Response({
                'error':'Rating must be a decimal value'
            }, status = status.HTTP_400_BAD_REQUEST)        
        try:
            if not rating:
                rating = 5.0
            elif rating >5.0:
                rating = 5.0
            elif rating < 0.5:
                rating = 0.5
            print(rating)
            if Review.objects.filter(product = product_id).exists():                
                if rating == 0.5:
                    reviews = Review.objects.order_by('-date_created').filter(
                        rating = rating, product=product
                    )
                else:                    
                    reviews = Review.objects.order_by('-date_created').filter(
                        rating__lte=rating,
                        product=product
                    ).filter(
                        rating__gte = (rating-0.5),
                        product = product
                    )
                
                reviews = ReviewSerializer(reviews, many=True)
                return Response({
                    'reviews':reviews.data
                }, status = status.HTTP_200_OK)

        except:
            return Response({
                'error':'There was an problem with the server'
            }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

            
        
        
