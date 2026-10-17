"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useSendContactMessageMutation } from "@/lib/api/contactApi";
import { EMAIL_REGEX } from "@/features/auth/constants";
import {
    INITIAL_CONTACT_FORM,
    MESSAGE_MIN_LENGTH,
    NAME_MIN_LENGTH,
} from "./constants";

// ---- VALIDATION ---------------------
const validate = (form, t) => {
    const errors = {};

    if (form.name.trim().length < NAME_MIN_LENGTH) {
        errors.name = t("errors.nameRequired");
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
        errors.email = t("errors.emailInvalid");
    }
    if (!form.subject) {
        errors.subject = t("errors.subjectRequired");
    }
    if (form.message.trim().length < MESSAGE_MIN_LENGTH) {
        errors.message = t("errors.messageShort");
    }

    return errors;
};

// ---- TYPE OF ERROR ---------------
const getErrorMessage = (err, t) => {
    switch (err?.status) {
        case 400:
            return t("errors.invalid");
        case 429:
            return t("errors.tooMany");
        case 503:
            return t("errors.unavailable");
        case "FETCH_ERROR":
            return t("errors.network");
        default:
            return t("genericError");
    }
};

export function useContactForm(t) {
    const [form, setForm] = useState(INITIAL_CONTACT_FORM);
    const [errors, setErrors] = useState({});
    const [sendMessage, { isLoading }] = useSendContactMessageMutation();

    // ---- CHANGE INPUT VALUE -----------------------------
    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // ---- SUBMIT FORM -------------------------------------------------------------
    const submit = async (e) => {
        e.preventDefault();

        const nextErrors = validate(form, t);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        try {
            await sendMessage({
                name: form.name.trim(),
                email: form.email.trim(),
                subject: form.subject,
                message: form.message.trim(),
            }).unwrap();

            toast.success(t("successMessage"));
            setForm(INITIAL_CONTACT_FORM);
        } catch (err) {
            console.log("contact error:", err);
            toast.error(getErrorMessage(err, t));
        }
    };

    return { form, errors, updateField, submit, isLoading };
}
