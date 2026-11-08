from rest_framework.permissions import BasePermission, SAFE_METHODS

class ShipmentPermission(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin" or obj.customer.user_id == request.user.id
