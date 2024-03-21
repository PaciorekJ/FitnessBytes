
const escapeRegExp = (s: string) => {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegExp;