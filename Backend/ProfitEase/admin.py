from django.contrib import admin
from .models import Product,Payment,Sales,Loan


admin.site.register(Product)
admin.site.register(Payment)
admin.site.register(Sales)
admin.site.register(Loan)