from django.urls import path 
from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name="product-delete"),
    path('upload/', views.uploadImage, name="image-upload"),

    path('<str:product_key>/review/', views.createProductReview, name="create-review"),
    path('top/', views.getTopProducts, name="top-products"),
    path('<str:pk>/', views.getProduct, name="product"),

    path('update/<str:id>/', views.updateProduct, name="product-update"),
    path('delete/<str:id>/', views.deleteProduct, name="product-delete"),

]

