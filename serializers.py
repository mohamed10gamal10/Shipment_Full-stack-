from rest_framework import serializers
from .models import Shipment, Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("id", "description", "quantity", "price", "name", "type")
        read_only_fields = ("id",)

class ShipmentSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, required=False)
    customer_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Shipment
        fields = (
            "id", "name", "description", "address_source", "city_source",
            "address_destination", "city_destination", "state_destination",
            "created_at", "updated_at", "status", "items", "customer_id",
        )
        read_only_fields = ("id", "created_at", "updated_at", "status")

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        validated_data.pop("customer_id", None)
        shipment = Shipment.objects.create(**validated_data)
        for item_data in items_data:
            Item.objects.create(shipment=shipment, **item_data)
        return shipment
