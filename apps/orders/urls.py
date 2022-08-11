from django.urls import path
from apps.orders.views import ListOrderDetailView, ListOrdersView

urlpatterns = [
    path('get-orders',ListOrdersView.as_view()),
    path('get-order/<transaction_id>', ListOrderDetailView.as_view())

]
