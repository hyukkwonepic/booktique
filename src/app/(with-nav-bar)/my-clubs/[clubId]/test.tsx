'use client';

import { useEffect } from 'react';

type Props = {};

const Test = (props: Props) => {
  useEffect(() => {
    console.log('호출이 되나요?');
  }, []);
  return <div>Test</div>;
};

export default Test;
