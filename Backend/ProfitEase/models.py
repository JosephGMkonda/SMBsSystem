from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime


class Product(models.Model):
    product_name = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # User Created the record
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    @property
    def total_cost(self):
        return self.selling_price * self.quantity
    @property
    def formatted_date(self):
        return self.updated_at.date()
    
    

    def __str__(self):
        return self.product_name

class Sales(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_sold = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    # User Created the record
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Calculate total_amount
        if self.quantity_sold and self.product:
            self.total_amount = self.product.selling_price * self.quantity_sold

        # Ensure enough stock
        if self.product.quantity < self.quantity_sold:
            raise ValueError(f"Insufficient stock for {self.product.product_name}. Only {self.product.quantity} available.")
        
        super().save(*args, **kwargs)

        # Calculate profit for this sale
        sale_profit = self.total_amount - (self.product.cost_price * self.quantity_sold)

        # Update stock quantity
        self.product.quantity -= self.quantity_sold
        self.product.save()

        # Update daily profit in the Profit model
        today = datetime.now().date()
        profit_entry, created = Profit.objects.get_or_create(
            date=today,
            product=self.product,
            defaults={"daily_profit": 0.00, "accumulated_monthly_profit": 0.00},
        )
        profit_entry.daily_profit += sale_profit

        # Calculate accumulated monthly profit
        first_day_of_month = today.replace(day=1)
        monthly_profit = Profit.objects.filter(
            product=self.product,
            date__gte=first_day_of_month,
            date__lte=today
        ).aggregate(total=models.Sum("daily_profit"))["total"] or 0.00

        profit_entry.accumulated_monthly_profit = monthly_profit
        profit_entry.save()

    @property
    def profit(self):
        return self.total_amount - (self.product.cost_price * self.quantity_sold)

    def __str__(self):
        return f"{self.product.product_name} - {self.quantity_sold} sold"

    
class Profit(models.Model):
    date = models.DateField(auto_now_add=True)  
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    daily_profit = models.DecimalField(max_digits=10, decimal_places=2)  
    accumulated_monthly_profit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  

    def __str__(self):
        return f"Profit for {self.product.product_name} on {self.date}: {self.daily_profit}"




class Loan(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=255)
    quantity_on_loan = models.IntegerField()
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)

    # User Created the record
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.loan_amount:
            self.loan_amount = self.product.selling_price * self.quantity_on_loan
        super().save(*args, **kwargs)


    def __str__(self):
        return f"Loan to {self.customer_name} for {self.product.product_name}"

class Payment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)

    # User Created the record
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Payment of {self.payment_amount} for {self.loan.customer_name}"
