// OAuth error codes returned in the URL and their translation keys
export const OAUTH_ERROR_KEYS = {
    oauth: "oauthError",
    oauth_failed: "oauthError",
    account_exists: "accountExists",
    employee_account: "employeeAccount",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// At least one letter and one digit
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

// Seconds before the user can request a new verification code
export const RESEND_COOLDOWN = 60;

// sign up page
export const EMPTY_ERRORS = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
};
