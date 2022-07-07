from django.urls import path 
from base.views import user_views as views

urlpatterns =[
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'), 
    path('profile/', views.getUserProfile, name='user_profile'),
    path('profile/update/', views.updateUserProfile, name='update_user_profile'),

    path('<str:id>/', views.adminGetUserById, name="get-user"),
    path('update/<str:id>/', views.adminUpdateUser, name="update-user"),
    path('delete/<str:id>/', views.deleteUser, name="delete-user"),
    path('', views.getUsers, name="get_users"),
]

