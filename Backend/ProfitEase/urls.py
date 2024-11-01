from django.urls import path
from . import views

urlpatterns = [
    # Products urls
    path('products/', views.product_list, name='product_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),

    # sales urls
    path('sales/', views.sales_list, name='sales_list'),
    path('sales/<int:pk>/', views.sale_detail, name='sale_detail'),

    # loan urls
    path('loan', views.loan_list, name='loan_list'),
    path('loan/<int:pk>/', views.loan_details, name='loan_details'),

    # payment
    path('payment', views.payment_list, name='payment_list'),
    path('payment/<int:pk>/', views.payment_details, name='payment_details'),
]
