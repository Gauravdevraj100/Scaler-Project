from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from django.db.models import Avg

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, null=False)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_date = models.DateField()
    duration = models.PositiveIntegerField()
    genres = models.ManyToManyField(Genre, related_name='movies')
    star_cast = models.TextField(blank=True, help_text="Comma-separated list of cast members")
    # Add the cover image field
    cover_image = models.CharField(max_length=255, blank=True, null=True)
    # Cloudinary video field
    video = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='movies')

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        return self.reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()  # or use FloatField
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # A user can leave only one rating per movie

    def __str__(self):
        return f"{self.movie.title} - {self.rating} by {self.user.username}"
