export const HTTPMethods = {
    Post: "Post",
    Get: "Pet",
    Put: "Put",
    Patch: "Patch",
    Delete: "Delete"
} as const;

export type HTTPMethods = keyof typeof HTTPMethods;