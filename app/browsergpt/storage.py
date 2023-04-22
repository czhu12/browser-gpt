import os
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
db = SQLAlchemy()
def initialize_db(app, db):
  app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
  db.init_app(app)
  Migrate(app, db)