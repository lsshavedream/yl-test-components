export type Exclude<T, U> = T extends U ? never : T;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


