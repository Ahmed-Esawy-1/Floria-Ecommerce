"use client";

import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

import { useContactForm } from "../useContactForm";
import { MESSAGE_MAX_LENGTH, SUBJECT_KEYS } from "../constants";

const fieldClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition focus:ring-2 focus:ring-primary/40 ${
        hasError ? "border-red-300" : "border-gold/20"
    }`;

const labelClass = "block text-sm font-semibold text-ink mb-2";

// Label, input, and error message as one unit
function Field({ id, label, error, children }) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default function ContactForm() {
    const t = useTranslations("contact.form");
    const { form, errors, updateField, submit, isLoading } = useContactForm(t);

    return (
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gold/15 shadow-lg">
            <h2 className="text-2xl font-heading text-ink mb-2">
                {t("title")}
            </h2>
            <p className="text-sm text-text mb-8">{t("subtitle")}</p>

            <form onSubmit={submit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NAME */}
                    <Field id="name" label={t("nameLabel")} error={errors.name}>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={100}
                            placeholder={t("namePlaceholder")}
                            value={form.name}
                            onChange={(e) =>
                                updateField("name", e.target.value)
                            }
                            className={fieldClass(errors.name)}
                        />
                    </Field>

                    {/* EMAIL */}
                    <Field
                        id="email"
                        label={t("emailLabel")}
                        error={errors.email}
                    >
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            maxLength={150}
                            placeholder={t("emailPlaceholder")}
                            value={form.email}
                            onChange={(e) =>
                                updateField("email", e.target.value)
                            }
                            className={fieldClass(errors.email)}
                        />
                    </Field>
                </div>

                {/* SUBJECT */}
                <Field
                    id="subject"
                    label={t("subjectLabel")}
                    error={errors.subject}
                >
                    <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={(e) => updateField("subject", e.target.value)}
                        className={fieldClass(errors.subject)}
                    >
                        <option value="" disabled>
                            {t("selectSubject")}
                        </option>
                        {SUBJECT_KEYS.map((key) => (
                            <option key={key} value={key}>
                                {t(`subjects.${key}`)}
                            </option>
                        ))}
                    </select>
                </Field>

                {/* MESSAGE */}
                <Field
                    id="message"
                    label={t("messageLabel")}
                    error={errors.message}
                >
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        maxLength={MESSAGE_MAX_LENGTH}
                        placeholder={t("messagePlaceholder")}
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        className={`${fieldClass(errors.message)} resize-none`}
                    />
                    <p className="mt-1 text-end text-xs text-slate-400">
                        {form.message.length}/{MESSAGE_MAX_LENGTH}
                    </p>
                </Field>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold py-4 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
                >
                    <span className="uppercase tracking-[0.2em] text-sm">
                        {isLoading ? t("submitting") : t("submit")}
                    </span>
                    <Send size={18} className="rtl:rotate-180" />
                </button>

                <p className="text-xs text-center text-slate-400">
                    {t("note")}
                </p>
            </form>
        </div>
    );
}
