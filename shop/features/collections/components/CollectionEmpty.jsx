import { getTranslations } from "next-intl/server";

export default async function CollectionEmpty({ config }) {
    const t = await getTranslations(config.namespace);

    return (
        <div className="col-span-full text-center py-20">
            <h2 className="text-2xl font-semibold mb-2 text-ink">
                {t(config.emptyTitleKey)}
            </h2>
            <p className="text-text">{t(config.emptyDescKey)}</p>
        </div>
    );
}
