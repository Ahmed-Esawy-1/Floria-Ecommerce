import Hashids from "hashids";

// Use a real secret in production (env var), not this placeholder.
// Keep minLength consistent so all IDs look similar length regardless of value.
const hashids = new Hashids(
    process.env.NEXT_PUBLIC_HASHID_SALT || "flow-flowers-gifts",
    6,
);

export const encodeId = (id) => hashids.encode(Number(id));

export const decodeId = (hash) => {
    const decoded = hashids.decode(hash);
    return decoded.length > 0 ? decoded[0] : null;
};
