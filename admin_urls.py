from django.urls import path
from .views import AdminProfileCreateView, AdminProfileListView

urlpatterns = [
    path("getalladmin", AdminProfileListView.as_view(), name="admin-list"),
    path("add/admin", AdminProfileCreateView.as_view(), name="admin-create"),
]
