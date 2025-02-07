from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, Genre, Review, Category
from django.db.models import Avg

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    genres = GenreSerializer(many=True, read_only=True)
    has_user_reviewed = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_date', 'duration', 'genres', 'star_cast', 'cover_image', 'video', 'category', 'average_rating', 'has_user_reviewed']

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0

    def get_has_user_reviewed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.reviews.filter(user=request.user).exists()
        return False

# For creating/updating a movie (with genres)
class MovieCreateSerializer(serializers.ModelSerializer):
    genre_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False,
        allow_empty=True,
    )
    cover_image = serializers.CharField(required=False, allow_blank=True)
    video = serializers.CharField(required=False, allow_blank=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_date', 'duration', 'genre_ids', 'star_cast', 'cover_image', 'video', 'category']

    def create(self, validated_data):
        genre_ids = validated_data.pop('genre_ids', [])
        
        # Create the movie instance
        movie = Movie.objects.create(
            title=validated_data.get('title'),
            description=validated_data.get('description'),
            release_date=validated_data.get('release_date'),
            duration=validated_data.get('duration'),
            star_cast=validated_data.get('star_cast', ''),
            cover_image=validated_data.get('cover_image', ''),
            video=validated_data.get('video', ''),
            category=validated_data.get('category')
        )
        
        # Set genres
        if genre_ids:
            genres = Genre.objects.filter(id__in=genre_ids)
            movie.genres.set(genres)
        
        return movie

    def update(self, instance, validated_data):
        genre_ids = validated_data.pop('genre_ids', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if genre_ids:
            genres = Genre.objects.filter(id__in=genre_ids)
            instance.genres.set(genres)
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # or UserSerializer if you want more detail
    class Meta:
        model = Review
        fields = ['id', 'user', 'movie', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'movie', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Create user with hashed password
        user = User(
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
