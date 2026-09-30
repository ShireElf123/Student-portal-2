import React, { useState, useEffect } from "react";
import { CheckCircle2, RefreshCw, AlertTriangle, CloudOff, X } from "lucide-react";
import { SyncStatusInfo } from "../types";
import { subscribeToSyncStatus } from "../firebaseCore";

interface SyncStatusBadgeProps {
  initialStatus?: SyncStatusInfo;
}

export function SyncStatusBadge({ initialStatus }: SyncStatusBadgeProps) {
  const [status, setStatus] = useState<SyncStatusInfo>(
    initialStatus || { state: "synced", message: "Cloud connected" }
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const unsub = subscribeToSyncStatus((info) => {
      setStatus(info);
      if (info.message) {
        setToastMessage(info.message);
        setShowToast(true);
        // Hide toast after 4 seconds if not error
        if (info.state !== "error") {
          const t = setTimeout(() => setShowToast(false), 4000);
          return () => clearTimeout(t);
        }
      }
    });
    return unsub;
  }, []);

  return (
    <>
      {/* Mini status indicator in sidebar/header */}
      <div
        id="sync-status-indicator"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
          status.state === "synced"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : status.state === "syncing"
            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            : status.state === "error"
            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
            : "bg-white/5 text-white/50 border border-white/10"
        }`}
        title={status.message || "Cloud persistence status"}
      >
        {status.state === "synced" && <CheckCircle2 size={12} className="text-emerald-400" />}
        {status.state === "syncing" && <RefreshCw size={12} className="animate-spin text-blue-400" />}
        {status.state === "error" && <AlertTriangle size={12} className="text-rose-400" />}
        {status.state === "offline" && <CloudOff size={12} className="text-white/40" />}

        <span className="capitalize">
          {status.state === "synced" && "Cloud Synced"}
          {status.state === "syncing" && "Syncing..."}
          {status.state === "error" && "Sync Alert"}
          {status.state === "offline" && "Offline Cache"}
        </span>
      </div>

      {/* Floating Notification Toast */}
      {showToast && (
        <div
          id="sync-toast-notification"
          className={`fixed bottom-20 md:bottom-6 right-6 z-50 max-w-sm p-3.5 rounded-xl border shadow-xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200 ${
            status.state === "error"
              ? "bg-[#1f0b0e] border-rose-500/40 text-rose-200"
              : status.state === "syncing"
              ? "bg-[#0b1424] border-blue-500/40 text-blue-200"
              : "bg-[#0c1a14] border-emerald-500/30 text-emerald-200"
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {status.state === "error" ? (
              <AlertTriangle size={16} className="text-rose-400" />
            ) : status.state === "syncing" ? (
              <RefreshCw size={16} className="animate-spin text-blue-400" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">
              {status.state === "error"
                ? "Firestore Sync Error"
                : status.state === "syncing"
                ? "Saving to Cloud"
                : "Cloud Synchronized"}
            </p>
            <p className="opacity-80 mt-0.5 line-clamp-2 leading-relaxed">{toastMessage}</p>
          </div>

          <button
            onClick={() => setShowToast(false)}
            className="text-white/40 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
