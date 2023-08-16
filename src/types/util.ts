export type URI = string;
export type MaybeArray<T> = T | T[];

export type Entries<T> = [keyof T, T[keyof T]][];
