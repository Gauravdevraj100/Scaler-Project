"""
URL configuration for movie_streaming project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from movies.views import (
    SignupView,
    LoginView,
    MovieViewSet,
    ReviewViewSet,
    GenreViewSet,
    CategoryViewSet
)

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')
router.register('genres', GenreViewSet, basename='genre')
router.register('categories', CategoryViewSet, basename='category')
# If you want nested routes for reviews, see DRF nested routers or define your own.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
    path('movies/<int:movie_id>/reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='movie-reviews'),
]

