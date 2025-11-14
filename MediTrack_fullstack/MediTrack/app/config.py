
import os
from datetime import timedelta

class Config:
    def __init__(self):
        self.SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
        self.SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///meditrack.db")
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.JWT_SECRET_KEY = self.SECRET_KEY
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
