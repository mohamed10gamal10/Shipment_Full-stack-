from django.urls import path
from .views import ShipmentListCreateView, ShipmentDetailView

urlpatterns = [
    path("add", ShipmentListCreateView.as_view(), name="shipment-create"),
    path("Get", ShipmentListCreateView.as_view(), name="shipment-list"),
    path("<uuid:shipment_id>", ShipmentDetailView.as_view(), name="shipment-detail"),
]
