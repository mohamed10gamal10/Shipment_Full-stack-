from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Shipment, Item
from .serializers import ShipmentSerializer
from .services import create_shipment_for_user, get_shipment

class ShipmentListCreateView(generics.ListCreateAPIView):
    serializer_class = ShipmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Shipment.objects.select_related("customer", "delivery").prefetch_related("items").order_by("-created_at")
        if self.request.user.role != "admin":
            qs = qs.filter(customer__user=self.request.user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.validated_data)
        data.pop("customer_id", None)
        items = data.pop("items", [])
        with transaction.atomic():
            shipment = create_shipment_for_user(request.user, data)
            for item in items:
                Item.objects.create(shipment=shipment, **item)
        shipment = get_shipment(shipment.pk, request.user)
        # Return the saved shipment (with id/status/items) so the frontend can show it.
        return Response(ShipmentSerializer(shipment).data, status=201)

class ShipmentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, shipment_id):
        shipment = get_shipment(shipment_id, request.user)
        return Response(ShipmentSerializer(shipment).data)
