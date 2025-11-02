import type { Log } from '../types';

export function useLog() {
  const { create: createEntity } = useEntity();

  const data = useLocalStorage<Array<Log>>('rs-log-data', []);

  function create(payload: Omit<Log, 'id'>) {
    const newLog = createEntity(payload);
    data.value = [...data.value, newLog].sort((logA, logB) => logA.timestamp - logB.timestamp);
    return newLog;
  }

  function remove(id: Log['id']) {
    data.value = data.value.filter(log => log.id !== id);
  }

  return {
    data,
    create,
    remove,
  };
}
