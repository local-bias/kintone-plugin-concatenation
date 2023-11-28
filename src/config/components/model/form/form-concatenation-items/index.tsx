import React, { FC, Fragment } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { CONCATENATION_ITEM_TYPES } from '@/lib/plugin';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { concatenationItemsState } from '@/config/states/plugin';
import { produce } from 'immer';
import StringForm from './string';
import FieldForm from './field';
import Summary from './accordion-summary';

const Component: FC = () => {
  const items = useRecoilValue(concatenationItemsState);

  const onRowAdd = useRecoilCallback(
    ({ set }) =>
      (index: number) => {
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            draft.splice(index + 1, 0, {
              type: 'string',
              value: '',
              isOmittedIfPreviousEmpty: false,
              isOmittedIfNextEmpty: false,
            });
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
      (index: number, value: Plugin.ConcatenationType) =>
        set(concatenationItemsState, (prev) =>
          produce(prev, (draft) => {
            const target = draft[index];
            target.type = value;
            switch (target.type) {
              case 'string':
                target.value = '';
                target.isOmittedIfPreviousEmpty = false;
                break;
              case 'field':
                target.value = '';
                target.format = '';
                break;
            }
          })
        ),
    []
  );

  return (
    <div className='grid gap-2'>
      {items.map((item, index) => (
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <Accordion key={index}>
              <Summary item={item} />
              <AccordionDetails>
                <div className='flex-1 grid grid-cols-10 gap-4'>
                  <div className='col-span-3'>
                    <TextField
                      variant='outlined'
                      color='primary'
                      label='タイプ'
                      select
                      fullWidth
                      value={item.type}
                      onChange={(e) =>
                        onTypeChange(index, e.target.value as Plugin.ConcatenationType)
                      }
                    >
                      {CONCATENATION_ITEM_TYPES.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <StringForm item={item} index={index} />
                  <FieldForm item={item} index={index} />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
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
        </div>
      ))}
    </div>
  );
};

export default Component;
