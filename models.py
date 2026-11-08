import uuid
from django.db import models
from customers.models import Customer, Delivery

class Shipment(models.Model):
    class Status(models.TextChoices):
        CREATED = "created", "Created"
        PICKUP = "pickup", "Pickup"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"
        IN_TRANSIT = "in_transit", "In transit"
        OUT_FOR_TRANSIT = "out_for_transit", "Out for transit"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    address_source = models.CharField(max_length=255)
    city_source = models.CharField(max_length=100)
    address_destination = models.CharField(max_length=255)
    city_destination = models.CharField(max_length=100)
    state_destination = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.CREATED)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="shipments")
    delivery = models.ForeignKey(Delivery, on_delete=models.SET_NULL, null=True, blank=True, related_name="shipments")

    def __str__(self):
        return f"{self.name} ({self.id})"

class Item(models.Model):
    class Type(models.TextChoices):
        ELECTRONICS = "Electronics", "Electronics"
        ELECTRICAL = "electrical", "Electrical"
        FURNITURE = "Furniture", "Furniture"
        WOOD = "wood", "Wood"
        MEDICINE = "medcine", "Medicine"
        OTHER = "etc", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name="items")
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=30, choices=Type.choices)

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)
    order_number = models.CharField(max_length=100, unique=True)
    order_date = models.DateTimeField()
    order_status = models.CharField(max_length=50)
    order_type = models.CharField(max_length=50)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="orders")
    delivery = models.ForeignKey(Delivery, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
