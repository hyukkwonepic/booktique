import Board from '@/components/myclubinfo2/board/Board';
import React from 'react';

type Props = {
  params: {
    clubId: string;
  };
};

const Page = (props: Props) => {
  return <Board clubId={props.params.clubId} />;
};

export default Page;
