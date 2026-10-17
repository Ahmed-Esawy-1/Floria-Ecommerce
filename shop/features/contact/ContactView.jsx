import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function ContactView() {
    return (
        <>
            <ContactHero />

            <section className="container mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </section>
        </>
    );
}
