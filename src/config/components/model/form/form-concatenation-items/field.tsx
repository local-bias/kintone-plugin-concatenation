import React, { FC, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { concatenationItemsState } from '@/config/states/plugin';
import { produce } from 'immer';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import { appFieldsState } from '@/config/states/kintone';
import { TextField } from '@mui/material';
import { FORMATTABLE_FIELD_TYPES } from '@/lib/plugin';

type ContainerProps = { item: Plugin.Condition['concatenationItems'][number]; index: number };
type Props = { item: Plugin.ConcatenationItem.Field; index: number };

const Component: FC<Props> = ({ item, index }) => {
  const appFields = useRecoilValue(appFieldsState);

  const field = appFields.find((field) => field.code === item.value);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (index: number, value: string) =>
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            //@ts-ignore
            draft[index].value = value;
          })
        ),
    []
  );

  const onFormatChange = useRecoilCallback(
    ({ set }) =>
      (index: number, value: string) =>
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            //@ts-ignore
            draft[index].format = value;
          })
        ),
    []
  );

  return (
    <>
      <div className='col-span-4'>
        <RecoilFieldSelect
          label='フィールド'
          state={appFieldsState}
          fieldCode={item.value}
          sx={{ width: undefined }}
          fullWidth
          onChange={(code) => onFieldChange(index, code)}
        />
      </div>
      {FORMATTABLE_FIELD_TYPES.includes(field?.type as any) && (
        <div className='col-span-4'>
          <TextField
            label='フォーマット'
            fullWidth
            value={item.format}
            placeholder='yyyy-MM-dd'
            onChange={(e) => onFormatChange(index, e.target.value)}
          />
        </div>
      )}
    </>
  );
};

const Container: FC<ContainerProps> = (props) => {
  if (props.item.type !== 'field') {
    return null;
  }
  return (
    <Suspense>
      <Component {...(props as Props)} />
    </Suspense>
  );
};

export default Container;
