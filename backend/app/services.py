from datetime import datetime
from typing import List, Tuple
from .models import (
    AnalyzeComplaintRequest,
    AnalyzeComplaintResponse,
    DecomposedConcern,
    Citation,
    GuardrailReport,
    UnsupportedCommitment,
    GroundedDraft,
    PolicyDocument,
    TonePreset,
)

# Active enterprise policies catalog
ENTERPRISE_POLICIES: List[PolicyDocument] = [
    PolicyDocument(
        policy_id="POL-REFUND-2026",
        title="Enterprise Refund & Return Policy",
        version="v2.4",
        category="Billing & Returns",
        updated_at="2026-09-15T00:00:00Z",
        total_chunks=48,
        status="active",
    ),
    PolicyDocument(
        policy_id="POL-SHIPPING-2026",
        title="Shipping & Fulfillment SLA",
        version="v1.8",
        category="Logistics",
        updated_at="2026-08-20T00:00:00Z",
        total_chunks=24,
        status="active",
    ),
    PolicyDocument(
        policy_id="POL-WARRANTY-2026",
        title="Hardware Warranty & Defect Terms",
        version="v3.0",
        category="Technical Hardware",
        updated_at="2026-07-01T00:00:00Z",
        total_chunks=62,
        status="active",
    ),
    PolicyDocument(
        policy_id="POL-CONDUCT-2026",
        title="Logistics Partner Code of Conduct",
        version="v3.1",
        category="Operations",
        updated_at="2026-06-12T00:00:00Z",
        total_chunks=18,
        status="active",
    ),
]

def analyze_complaint_pipeline(req: AnalyzeComplaintRequest) -> AnalyzeComplaintResponse:
    text_lower = req.raw_text.lower()
    
    concerns: List[DecomposedConcern] = []
    unsupported_commitments: List[UnsupportedCommitment] = []
    review_reasons: List[str] = []
    anchored_clauses: List[str] = []

    # 1. Damaged item detection
    if "dent" in text_lower or "damage" in text_lower or "leak" in text_lower or "broken" in text_lower:
        concerns.append(
            DecomposedConcern(
                concern_id="CONC-1",
                category="Damaged Merchandise",
                summary="Appliance delivered in damaged/defective condition with exterior denting or leakage.",
                severity="high",
                status="covered",
                rationale="Policy Clause 3.2 explicitly authorizes replacement or full refund upon photo proof within 14 days.",
                citations=[
                    Citation(
                        citation_id="CIT-POL-01-SEC-3",
                        document_title="Enterprise Refund & Return Policy v2.4",
                        clause_id="Clause 3.2 (Transit Damage)",
                        section_name="Section 3: Damaged or Defective Items",
                        page_number=4,
                        excerpt="Goods damaged during transit are eligible for an immediate replacement or full refund upon submission of photographic evidence within 14 days of delivery receipt.",
                        confidence_score=0.95,
                    )
                ],
            )
        )
        anchored_clauses.append("Clause 3.2 (Transit Damage)")

    # 2. Delivery delay detection
    if "late" in text_lower or "delay" in text_lower or "three days" in text_lower or "days late" in text_lower:
        concerns.append(
            DecomposedConcern(
                concern_id="CONC-2",
                category="Carrier Delivery Delay",
                summary="Delivery arrived past the guaranteed carrier delivery timeframe.",
                severity="medium",
                status="partially_covered",
                rationale="Delay past 48h qualifies for standard shipping fee reimbursement, but not merchandise value refund.",
                citations=[
                    Citation(
                        citation_id="CIT-POL-02-SEC-2",
                        document_title="Shipping & Fulfillment SLA v1.8",
                        clause_id="Clause 2.1 (Standard Delay Recourse)",
                        section_name="Section 2: Delivery Guarantees",
                        page_number=2,
                        excerpt="For carrier delays exceeding 48 hours beyond the guaranteed window, standard shipping charges shall be credited to the customer account.",
                        confidence_score=0.89,
                    )
                ],
            )
        )
        anchored_clauses.append("Clause 2.1 (Standard Delay Recourse)")

    # 3. Courier conduct
    if "driver" in text_lower or "courier" in text_lower or "dismissive" in text_lower or "rude" in text_lower:
        concerns.append(
            DecomposedConcern(
                concern_id="CONC-3",
                category="Courier Conduct & Documentation",
                summary="Delivery personnel demonstrated dismissive conduct and declined to document parcel damage.",
                severity="low",
                status="needs_human_review",
                rationale="Courier behavioral incidents require formal escalation to logistics vendor council.",
                citations=[
                    Citation(
                        citation_id="CIT-POL-04-SEC-1",
                        document_title="Logistics Partner Code of Conduct v3.1",
                        clause_id="Clause 1.4 (Driver Escalation Protocol)",
                        section_name="Section 1: Service Quality",
                        page_number=1,
                        excerpt="Courier behavioral complaints are logged to the 3PL Logistics Partner Council for formal review within 5 business days.",
                        confidence_score=0.81,
                    )
                ],
            )
        )
        anchored_clauses.append("Clause 1.4 (Driver Escalation Protocol)")
        review_reasons.append("Courier conduct incident triage required")

    # 4. Inconvenience / Gift card demand (Prohibited commitment guardrail)
    if "gift card" in text_lower or "100" in text_lower or "compensation" in text_lower:
        concerns.append(
            DecomposedConcern(
                concern_id="CONC-4",
                category="Inconvenience Consequential Claim",
                summary="Customer demanded external $100 gift card or unauthorized consequential payout.",
                severity="medium",
                status="prohibited",
                rationale="Discretionary frontline credits are strictly capped at $25. External gift cards are prohibited.",
                citations=[
                    Citation(
                        citation_id="CIT-POL-01-SEC-7",
                        document_title="Enterprise Refund & Return Policy v2.4",
                        clause_id="Clause 7.1 (Discretionary Goodwill Limits)",
                        section_name="Section 7: Consequential Goodwill & Credit",
                        page_number=9,
                        excerpt="Goodwill store credits exceeding $25 require written authorization from a Support Operations Director and may not be promised by frontline agents.",
                        confidence_score=0.97,
                    )
                ],
            )
        )
        anchored_clauses.append("Clause 7.1 (Discretionary Goodwill Limits)")
        unsupported_commitments.append(
            UnsupportedCommitment(
                claim="Customer demand for $100 gift card",
                reason="Exceeds authorized frontline discretionary credit threshold ($25). Prohibited by Clause 7.1.",
                severity="CRITICAL",
            )
        )
        review_reasons.append("Prohibited goodwill demand flagged by guardrails")

    # Default if no keyword matched
    if not concerns:
        concerns.append(
            DecomposedConcern(
                concern_id="CONC-1",
                category="General Customer Inquiry",
                summary="General account or transaction inquiry.",
                severity="low",
                status="needs_human_review",
                rationale="Requires manual agent assessment.",
                citations=[],
            )
        )
        review_reasons.append("Unclassified ticket pattern")

    # Guardrail verdict
    guardrail_verdict = "FLAGGED" if len(unsupported_commitments) > 0 else "PASSED"

    # Tone adaptation
    tone = req.tone_preference
    if tone == "concise":
        draft_body = (
            f"Hello {req.customer_name},\n\n"
            "1. Damaged Item: Per Clause 3.2, please provide photos of the damaged unit so we can dispatch a replacement or process a refund.\n"
            "2. Carrier Delay: Per Clause 2.1, your standard shipping fee has been refunded.\n"
            "3. Courier Conduct: An investigation was logged with logistics management (Clause 1.4).\n"
            "4. Additional Claims: Under Clause 7.1, goodwill credits are capped at $25 and external gift cards cannot be authorized.\n\n"
            "Reply with your photos to trigger the replacement."
        )
    elif tone == "formal":
        draft_body = (
            f"Dear {req.customer_name},\n\n"
            "We acknowledge receipt of your complaint regarding this transaction.\n\n"
            "Pursuant to Clause 3.2 of the Enterprise Return Policy, items damaged during transit are eligible for replacement or reimbursement following submission of photographic proof. In addition, under Clause 2.1 of our Fulfillment SLA, your standard shipping fee has been credited.\n\n"
            "Regarding courier conduct, a formal review has been initiated under Clause 1.4. Please note that discretionary goodwill concessions are strictly limited by Clause 7.1 and cannot encompass third-party financial gift cards.\n\n"
            "Respectfully,\nSupport Operations Compliance Group"
        )
    else:  # empathetic
        draft_body = (
            f"Dear {req.customer_name},\n\n"
            "Thank you for contacting us. I am sincerely sorry for the distress caused by the delay in your shipment, the condition of your merchandise, and your interaction with the delivery courier.\n\n"
            "Under our Enterprise Return Policy [Clause 3.2], we are ready to send a replacement or issue a full refund immediately once you share a photo of the damage. Furthermore, per our Shipping SLA [Clause 2.1], we have refunded the standard shipping fee.\n\n"
            "We have filed a formal review with our logistics partner regarding driver conduct [Clause 1.4]. While company guidelines limit discretionary credits and do not support third-party gift cards [Clause 7.1], our priority is ensuring your issue is fully resolved without extra cost to you.\n\n"
            "Please reply with photos of the damaged merchandise so we can dispatch your replacement immediately."
        )

    return AnalyzeComplaintResponse(
        complaint_id=req.complaint_id,
        analysis_timestamp=datetime.utcnow().isoformat() + "Z",
        overall_sentiment="frustrated" if "angry" in text_lower or "demand" in text_lower else "negative",
        overall_severity="high" if len(unsupported_commitments) > 0 else "medium",
        decomposed_concerns=concerns,
        guardrail_report=GuardrailReport(
            verdict=guardrail_verdict,
            unsupported_commitments_detected=unsupported_commitments,
            policy_conflicts_detected=[],
            policy_gaps_detected=[],
        ),
        grounded_draft=GroundedDraft(
            tone=tone,
            subject=f"Regarding Ticket {req.complaint_id} — Resolution & Policy Guidance",
            body=draft_body,
            anchored_clause_ids=anchored_clauses,
        ),
        human_review_required=True,
        review_reasons=review_reasons or ["Mandatory human sign-off before dispatch"],
    )
