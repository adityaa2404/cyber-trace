import datetime

from sqlalchemy.orm import Session

from app.models.alert import AlertLog, AlertRule, RuleType
from app.models.incident_fact import IncidentFact, Severity


def evaluate_alerts(db: Session, incident: IncidentFact) -> None:
    rules = db.query(AlertRule).filter(AlertRule.is_active == True).all()  # noqa: E712
    for rule in rules:
        if rule.rule_type == RuleType.high_severity:
            _check_high_severity(db, rule, incident)
        elif rule.rule_type == RuleType.repeated_attack:
            _check_repeated_attack(db, rule, incident)


def _check_high_severity(db: Session, rule: AlertRule, incident: IncidentFact) -> None:
    if incident.severity in (Severity.High, Severity.Critical):
        system_name = incident.system.system_name if incident.system else "Unknown"
        log = AlertLog(
            rule_id=rule.rule_id,
            incident_id=incident.incident_id,
            message=f"{incident.severity.value} severity incident #{incident.incident_id} on {system_name}",
        )
        db.add(log)
        db.commit()


def _check_repeated_attack(db: Session, rule: AlertRule, incident: IncidentFact) -> None:
    threshold = rule.threshold or 3
    window = rule.window_minutes or 1440
    cutoff = datetime.datetime.now() - datetime.timedelta(minutes=window)
    count = (
        db.query(IncidentFact)
        .filter(
            IncidentFact.attack_type_id == incident.attack_type_id,
            IncidentFact.system_id == incident.system_id,
            IncidentFact.incident_timestamp >= cutoff,
        )
        .count()
    )
    if count >= threshold:
        attack_name = incident.attack_type.attack_type_name if incident.attack_type else "Unknown"
        system_name = incident.system.system_name if incident.system else "Unknown"
        log = AlertLog(
            rule_id=rule.rule_id,
            incident_id=incident.incident_id,
            message=f"Repeated attack: {attack_name} on {system_name} ({count} times in {window} min)",
        )
        db.add(log)
        db.commit()
