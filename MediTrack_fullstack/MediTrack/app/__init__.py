
import os
from flask import Flask, jsonify
from .config import Config
from .models import db
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config())

    db.init_app(app)
    JWTManager(app)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    # Blueprints
    from .routes.auth_routes import auth_bp
    from .routes.patient_routes import patient_bp
    from .routes.vitals_routes import vitals_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(patient_bp, url_prefix="/patients")
    app.register_blueprint(vitals_bp, url_prefix="/vitals")

    with app.app_context():
        db.create_all()

    return app
