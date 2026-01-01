import type { Log } from '../types';

export function useLog() {
  const { t } = useI18n();
  const now = useTimestamp({ interval: 1000 });
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

  function getDuration(...logs: Array<Log>) {
    return logs.reduce((result, log) => {
      const index = data.value.findIndex(currentLog => currentLog.id === log.id);
      const nextLog = data.value[index + 1];
      result += (nextLog?.timestamp ?? now.value) - log.timestamp;
      return result;
    }, 0);
  }

  function formatDuration(value: number) {
    const parts = [];
    const hours = Math.floor((value / (1000 * 60 * 60)) % 24);
    if (hours > 0) {
      parts.push(t('log.duration.hours', { value: hours }));
    }
    const minutes = Math.floor((value / (1000 * 60)) % 60);
    if (minutes > 0) {
      parts.push(t('log.duration.minutes', { value: minutes }));
    }
    return parts.join(' ');
  }

  return {
    data,
    create,
    update,
    remove,
    getDuration,
    formatDuration,
  };
}
