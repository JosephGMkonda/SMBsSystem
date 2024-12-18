from django.urls import path
from . import views

urlpatterns = [
    # Products URLs
    path('products/', views.product_list, name='product_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),

    # Sales URLs
    path('sales/', views.sales_list, name='sales_list'),
    path('sales/<int:pk>/', views.sale_detail, name='sale_detail'),

    # Loans URLs
    path('loans/', views.loan_list, name='loan_list'),
    path('loans/<int:pk>/', views.loan_detail, name='loan_details'),

    # Payments URLs
    path('payments/', views.payment_list, name='payment_list'),
    path('payments/<int:pk>/', views.payment_detail, name='payment_details'),

    # Profit-related URLs
    path('profit/daily/', views.daily_profit, name='daily_profit'),  
    path('profit/monthly/', views.monthly_profit, name='monthly_profit'), 
    path('profit/history/', views.profit_history, name='profit_history'), 
]
