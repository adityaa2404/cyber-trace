"""Seed script: populates date_dim + sample data for development.

Run from backend/ directory:
    python -m app.seed
"""

import datetime
import random

from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models import (
    AlertRule,
    AttackCategory,
    AttackDim,
    DateDim,
    Department,
    IncidentFact,
    RuleType,
    Severity,
    Status,
    SystemDim,
    UserDim,
)


def seed_date_dim(db: Session) -> None:
    if db.query(DateDim).first():
        print("date_dim already seeded, skipping.")
        return
    start = datetime.date(2024, 1, 1)
    end = datetime.date(2028, 12, 31)
    day = start
    batch = []
    while day <= end:
        batch.append(
            DateDim(
                date_id=int(day.strftime("%Y%m%d")),
                full_date=day,
                day_of_week=day.isoweekday(),
                day_name=day.strftime("%A"),
                month=day.month,
                month_name=day.strftime("%B"),
                quarter=(day.month - 1) // 3 + 1,
                year=day.year,
                is_weekend=day.isoweekday() >= 6,
            )
        )
        day += datetime.timedelta(days=1)
    db.bulk_save_objects(batch)
    db.commit()
    print(f"Seeded {len(batch)} date_dim rows.")


def seed_sample_data(db: Session) -> None:
    if db.query(Department).first():
        print("Sample data already seeded, skipping.")
        return

    # Departments
    departments = [
        Department(department_name="IT Security", location="Building A, Floor 3"),
        Department(department_name="Network Operations", location="Building A, Floor 2"),
        Department(department_name="Software Engineering", location="Building B, Floor 1"),
        Department(department_name="Data Center", location="Building C"),
        Department(department_name="Executive", location="Building A, Floor 5"),
    ]
    db.add_all(departments)
    db.flush()

    # Attack categories
    categories = [
        AttackCategory(category_name="Network", description="Attacks targeting network infrastructure"),
        AttackCategory(category_name="Application", description="Attacks exploiting application vulnerabilities"),
        AttackCategory(category_name="Social Engineering", description="Human-targeted attacks"),
        AttackCategory(category_name="Malware", description="Malicious software attacks"),
        AttackCategory(category_name="Physical", description="Physical security breaches"),
    ]
    db.add_all(categories)
    db.flush()

    # Attack types
    attack_types = [
        AttackDim(attack_type_name="DDoS", category_id=categories[0].category_id),
        AttackDim(attack_type_name="Man-in-the-Middle", category_id=categories[0].category_id),
        AttackDim(attack_type_name="Port Scanning", category_id=categories[0].category_id),
        AttackDim(attack_type_name="SQL Injection", category_id=categories[1].category_id),
        AttackDim(attack_type_name="Cross-Site Scripting (XSS)", category_id=categories[1].category_id),
        AttackDim(attack_type_name="Broken Authentication", category_id=categories[1].category_id),
        AttackDim(attack_type_name="Phishing", category_id=categories[2].category_id),
        AttackDim(attack_type_name="Spear Phishing", category_id=categories[2].category_id),
        AttackDim(attack_type_name="Ransomware", category_id=categories[3].category_id),
        AttackDim(attack_type_name="Trojan", category_id=categories[3].category_id),
        AttackDim(attack_type_name="Unauthorized Access", category_id=categories[4].category_id),
    ]
    db.add_all(attack_types)
    db.flush()

    # Users
    users = [
        UserDim(name="Aditya Sharma", email="aditya@company.com", department_id=departments[0].department_id),
        UserDim(name="Priya Patel", email="priya@company.com", department_id=departments[1].department_id),
        UserDim(name="Rahul Kumar", email="rahul@company.com", department_id=departments[2].department_id),
        UserDim(name="Ananya Singh", email="ananya@company.com", department_id=departments[0].department_id),
        UserDim(name="Vikram Mehta", email="vikram@company.com", department_id=departments[3].department_id),
    ]
    db.add_all(users)
    db.flush()

    # Systems
    systems = [
        SystemDim(system_name="prod-web-server-01", system_type="Web Server", department_id=departments[2].department_id),
        SystemDim(system_name="prod-db-master", system_type="Database", department_id=departments[3].department_id),
        SystemDim(system_name="internal-mail-server", system_type="Mail Server", department_id=departments[1].department_id),
        SystemDim(system_name="firewall-edge-01", system_type="Firewall", department_id=departments[1].department_id),
        SystemDim(system_name="dev-api-gateway", system_type="API Gateway", department_id=departments[2].department_id),
        SystemDim(system_name="hr-portal", system_type="Web Application", department_id=departments[4].department_id),
        SystemDim(system_name="monitoring-grafana", system_type="Monitoring", department_id=departments[0].department_id),
    ]
    db.add_all(systems)
    db.flush()

    # Alert rules
    alert_rules = [
        AlertRule(
            rule_name="High Severity Incident",
            rule_type=RuleType.high_severity,
            is_active=True,
        ),
        AlertRule(
            rule_name="Repeated Attack on Same System",
            rule_type=RuleType.repeated_attack,
            threshold=3,
            window_minutes=1440,
            is_active=True,
        ),
    ]
    db.add_all(alert_rules)
    db.flush()

    # Sample incidents
    severities = list(Severity)
    statuses = list(Status)
    descriptions = [
        "Suspicious login attempts detected from foreign IP",
        "Unusual outbound traffic spike on port 443",
        "Failed authentication attempts exceeded threshold",
        "Potential data exfiltration detected",
        "Malicious payload found in uploaded file",
        "Brute force attack on admin panel",
        "Phishing email reported by employee",
        "Unpatched vulnerability exploited",
        "Lateral movement detected in network",
        "Anomalous database query patterns observed",
    ]

    base_date = datetime.datetime(2026, 1, 1, 8, 0, 0)
    for i in range(80):
        ts = base_date + datetime.timedelta(
            days=random.randint(0, 78),
            hours=random.randint(0, 15),
            minutes=random.randint(0, 59),
        )
        sev = random.choice(severities)
        status = random.choice(statuses)
        resp_time = random.randint(5, 480) if status in (Status.Resolved, Status.Closed) else None
        inc = IncidentFact(
            attack_type_id=random.choice(attack_types).attack_type_id,
            severity=sev,
            system_id=random.choice(systems).system_id,
            reported_by=random.choice(users).user_id,
            date_id=int(ts.strftime("%Y%m%d")),
            incident_timestamp=ts,
            response_time_minutes=resp_time,
            description=random.choice(descriptions),
            status=status,
        )
        db.add(inc)

    db.commit()
    print("Seeded 80 sample incidents + dimension data.")


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_date_dim(db)
        seed_sample_data(db)
    finally:
        db.close()
    print("Seeding complete.")


if __name__ == "__main__":
    main()
