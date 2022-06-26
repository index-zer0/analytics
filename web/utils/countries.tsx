import iso3166 from "../public/assets/ISO3166-1.alpha2.json";

export const isoToName = (iso: string): string => {
    const data: Record<string, string> = iso3166;
    if (data[iso] !== undefined) {
        return data[iso];
    }
    return iso;
};
