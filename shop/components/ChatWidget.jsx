"use client";

import { useAskBotMutation } from "@/lib/api/chatApi";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
    const t = useTranslations("chatbot");
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const listRef = useRef(null);

    const [askBot, { isLoading: loading }] = useAskBotMutation();

    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    // ---- SEND MESSAGE --------------------------
    async function handleSend(e) {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");

        try {
            const reply = await askBot(text).unwrap();
            setMessages((prev) => [...prev, { role: "bot", text: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: t("error"), isError: true },
            ]);
        }
    }

    return (
        <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-3">
            {open && (
                <div className="flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
                    <header className="bg-emerald-600 px-4 py-3 text-white">
                        <p className="text-sm font-semibold">{t("title")}</p>
                        <p className="text-xs text-emerald-100">
                            {t("subtitle")}
                        </p>
                    </header>

                    <div
                        ref={listRef}
                        className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4"
                    >
                        {messages.length === 0 && (
                            <p className="text-center text-xs text-stone-500">
                                {t("empty")}
                            </p>
                        )}

                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    dir="auto"
                                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                        m.role === "user"
                                            ? "bg-emerald-600 text-white"
                                            : m.isError
                                              ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                              : "bg-white text-stone-800 shadow-sm ring-1 ring-stone-200"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-1 rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-stone-200">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
                                </div>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 border-t border-stone-200 bg-white p-3"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("placeholder")}
                            maxLength={500}
                            className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {t("send")}
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={t("open")}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700"
            >
                {open ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>
        </div>
    );
}
