from rest_framework import serializers
from .models import Product, Sales, Loan, Payment, Profit
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ProductSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'cost_price', 'selling_price', 'quantity', 'total_cost', 'created_at', 'formatted_date', 'created_by']
        read_only_fields = ['total_cost']


class SalesSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    product_name = serializers.ReadOnlyField(source='product.product_name')
    selling_price = serializers.ReadOnlyField(source='product.selling_price')

    class Meta:
        model = Sales
        fields = ['id', 'product', 'product_name', 'selling_price', 'quantity_sold', 'total_amount', 'updated_at', 'created_by']
        read_only_fields = ['total_amount', 'product_name', 'selling_price']

    def validate_quantity_sold(self, value):
        product = self.instance.product if self.instance else Product.objects.get(pk=self.initial_data.get('product'))

        if value > product.quantity:
            raise serializers.ValidationError(
                f"Cannot sell {value} items. Only {product.quantity} available in stock."
            )
        return value

    def create(self, validated_data):
        product = validated_data['product']
        quantity_sold = validated_data['quantity_sold']
        validated_data['total_amount'] = product.selling_price * quantity_sold

        # Create the sale and adjust the product quantity
        sale = super().create(validated_data)
        product.quantity -= quantity_sold
        product.save()
        return sale


class LoanSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Loan
        fields = ['id', 'product', 'customer_name', 'quantity_on_loan', 'loan_amount', 'loan_date', 'due_date', 'is_paid', 'created_by']
        read_only_fields = ['loan_amount']


class PaymentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'loan', 'payment_amount', 'payment_date', 'created_by']


class ProfitSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.product_name')

    class Meta:
        model = Profit
        fields = ['id', 'product', 'product_name', 'daily_profit', 'accumulated_monthly_profit', 'date']
        read_only_fields = ['product_name', 'daily_profit', 'accumulated_monthly_profit', 'date']
