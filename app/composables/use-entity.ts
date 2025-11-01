import type { Entity } from '../types';

export function useEntity() {
  function create<Type extends Entity<Record<string, any>>>(payload: Omit<Type, 'id'>) {
    return {
      ...payload,
      id: crypto.randomUUID(),
    } as Type;
  }

  return {
    create,
  };
}
