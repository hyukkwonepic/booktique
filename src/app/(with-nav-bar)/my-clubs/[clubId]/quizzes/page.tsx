import QuizArchiving from '@/components/myclubinfo2/QuizArchiving';
import React from 'react';

type Props = {
  params: {
    clubId: string;
  };
};

const Page = (props: Props) => {
  return <QuizArchiving clubId={props.params.clubId} />;
};

export default Page;
