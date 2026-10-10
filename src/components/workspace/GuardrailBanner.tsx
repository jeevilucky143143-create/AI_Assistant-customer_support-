import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GuardrailReport } from '../../types';

interface GuardrailBannerProps {
  report: GuardrailReport;
}

export const GuardrailBanner: React.FC<GuardrailBannerProps> = ({ report }) => {
  const isFlagged = report.verdict === 'FLAGGED';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isFlagged
          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {isFlagged ? (
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
              <span>Guardrail Status: {report.verdict}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                  isFlagged
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isFlagged ? 'Commitment Blocked' : 'Policy Compliant'}
              </span>
            </span>
          </div>

          {isFlagged ? (
            <div className="space-y-1.5 mt-2">
              {report.unsupported_commitments_detected.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-black/40 border border-rose-500/20 text-[11px] text-white/90"
                >
                  <div className="font-semibold text-rose-300 mb-0.5">
                    Detected Unauthorized Claim: "{item.claim}"
                  </div>
                  <div className="text-white/60 font-mono">{item.reason}</div>
                </div>
              ))}
              <div className="text-[11px] text-rose-300/80 pt-1 font-mono">
                Action: Frontline agent must remove or modify this concession before approving dispatch.
              </div>
            </div>
          ) : (
            <p className="text-white/70 leading-relaxed">
              Automated safety scan passed. All proposed remedies are within authorized policy thresholds. Human review and sign-off required prior to dispatch.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
