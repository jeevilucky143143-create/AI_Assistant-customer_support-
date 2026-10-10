from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

IssueCoverageStatus = Literal[
    "covered",
    "partially_covered",
    "uncovered",
    "prohibited",
    "conflict",
    "needs_human_review",
]

TonePreset = Literal["empathetic", "concise", "formal"]
GuardrailVerdict = Literal["PASSED", "FLAGGED"]

class Citation(BaseModel):
    citation_id: str
    document_title: str
    clause_id: str
    section_name: str
    page_number: Optional[int] = None
    excerpt: str
    confidence_score: float
    score_type: str = "demo_heuristic"

class DecomposedConcern(BaseModel):
    concern_id: str
    category: str
    summary: str
    severity: Literal["low", "medium", "high", "critical"]
    status: IssueCoverageStatus
    rationale: Optional[str] = None
    citations: List[Citation] = Field(default_factory=list)

class UnsupportedCommitment(BaseModel):
    claim: str
    reason: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class GuardrailReport(BaseModel):
    verdict: GuardrailVerdict
    unsupported_commitments_detected: List[UnsupportedCommitment] = Field(default_factory=list)
    policy_conflicts_detected: List[str] = Field(default_factory=list)
    policy_gaps_detected: List[str] = Field(default_factory=list)

class GroundedDraft(BaseModel):
    tone: TonePreset
    subject: str
    body: str
    anchored_clause_ids: List[str] = Field(default_factory=list)

class AnalyzeComplaintRequest(BaseModel):
    complaint_id: str
    customer_id: str
    customer_name: str
    channel: str = "email"
    raw_text: str
    tone_preference: TonePreset = "empathetic"

class AnalyzeComplaintResponse(BaseModel):
    complaint_id: str
    analysis_timestamp: str
    overall_sentiment: str
    overall_severity: Literal["low", "medium", "high", "critical"]
    decomposed_concerns: List[DecomposedConcern]
    guardrail_report: GuardrailReport
    grounded_draft: GroundedDraft
    human_review_required: bool
    review_reasons: List[str] = Field(default_factory=list)

class PolicyDocument(BaseModel):
    policy_id: str
    title: str
    version: str
    category: str
    updated_at: str
    total_chunks: int
    status: Literal["active", "archived", "draft"]
    is_demo_fixture: bool = True

class DispatchRequest(BaseModel):
    complaint_id: str
    agent_id: str = Field(..., min_length=1)
    agent_name: str = Field(..., min_length=1)
    action: Literal["APPROVE", "REJECT", "ESCALATE"]
    final_text: str = Field(..., min_length=10)
    notes: Optional[str] = None
    override_reasons: List[str] = Field(default_factory=list)

class DispatchResponse(BaseModel):
    dispatch_id: str
    complaint_id: str
    status: Literal["SIMULATED_DISPATCH", "ESCALATED", "REJECTED"]
    dispatched_at: str
    audit_log_id: str
    delivery_channel: str = "SIMULATED_LOCAL_DEMO"
