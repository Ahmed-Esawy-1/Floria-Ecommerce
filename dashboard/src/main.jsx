import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";

import "./index.css";
import "../i18n";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <LanguageProvider>
                    <ThemeProvider>
                        <Toaster position="top-right" richColors closeButton />

                        <App />
                    </ThemeProvider>
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
