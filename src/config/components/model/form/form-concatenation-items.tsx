import React, { FC } from 'react';
import { TextField, MenuItem, Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { CONCATENATION_ITEM_TYPES } from '@/lib/plugin';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { concatenationItemsState } from '@/config/states/plugin';
import { produce } from 'immer';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import { appFieldsState } from '@/config/states/kintone';

const Component: FC = () => {
  const items = useRecoilValue(concatenationItemsState);

  const onRowAdd = useRecoilCallback(
    ({ set }) =>
      (index: number) => {
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            draft.splice(index + 1, 0, { type: 'string', value: '' });
          })
        );
      },
    []
  );

  const onRowDelete = useRecoilCallback(
    ({ set }) =>
      (index: number) => {
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            draft.splice(index, 1);
          })
        );
      },
    []
  );

  const onTypeChange = useRecoilCallback(
    ({ set }) =>
      (index: number, value: string) =>
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            //@ts-ignore
            draft[index].type = value;
            if (value === 'string' || value === 'field') {
              //@ts-ignore
              draft[index].value = '';
            }
          })
        ),
    []
  );

  const onStringChange = useRecoilCallback(
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

  return (
    <div className='grid gap-4'>
      {items.map((item, index) => (
        <div key={index} className='flex items-center gap-4'>
          <TextField
            variant='outlined'
            color='primary'
            label='タイプ'
            select
            sx={{ width: '300px' }}
            value={item.type}
            onChange={(e) => onTypeChange(index, e.target.value)}
          >
            {CONCATENATION_ITEM_TYPES.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          {item.type === 'string' && (
            <TextField
              variant='outlined'
              color='primary'
              label='文字列'
              sx={{ width: '400px' }}
              value={item.value}
              onChange={(e) => onStringChange(index, e.target.value)}
            />
          )}
          {item.type === 'field' && (
            <RecoilFieldSelect
              label='フィールド'
              state={appFieldsState}
              fieldCode={item.value}
              onChange={(code) => onFieldChange(index, code)}
            />
          )}
          <Tooltip title='結合設定を追加'>
            <IconButton size='small' onClick={() => onRowAdd(index)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {items.length > 1 && (
            <Tooltip title='この結合設定を削除'>
              <IconButton size='small' onClick={() => onRowDelete(index)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default Component;
