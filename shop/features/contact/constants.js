import { FacebookIcon, InstagramIcon } from "@/components/Icons";

// Form rules
export const NAME_MIN_LENGTH = 2;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 1000;

export const INITIAL_CONTACT_FORM = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

// Keys match contact.form.subjects.* in the translation files
export const SUBJECT_KEYS = [
    "general",
    "bespoke",
    "events",
    "corporate",
    "press",
];

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
export const CONTACT_PHONE = process.env.CONTACT_PHONE;

// Tanta ELghrabia
export const STORE_COORDINATES = { lat: 30.7865, lng: 31.0004 };

// Keys match contact.info.hours.* in the translation files
export const OPENING_HOURS = [
    { key: "mondayFriday", open: "08:00", close: "19:00" },
    { key: "saturday", open: "09:00", close: "18:00" },
    { key: "sunday", open: "10:00", close: "16:00" },
];

// Keys match contact.info.social.* in the translation files
export const SOCIAL_LINKS = [
    { key: "facebook", href: "https://facebook.com/", icon: FacebookIcon },
    { key: "instagram", href: "https://instagram.com/", icon: InstagramIcon },
];
