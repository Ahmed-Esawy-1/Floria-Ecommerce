import { PASSWORD_MIN_LENGTH } from "./constants";

// Mirrors the backend password rules
export function getPasswordChecks(password) {
    return {
        length: password.length >= PASSWORD_MIN_LENGTH,
        letter: /[A-Za-z]/.test(password),
        digit: /\d/.test(password),
    };
}

export function doPasswordsMatch(form) {
    return (
        form.confirmNewPassword.length > 0 &&
        form.newPassword === form.confirmNewPassword
    );
}

export function canSubmitPasswordRequest(form) {
    const checks = getPasswordChecks(form.newPassword);

    return Boolean(
        form.oldPassword &&
        checks.length &&
        checks.letter &&
        checks.digit &&
        doPasswordsMatch(form),
    );
}
