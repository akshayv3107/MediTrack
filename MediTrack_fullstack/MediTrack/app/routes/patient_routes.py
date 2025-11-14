
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import db, Patient

patient_bp = Blueprint("patient_bp", __name__)

@patient_bp.post("")
@jwt_required()
def create_patient():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return jsonify({"message": "name required"}), 400
    p = Patient(name=name, age=data.get("age"), gender=data.get("gender"))
    db.session.add(p)
    db.session.commit()
    return jsonify({"id": p.id, "name": p.name, "age": p.age, "gender": p.gender}), 201

@patient_bp.get("")
@jwt_required()
def list_patients():
    patients = Patient.query.order_by(Patient.id.desc()).all()
    return jsonify([{"id": p.id, "name": p.name, "age": p.age, "gender": p.gender} for p in patients]), 200

@patient_bp.get("/<int:pid>")
@jwt_required()
def get_patient(pid):
    p = Patient.query.get_or_404(pid)
    return jsonify({"id": p.id, "name": p.name, "age": p.age, "gender": p.gender}), 200

@patient_bp.patch("/<int:pid>")
@jwt_required()
def update_patient(pid):
    p = Patient.query.get_or_404(pid)
    data = request.get_json() or {}
    for field in ["name", "age", "gender"]:
        if field in data:
            setattr(p, field, data[field])
    db.session.commit()
    return jsonify({"message": "updated"}), 200

@patient_bp.delete("/<int:pid>")
@jwt_required()
def delete_patient(pid):
    p = Patient.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200
