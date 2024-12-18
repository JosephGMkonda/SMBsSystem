from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime
from calendar import monthrange
from .models import Product, Sales, Payment, Loan, Profit
from .serializers import ProductSerializer, SalesSerializer, PaymentSerializer, LoanSerializer, ProfitSerializer


# Product Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.filter(created_by=request.user)

        search_product = request.GET.get('search', '')
        if search_product:
            products = products.filter(product_name__icontains=search_product)

        paginator = Paginator(products, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = ProductSerializer(page_obj, many=True)
        data = {
            'total_records': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'records': serializer.data
        }
        return Response(data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk, created_by=request.user)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Sales Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sales_list(request):
    if request.method == 'GET':
        sales = Sales.objects.filter(product__created_by=request.user)

        search_sales = request.GET.get('search', '')
        if search_sales:
            sales = sales.filter(product__product_name__icontains=search_sales)

        paginator = Paginator(sales, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = SalesSerializer(page_obj, many=True)
        data = {
            'total_records': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'records': serializer.data
        }
        return Response(data)

    elif request.method == 'POST':
        serializer = SalesSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def sale_detail(request, pk):
    sale = get_object_or_404(Sales, pk=pk, created_by=request.user)

    if request.method == 'GET':
        serializer = SalesSerializer(sale)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SalesSerializer(sale, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        sale.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Loan Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def loan_list(request):
    if request.method == 'GET':
        loans = Loan.objects.filter(created_by=request.user)

        search_loan = request.GET.get('search', '')
        if search_loan:
            loans = loans.filter(customer_name__icontains=search_loan)

        paginator = Paginator(loans, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = LoanSerializer(page_obj, many=True)
        data = {
            'total_records': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'records': serializer.data
        }
        return Response(data)

    elif request.method == 'POST':
        serializer = LoanSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def loan_detail(request, pk):
    loan = get_object_or_404(Loan, pk=pk, created_by=request.user)

    if request.method == 'GET':
        serializer = LoanSerializer(loan)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = LoanSerializer(loan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        loan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Payment Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def payment_list(request):
    if request.method == 'GET':
        payments = Payment.objects.filter(loan__product__created_by=request.user)

        search_payment = request.GET.get('search', '')
        if search_payment:
            payments = payments.filter(loan__customer_name__icontains=search_payment)

        paginator = Paginator(payments, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = PaymentSerializer(page_obj, many=True)
        data = {
            'total_records': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'records': serializer.data
        }
        return Response(data)

    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def payment_detail(request, pk):
    payment = get_object_or_404(Payment, pk=pk, created_by=request.user)

    if request.method == 'GET':
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_profit(request):
    
    today = datetime.now().date()

    
    profit_entries = Profit.objects.filter(date=today, product__created_by=request.user)

    
    serializer = ProfitSerializer(profit_entries, many=True)

    
    total_daily_profit = profit_entries.aggregate(
        total=Sum('daily_profit')
    )['total'] or 0.00

    data = {
        'date': today,
        'total_daily_profit': total_daily_profit,
        'details': serializer.data,
    }
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_profit(request):
    
    today = datetime.now().date()
    first_day_of_month = today.replace(day=1)

    
    profit_entries = Profit.objects.filter(
        date__range=(first_day_of_month, today),
        product__created_by=request.user,
    )

    
    serializer = ProfitSerializer(profit_entries, many=True)

    
    total_monthly_profit = profit_entries.aggregate(
        total=Sum('daily_profit')
    )['total'] or 0.00

    data = {
        'month': today.strftime('%B %Y'),
        'total_monthly_profit': total_monthly_profit,
        'details': serializer.data,
    }
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profit_history(request):

    profit_entries = Profit.objects.filter(
        product__created_by=request.user
    ).order_by('-date')

    
    serializer = ProfitSerializer(profit_entries, many=True)

    data = {
        'profit_history': serializer.data
    }
    return Response(data)