from django.db import transaction
from rest_framework.exceptions import PermissionDenied, NotFound
from customers.models import Customer
from .models import Shipment

@transaction.atomic
def create_shipment_for_user(user, validated_data):
    try:
        customer = Customer.objects.select_for_update().get(user=user)
    except Customer.DoesNotExist:
        raise PermissionDenied("Create your customer profile before creating a shipment.")
    validated_data["customer"] = customer
    return Shipment.objects.create(**validated_data)

def get_shipment(shipment_id, user):
    try:
        shipment = Shipment.objects.select_related("customer", "delivery").prefetch_related("items").get(pk=shipment_id)
    except Shipment.DoesNotExist:
        raise NotFound("Shipment not found.")
    if user.role != "admin" and shipment.customer.user_id != user.id:
        raise PermissionDenied("You can only access your own shipments.")
    return shipment
