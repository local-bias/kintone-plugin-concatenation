import { targetFieldState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { stringFieldsState } from '@/config/states/kintone';

const Component: FC = () => {
  const fieldCode = useRecoilValue(targetFieldState);

  const onChange = useRecoilCallback(({ set }) => (value: string) => {
    set(targetFieldState, value);
  });

  return <RecoilFieldSelect state={stringFieldsState} fieldCode={fieldCode} onChange={onChange} />;
};

export default Component;
