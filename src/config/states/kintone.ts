import { getAppId, getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { selector } from 'recoil';
import { GUEST_SPACE_ID } from '@/lib/global';

const PREFIX = 'kintone';

export const appFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}appFieldsState`,
  get: async () => {
    const app = getAppId()!;
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });

    const values = Object.values(properties);

    return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const stringFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}stringFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    return fields.filter(
      (field) =>
        field.type === 'SINGLE_LINE_TEXT' ||
        field.type === 'MULTI_LINE_TEXT' ||
        field.type === 'RICH_TEXT'
    );
  },
});

export const flatFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}flatFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    return fields.flatMap((field) => {
      if (field.type === 'SUBTABLE') {
        return Object.values(field.fields);
      }
      return field;
    });
  },
});
