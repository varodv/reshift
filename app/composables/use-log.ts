import type { Log } from '../types';

export function useLog() {
  const { create: createEntity } = useEntity();

  const data = useLocalStorage<Array<Log>>('rs-log-data', []);

  function create(payload: Omit<Log, 'id'>) {
    const newLog = createEntity(payload);
    data.value = data.value.concat(newLog).sort((logA, logB) => logA.timestamp - logB.timestamp);
    return newLog;
  }

  function update(payload: Log) {
    data.value = data.value
      .filter(log => log.id !== payload.id)
      .concat(payload)
      .sort((logA, logB) => logA.timestamp - logB.timestamp);
  }

  function remove(id: Log['id']) {
    data.value = data.value.filter(log => log.id !== id);
  }

  return {
    data,
    create,
    update,
    remove,
  };
}
