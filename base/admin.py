from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['_id','user', 'name', 'brand', 'rating', 'category', 'price', 'countInStock', 'numReviews']
    list_filter = ['user', 'name', 'brand', 'rating']
    list_editable = ['price', 'category', 'countInStock']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display =['_id','user','paymentMethod', 'isDelivered', 'isPaid', 'deliveredAt', 'taxPrice', 'totalPrice', 'createdAt']
    list_editable = ['totalPrice', 'isDelivered', 'taxPrice','paymentMethod']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display =['_id','product', 'order', 'name', 'qty', 'price']
    list_editable = ['qty', 'name']

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ['_id', 'order', 'city', 'postalCode', 'country', 'shippingPrice']
    list_editable = ['order', 'city', 'postalCode', 'country', 'shippingPrice']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['_id', 'product', 'name', 'rating']