import { restorePluginConfig } from '@/lib/plugin';
import { listener } from '@/lib/listener';
import { getFieldValueAsString, kintoneAPI } from '@konomi-app/kintone-utilities';

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
    const concatenated = concatenationItems
      .map((item) => {
        switch (item.type) {
          case 'string':
            return item.value;
          case 'field':
            return getFieldValueAsString(event.record[item.value], {
              ignoresCalculationError: true,
            });
          default:
            return '';
        }
      })
      .join('');

    console.log({ concatenated });

    event.record[targetField].value = concatenated;

    return event;
  });
}
