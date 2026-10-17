import { getTranslations } from "next-intl/server";

import { COLLECTION_TYPES } from "./constants";
import CollectionHeader from "./components/CollectionHeader";
import CollectionEmpty from "./components/CollectionEmpty";
import CollectionCard from "./components/CollectionCard";

export default async function CollectionsView({ items = [], type }) {
    const config = COLLECTION_TYPES[type];
    if (!config) throw new Error(`Unknown collection type: ${type}`);

    const t = await getTranslations(config.namespace);
    const isEmpty = items.length === 0;

    return (
        <main className="container mx-auto px-6 py-12">
            <CollectionHeader config={config} />

            <p className="text-text max-w-2xl leading-relaxed mb-12 -mt-8">
                {isEmpty ? t(config.emptyDescKey) : t("description")}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isEmpty ? (
                    <CollectionEmpty config={config} />
                ) : (
                    items.map((item) => (
                        <CollectionCard
                            key={item.id}
                            item={item}
                            queryParam={config.queryParam}
                        />
                    ))
                )}
            </div>
        </main>
    );
}
