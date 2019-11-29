import os

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ['SECRET_KEY']

SERVER_NAME = os.environ['SERVER_NAME']

SPOTIFY_CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
SPOTIFY_CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
