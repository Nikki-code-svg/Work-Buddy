# Standard library imports

# Remote library imports
import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import cloudinary
import cloudinary.uploader
import logging

# Load environment variables
load_dotenv()

# Instantiate app, set attributes
app = Flask(__name__)

# app.config["UPLOAD_EXTENSIONS"] = [".jpg", ".png", ".jpeg", ".heic"]  # Fixed .jpeg typo
# app.config["UPLOAD_PATH"] = "image_uploads"

app.secret_key = os.environ.get('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


# Add Cloudinary configuration
app.config['CLOUDINARY_URL'] = os.environ.get('CLOUDINARY_URL')
app.config['CLOUDINARY_API_KEY'] = os.environ.get('api_key')
app.config['CLOUDINARY_API_SECRET'] = os.environ.get('api_secret')

cloudinary.config(
  cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
  api_key=os.environ.get('api_key'),
  api_secret=os.environ.get('api_secret')
 

)
# Set up logging configuration
logging.basicConfig(level=logging.DEBUG)

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)  # Initialize db with app

# Initialize Migrate with app and db
migrate = Migrate(app, db)

# Instantiate Bcrypt and initialize with app
bcrypt = Bcrypt(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)
