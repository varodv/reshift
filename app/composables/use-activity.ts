import type { Activity } from '../types';

export function useActivity() {
  const { create } = useEntity();

  const data = useLocalStorage<Array<Activity>>('rs-activity-data', [
    create({
      name: 'Work 1',
      color: 'blue',
      schedule: [
        {
          weekdays: [1, 2, 3, 4, 5],
          minHours: 4,
          maxHours: 6,
        },
      ],
    }),
    create({
      name: 'Work 2',
      color: 'cyan',
      schedule: [
        {
          weekdays: [1, 2, 3, 4, 5],
          minHours: 1,
          maxHours: 4,
        },
      ],
    }),
    create({
      name: 'House',
      color: 'violet',
      schedule: [
        {
          weekdays: [1, 2, 3, 4, 5],
          maxHours: 2,
        },
      ],
    }),
    create({
      name: 'Exercise',
      color: 'stone',
      schedule: [
        {
          weekdays: [1, 2, 3, 4, 5],
          minHours: 0.5,
        },
      ],
    }),
    create({
      name: 'Reading',
      color: 'slate',
      schedule: [
        {
          weekdays: [1, 2, 3, 4, 5],
          minHours: 0.5,
        },
      ],
    }),
  ]);

  return {
    data,
  };
}
