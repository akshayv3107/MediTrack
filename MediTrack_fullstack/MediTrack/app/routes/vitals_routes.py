
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
from sqlalchemy import func
from ..models import db, Vital, Patient

vitals_bp = Blueprint("vitals_bp", __name__)

@vitals_bp.post("")
@jwt_required()
def add_vital():
    data = request.get_json() or {}
    pid = data.get("patient_id")
    if not pid or not Patient.query.get(pid):
        return jsonify({"message": "valid patient_id required"}), 400

    v = Vital(
        patient_id=pid,
        date=datetime.strptime(data.get("date"), "%Y-%m-%d").date() if data.get("date") else None,
        heart_rate=data.get("heart_rate"),
        systolic=data.get("systolic"),
        diastolic=data.get("diastolic"),
        temperature=data.get("temperature"),
        glucose=data.get("glucose"),
    )
    db.session.add(v)
    db.session.commit()
    return jsonify({"message": "created", "id": v.id}), 201

@vitals_bp.get("/<int:patient_id>")
@jwt_required()
def list_vitals(patient_id):
    start = request.args.get("start")
    end = request.args.get("end")
    q = Vital.query.filter_by(patient_id=patient_id)
    if start:
        q = q.filter(Vital.date >= datetime.strptime(start, "%Y-%m-%d").date())
    if end:
        q = q.filter(Vital.date <= datetime.strptime(end, "%Y-%m-%d").date())
    rows = q.order_by(Vital.date.desc()).all()
    return jsonify([{
        "id": r.id, "date": r.date.isoformat(),
        "heart_rate": r.heart_rate, "systolic": r.systolic, "diastolic": r.diastolic,
        "temperature": r.temperature, "glucose": r.glucose
    } for r in rows]), 200

@vitals_bp.get("/summary/<int:patient_id>")
@jwt_required()
def vitals_summary(patient_id):
    # averages
    avg_hr, avg_sys, avg_dia, avg_temp, avg_glu = db.session.query(
        func.avg(Vital.heart_rate),
        func.avg(Vital.systolic),
        func.avg(Vital.diastolic),
        func.avg(Vital.temperature),
        func.avg(Vital.glucose),
    ).filter(Vital.patient_id == patient_id).one()

    last = Vital.query.filter_by(patient_id=patient_id).order_by(Vital.date.desc()).first()
    abnormal_flags = {}
    if last:
        abnormal_flags = {
            "bp_high": (last.systolic or 0) > 140 or (last.diastolic or 0) > 90,
            "fever": (last.temperature or 0) >= 38.0,
            "tachycardia": (last.heart_rate or 0) > 100,
            "glucose_high": (last.glucose or 0) > 180
        }

    return jsonify({
        "averages": {
            "heart_rate": round(avg_hr or 0, 1),
            "systolic": round(avg_sys or 0, 1),
            "diastolic": round(avg_dia or 0, 1),
            "temperature": round(avg_temp or 0, 2),
            "glucose": round(avg_glu or 0, 1),
        },
        "last_reading": {
            "date": last.date.isoformat() if last else None,
            "heart_rate": last.heart_rate if last else None,
            "systolic": last.systolic if last else None,
            "diastolic": last.diastolic if last else None,
            "temperature": last.temperature if last else None,
            "glucose": last.glucose if last else None,
        },
        "abnormal_flags": abnormal_flags
    }), 200
