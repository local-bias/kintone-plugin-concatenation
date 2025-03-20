import { FORMATTABLE_FIELD_TYPES, restorePluginConfig } from '@/lib/plugin';
import { listener } from '@/lib/listener';
import { getFieldValueAsString, kintoneAPI } from '@konomi-app/kintone-utilities';
import { DateTime } from 'luxon';

const { conditions } = restorePluginConfig();

for (const condition of conditions) {
  const { targetField, concatenationItems } = condition;
  if (!targetField) {
    continue;
  }

  const submitEvents: kintoneAPI.js.EventType[] = [
    'app.record.edit.submit',
    'app.record.create.submit',
    'app.record.index.edit.submit',
  ];

  const monitoredFields = concatenationItems.filter((item) => item.type === 'field');

  const changeEvents = monitoredFields.flatMap((item) => [
    //@ts-ignore
    `app.record.edit.change.${item.value}`,
    //@ts-ignore
    `app.record.create.change.${item.value}`,
  ]);

  listener.add(['app.record.edit.show', 'app.record.create.show'], async (event) => {
    //@ts-ignore
    event.record[targetField].disabled = true;

    return event;
  });

  listener.addChangeEvents([...submitEvents, ...changeEvents], (event) => {
    const { record } = event;

    const concatenated = concatenationItems
      .map((item, i, arr) => {
        switch (item.type) {
          case 'string':
            if (
              item.isOmittedIfPreviousEmpty &&
              i > 0 &&
              arr[i - 1]?.type === 'field' &&
              //@ts-ignore
              !record[arr[i - 1].value]?.value
            ) {
              return '';
            }

            if (
              item.isOmittedIfNextEmpty &&
              i < arr.length - 1 &&
              arr[i + 1]?.type === 'field' &&
              //@ts-ignore
              !record[arr[i + 1].value]?.value
            ) {
              return '';
            }

            return item.value;
          case 'field':
            const fieldType = record[item.value]?.type;

            if (FORMATTABLE_FIELD_TYPES.includes(fieldType as any) && item.format) {
              const value = record[item.value]?.value as string;
              if (!value) {
                return '';
              }
              const date = DateTime.fromISO(value);
              return date.toFormat(item.format);
            }

            if (!record[item.value]) {
              return '';
            }

            return getFieldValueAsString(record[item.value], {
              ignoresCalculationError: true,
            });
          default:
            return '';
        }
      })
      .join('');

    event.record[targetField].value = concatenated;

    return event;
  });
}
