const LOCAL_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

const splitOrigins = (value?: string): string[] =>
    (value || "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);

const getAllowedOrigins = (): string[] => [
    ...new Set([
        ...LOCAL_ORIGINS,
        ...splitOrigins(process.env.PUBLIC_ORIGIN),
        ...splitOrigins(process.env.FRONTEND_URL),
    ]),
];

const isAllowedOrigin = (origin?: string): boolean =>
    !origin || getAllowedOrigins().includes(origin.replace(/\/$/, ""));

export { getAllowedOrigins, isAllowedOrigin };
