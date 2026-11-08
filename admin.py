from django.contrib import admin
from .models import Shipment, Item, Order
admin.site.register(Shipment)
admin.site.register(Item)
admin.site.register(Order)
