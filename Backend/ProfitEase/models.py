from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Product(models.Model):
    product_name = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # User Created the record
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.product_name

class Sales(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_sold = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    date_sold = models.DateField()

    @property
    def Profit(self):
        return self.total_amount - (self.product.cost_price * self.quantity_sold)

    def __str__(self):
        return f"{self.product.product_name} - {self.quantity_sold} sold"

@receiver(post_save, sender=Sales)
def update_total_amount_and_quantity(sender, instance, **kwargs):
    if not instance.total_amount:
        instance.total_amount = instance.product.selling_price * instance.quantity_sold
        instance.save()

    product = instance.product
    product.quantity -= instance.quantity_sold
    product.save()

class Loan(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=255)
    quantity_on_loan = models.IntegerField()
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)


    def __str__(self):
        return f"Loan to {self.customer_name} for {self.product.name}"

class Payment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Payment of {self.payment_amount} for {self.loan.customer_name}"
