Django Project
This is a Django project that can be set up and run locally by following the steps below.

🚀 Getting Started
1️⃣ Clone the Repository
```bash
git clone https://github.com/Mekdeskebede/Movie-Stream.git
cd movie_2/movie_streaming
```
2️⃣ Create and Activate Virtual Environment
Ensure Python 3 is installed, then create and activate a virtual environment:

# On macOS and Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

# On Windows
```bash
python -m venv venv
venv\Scripts\activate
```
3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

4️⃣ Set Up the Database
Apply migrations:
``` bash
python manage.py migrate
```
5️⃣ Create a Superuser (Optional)
If you need admin access, create a superuser:
```bash
python manage.py createsuperuser
```

Follow the prompts to set up login credentials.
6️⃣ Running the Application Start the development server:

```bash
python manage.py runserver
```

The application will be available at http://127.0.0.1:8000.