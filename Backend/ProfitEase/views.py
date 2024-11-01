from django.shortcuts import render
from rest_framework import status
from rest_framework.Decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator
from rest_framework.response import Response
from .models import Product, Sales, Payment,Loan
from .serializers import ProductSerializer,SalesSerializer,PaymentSerializer,LoanSerializer




@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def product_list(request):

    if request.method == 'GET':
        Product = Product.objects.filter(created_by=request.user)

        search_product = request.GET.get('search', '')
        if search_product:
            Product = Product.filter(
                product_name__icontains=search_product
            )
        
        paginator = Paginator(Product, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = ProductSerializer(page_obj, many=True)

        data = {
            'total_records': paginator.count,
            'total_pages' : paginator.num_pages,
            'current_pages' : page_obj.number,
            'records' : serializer.data
        }

        return Response(data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data, context ={'request' : request })
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_details(request, pk):

    try:
        product = Product.objects.get(pk=pk, created_by=request.user)
    except product.DoesNotExists:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        return Response(status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def sales_list(request):

    if request.method == 'GET':
        sales = Sales.objects.filter(product__created_by=request.user)

        search_sales = request.GET.get('search', '')
        if search_sales:
            sales = Sales.filter(
                product__product_name__icontains=search_sales
            )
        
        paginator = Paginator(sales, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = SalesSerializer(page_obj, many=True)

        data = {
            'total_records': paginator.count,
            'total_pages' : paginator.num_pages,
            'current_pages' : page_obj.number,
            'records' : serializer.data
        }

        return Response(data)

    elif request.method == 'POST':
        serializer = SalesSerializer(data=request.data, context ={'request' : request })
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def sales_details(request, pk):

    try:
        sales = Sales.objects.get(pk=pk, created_by=request.user)
    except Sales.DoesNotExists:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = SalesSerializer(sales)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SalesSerializer(sales, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        sales.delete()
        return Response(status=status.HTTP_400_BAD_REQUEST)



    




@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def loan_list(request):

    if request.method == 'GET':
        loan = Loan.objects.filter(created_by=request.user)

        search_loan = request.GET.get('search', '')
        if search_loan:
            loan = Loan.filter(
                customer_name__icontains=search_loan
            )
        
        paginator = Paginator(loan, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = LoanSerializer(page_obj, many=True)

        data = {
            'total_records': paginator.count,
            'total_pages' : paginator.num_pages,
            'current_pages' : page_obj.number,
            'records' : serializer.data
        }

        return Response(data)

    elif request.method == 'POST':
        serializer = LoanSerializer(data=request.data, context ={'request' : request })
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def loan_details(request, pk):

    try:
        loan = Loan.objects.get(pk=pk, created_by=request.user)
    except Sales.DoesNotExists:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        return Response(status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def payment_list(request):

    if request.method == 'GET':
        payment = Payment.objects.filter(loan__product__created_by=request.user)

        search_payment = request.GET.get('search', '')
        if search_payment:
            payment = payment.filter(
                loan__customer_name__icontains=search_payment
            )

        
        paginator = Paginator(payment, 5)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = PaymentSerializer(page_obj, many=True)

        data = {
            'total_records': paginator.count,
            'total_pages' : paginator.num_pages,
            'current_pages' : page_obj.number,
            'records' : serializer.data
        }

        return Response(data)

    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data, context ={'request' : request })
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def payment_details(request, pk):

    try:
        payment = Payment.objects.get(pk=pk, created_by=request.user)
    except Sales.DoesNotExists:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        return Response(status=status.HTTP_400_BAD_REQUEST)


