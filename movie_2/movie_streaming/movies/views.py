from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer  # or create a separate LoginSerializer

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdminOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Movie, Genre, Category
from .serializers import MovieSerializer, MovieCreateSerializer, GenreSerializer, CategorySerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'star_cast']
    filterset_fields = ['release_date', 'genres']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MovieCreateSerializer
        return MovieSerializer

    def create(self, request, *args, **kwargs):
        print("Request Data:", request.data)  # Debug print
        print("Files:", request.FILES)  # Debug print
        
        # Handle genre_ids
        if 'genre_ids' in request.data and isinstance(request.data['genre_ids'], str):
            try:
                request.data._mutable = True
                request.data['genre_ids'] = eval(request.data['genre_ids'])
                request.data._mutable = False
            except:
                pass
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # For searching by name, year, etc., you can integrate django-filters or just do manual filtering
    def get_queryset(self):
        queryset = Movie.objects.all()
        title = self.request.query_params.get('title', None)
        year = self.request.query_params.get('year', None)
        genre = self.request.query_params.get('genre', None)
        star_cast = self.request.query_params.get('star_cast', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if year:
            queryset = queryset.filter(release_date=year)
        if genre:
            queryset = queryset.filter(genres__name__icontains=genre)
        if star_cast:
            queryset = queryset.filter(star_cast__icontains=star_cast)

        return queryset
    
    @action(detail=False, methods=['get'], url_path='grouped-by-category')
    def grouped_by_category(self, request):
        categories = Category.objects.all()
        data = {}
        for category in categories:
            movies = Movie.objects.filter(category=category)
            serializer = MovieSerializer(movies, many=True)
            data[category.name] = serializer.data
        return Response(data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

from rest_framework import viewsets, permissions, status
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(movie_id=self.kwargs['movie_id'])

    def perform_create(self, serializer):
        movie_id = self.kwargs['movie_id']
        serializer.save(user=self.request.user, movie_id=movie_id)

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


