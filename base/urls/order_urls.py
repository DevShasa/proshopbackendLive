from django.urls import path 
from base.views import order_views as views

urlpatterns = [
    path('', views.adminGetOrders, name="order-all"),
    path('add/', views.addOrderItems, name="order-add"),
    path('myorders/', views.getMyOrders, name="myorders"),
    path('<str:id>/deliver/', views.updateOrderToDelivered, name="pay"),
    path('<str:id>/', views.getOrderById, name="get-product"),
    path('<str:pk>/pay/', views.updateOrderToPaid, name="pay"),
]