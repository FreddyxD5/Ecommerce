from django.shortcuts import render
from apps.orders.models import Order, OrderItem
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.orders.api.serializers import ListOrderSerializer, ListOrderDetailSerializer
# Create your views here.


class ListOrdersView(APIView):
    def get(self, request, format=None):        
        user = self.request.user        
        try:
            orders = Order.objects.order_by('-date_issued').filter(user=user)            
            if orders:
                orders = ListOrderSerializer(orders, many=True)
                return Response({'orders':orders.data}, status=status.HTTP_200_OK)
        except:
            return Response({
                'error':'Something went wrong when retrieving orders'
                }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListOrderDetailView(APIView):
    def get(self, request, transaction_id,format=None):
        user = self.request.user
        try:
            if Order.objects.filter(user=user, transaction_id=transaction_id).exists():                  
                order = Order.objects.filter(user=user, transaction_id= transaction_id).first()                
                order = ListOrderDetailSerializer(order)                
                return Response({
                    'order':order.data
                    }, status = status.HTTP_200_OK)
            else:
                return Response({
                    'error':'Order with this transaction ID does not exists'
                    }, status=status.HTTP_404_NOT_FOUND)

        except:
            return Response({
                'error':'Something went wrong when retrieving orders'
                }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
