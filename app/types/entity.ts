export type Entity<Type extends Record<string, any>> = Type & { id: string };
