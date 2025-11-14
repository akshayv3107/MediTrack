
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from passlib.hash import bcrypt
from ..models import db, User

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "email and password required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "user already exists"}), 409
    user = User(email=email, password_hash=bcrypt.hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "registered"}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.verify(password, user.password_hash):
        return jsonify({"message": "invalid credentials"}), 401
    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token}), 200
