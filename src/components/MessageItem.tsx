import React, { useState } from "react";
import { User, Bot, Copy, Check, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";

interface MessageItemProps {
  message: Message;
}

function formatMessageTime(timestamp?: number): string {
  if (!timestamp) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(timestamp));
  } catch {
    return "";
  }
}

export function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const isUser = message.role === "user";
  const formattedTime = formatMessageTime(message.timestamp);

  return (
    <div
      className={`flex gap-3 sm:gap-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } group w-full`}
    >
      {/* Role Avatar */}
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-semibold shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-blue-400 border border-slate-700/80"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Column */}
      <div
        className={`max-w-[90%] sm:max-w-[82%] md:max-w-[76%] flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Role & Timestamp Header */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400 font-medium">
          <span className="font-semibold text-slate-300">
            {isUser ? "You" : "Socratic Tutor"}
          </span>
          {formattedTime && (
            <>
              <span className="text-slate-600">·</span>
              <span>{formattedTime}</span>
            </>
          )}
        </div>

        {/* Attachment Preview (if any) */}
        {message.attachment && (
          <div className="mb-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl max-w-xs overflow-hidden shadow-sm">
            <img
              src={message.attachment.previewUrl}
              alt={message.attachment.name}
              className="max-h-48 rounded-lg object-cover w-full"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-400 truncate">
              <FileText size={12} />
              <span className="truncate">{message.attachment.name}</span>
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed text-left transition-colors ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
              : "bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-sm"
          }`}
        >
          <div
            className={`prose max-w-none text-xs sm:text-sm leading-relaxed overflow-x-auto ${
              isUser
                ? "prose-invert text-white prose-p:leading-relaxed prose-headings:text-white"
                : "prose-invert prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-code:text-blue-300 prose-headings:text-white prose-strong:text-white"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span
                className="inline-block w-2 h-3.5 ml-1 bg-blue-400 animate-pulse align-middle rounded-sm"
                aria-label="Streaming response"
              />
            )}
          </div>

          {/* Footer toolbar for tutor messages */}
          {!isUser && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-[10px] text-slate-500 font-medium">
                {message.isStreaming ? "Responding in real-time..." : "Socratic guidance"}
              </span>

              {!message.isStreaming && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  title="Copy guidance to clipboard"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
