from fastapi import FastAPI, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

from backend.app.models import (
    AnalyzeComplaintRequest,
    AnalyzeComplaintResponse,
    PolicyDocument,
    DispatchRequest,
    DispatchResponse,
)
from backend.app.services import (
    analyze_complaint_pipeline,
    ENTERPRISE_POLICIES,
)

app = FastAPI(
    title="PolicyPulse AI API",
    description="Intelligent Customer Complaint Response Assistant Grounded in Enterprise Policy (PS-40 Demo)",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PolicyPulse AI Orchestrator (Demo Sandbox)",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "demo_sandbox"),
        "database_connected": False,  # Explicitly indicates local mock fixture mode
        "database_mode": "local_mock_fixtures",
        "vector_search_ready": False, # Explicitly indicates simulated hybrid search
        "vector_search_mode": "local_simulated_rrf",
        "live_dispatch_provider_configured": False,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

@app.post("/api/v1/complaints/analyze", response_model=AnalyzeComplaintResponse)
def analyze_complaint(req: AnalyzeComplaintRequest):
    return analyze_complaint_pipeline(req)

@app.get("/api/v1/policies")
def list_policies():
    return ENTERPRISE_POLICIES

@app.post("/api/v1/policies/upload", status_code=status.HTTP_201_CREATED)
def upload_policy(
    title: str = Form(...),
    version: str = Form("v1.0"),
    category: str = Form("General"),
):
    new_doc = PolicyDocument(
        policy_id=f"POL-{int(datetime.utcnow().timestamp())}",
        title=title,
        version=version,
        category=category,
        updated_at=datetime.utcnow().isoformat() + "Z",
        total_chunks=16,
        status="active",
        is_demo_fixture=True,
    )
    ENTERPRISE_POLICIES.append(new_doc)
    return {
        "policy_id": new_doc.policy_id,
        "title": new_doc.title,
        "version": new_doc.version,
        "status": "indexed",
        "chunks_created": 16,
        "is_demo_fixture": True,
    }

@app.get("/api/v1/conversations")
def list_conversations():
    return [
        {
            "complaint_id": "CMP-2026-9042",
            "customer_id": "CUST-8102",
            "customer_name": "Eleanor Vance",
            "customer_email": "eleanor.vance@example.com",
            "channel": "email",
            "received_at": "2026-10-10 14:22:00",
            "raw_text": "I received my order #48192 three days late, and when I opened the box, the espresso machine was dented and leaking water. Your delivery driver was dismissive and refused to note the damage on the receipt. I demand an immediate full refund and a $100 gift card for my trouble.",
            "overall_sentiment": "frustrated",
            "overall_severity": "high",
            "review_status": "PENDING_REVIEW",
        },
        {
            "complaint_id": "CMP-2026-9043",
            "customer_id": "CUST-5219",
            "customer_name": "Marcus Chen",
            "customer_email": "marcus.chen@example.com",
            "channel": "ticket",
            "received_at": "2026-10-10 13:05:00",
            "raw_text": "I was double billed for my Enterprise Cloud subscription renewal on October 1st. My card statement shows two identical charges of $249.99. Please refund the duplicate transaction immediately.",
            "overall_sentiment": "negative",
            "overall_severity": "medium",
            "review_status": "PENDING_REVIEW",
        },
        {
            "complaint_id": "CMP-2026-9044",
            "customer_id": "CUST-3941",
            "customer_name": "Sophia Al-Mansoor",
            "customer_email": "sophia.almansoor@example.com",
            "channel": "chat",
            "received_at": "2026-10-10 11:40:00",
            "raw_text": "My smart home thermostat purchased 16 months ago has started smoking from the rear capacitor. Your 12-month warranty is expired, but this is a hazardous defect. I expect a free replacement unit and compensation for electrician inspection costs.",
            "overall_sentiment": "urgent",
            "overall_severity": "critical",
            "review_status": "PENDING_REVIEW",
        },
    ]

@app.post("/api/v1/conversations/{conversation_id}/messages")
def append_message(conversation_id: str, message: dict):
    return {
        "status": "appended",
        "conversation_id": conversation_id,
        "message_id": f"MSG-{int(datetime.utcnow().timestamp())}",
    }

@app.post("/api/v1/complaints/dispatch", response_model=DispatchResponse)
def dispatch_complaint(req: DispatchRequest):
    # Enforce mandatory human approval and validation
    if not req.agent_id or not req.agent_name:
        raise HTTPException(
            status_code=400,
            detail="Dispatch rejected: Agent identity verification is required."
        )

    if len(req.final_text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Dispatch rejected: Final response text cannot be empty or truncated."
        )

    # Enforce critical guardrail check: if text contains ungrounded commitments without override justification
    text_lower = req.final_text.lower()
    if ("$100 gift card" in text_lower or "100 dollar gift card" in text_lower) and not req.notes and not req.override_reasons:
        raise HTTPException(
            status_code=400,
            detail="Dispatch blocked by Guardrails: Draft contains an ungrounded prohibited commitment ($100 gift card). Supervisory override justification must be provided in audit notes to proceed."
        )

    action_status = (
        "SIMULATED_DISPATCH"
        if req.action == "APPROVE"
        else "ESCALATED"
        if req.action == "ESCALATE"
        else "REJECTED"
    )

    return DispatchResponse(
        dispatch_id=f"DISP-{int(datetime.utcnow().timestamp())}-SIMULATED",
        complaint_id=req.complaint_id,
        status=action_status,
        dispatched_at=datetime.utcnow().isoformat() + "Z",
        audit_log_id=f"AUDIT-SIMULATED-{int(datetime.utcnow().timestamp())}",
        delivery_channel="SIMULATED_LOCAL_DEMO",
    )
