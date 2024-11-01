from rest_framework import serializers
from .models import Product, Sales, Loan, Payment
from django.contrib.auth.models import User



class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username']



class ProductSerializer(serializers.ModelSerializer):
    created_by = UserSerializers(read_only=True)
    class Meta:
        model = Product

        fields = ['id','product_name', ' cost_price', 'selling_price ', ' quantity', ' created_at', 'updated_at', 'created_by']

class SalesSerializer(serializers.ModelSerializer):
    created_by = UserSerializers(read_only=True)

    class Meta:
        model = Sales
        fields = ['id','product','quantity_sold','total_amount','date_sold']

    def validate_quantity_sold(self, value):
        product = self.instance.product if self.instance else self.initial_data.get('product')
        product_obj = Product.objects.get(pk=product)


        if value > product_obj.quantity: 
            raise serializers.ValidationError(
                f"Cannot sell {value} items. Only {product_obj.quantity} available in stock."
            )
        return value

    def create(self, validated_data):
        product = validated_data['product']
        quantity_sold = validated_data['quantity_data']
        validated_data['total_amount'] = product.selling_price * quantity_sold

        sale = super().create(validated_data)

        product.quantity -= quantity_sold
        product.save()

        return sale

class LoanSerializer(serializers.ModelSerializer):
    created_by = UserSerializers()
    class Meta:
        model = Loan

        fields = ['id', ' product','customer_name','quantity_on_loan', 'loan_amount','loan_date','due_date','is_paid']

class PaymentSerializer(serializers.ModelSerializer):
    created_by = UserSerializers()

    class Meta:
        model = Payment
        fields = ['id','loan', 'payment_amount', 'payment_date']