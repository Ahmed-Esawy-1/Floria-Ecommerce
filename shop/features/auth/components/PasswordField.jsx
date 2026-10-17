"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
    id,
    name,
    value,
    onChange,
    placeholder,
    error,
    autoComplete = "current-password",
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={visible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full px-4 py-4 rounded-xl border bg-white text-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all ltr:pr-12 rtl:pl-12 ${
                    error ? "border-red-300" : "border-slate-200"
                }`}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                tabIndex={-1}
                aria-label={visible ? "Hide password" : "Show password"}
                className="absolute inset-y-0 ltr:right-4 rtl:left-4 flex items-center text-slate-400 hover:text-slate-600"
            >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}
