import React from 'react';
import { Tables } from '@/lib/types/supabase';
type Clubs = Tables<'clubs'>;
import { createClient } from '@/utils/supabase/server';

import Link from 'next/link';
const MyBookClub = async ({ userId }: { userId: string }) => {
  const supabase = createClient();

  const { data } = await supabase
    .from('members')
    .select('club_id')
    .eq('user_id', userId);
  const clubIds = data?.map((row: any) => row.club_id) || [];
  if (clubIds.length === 0) {
    return [];
  }
  const { data: clubData } = await supabase
    .from('clubs')
    .select('*')
    .in('id', clubIds)
    .order('created_at', { ascending: false });

  return (
    <div className='mt-6'>
      <ul>
        {clubData?.slice(0, 4).map((club) => (
          <li
            key={club.id}
            className='bg-[#F6F7F9] rounded-lg p-4 mt-2 flex flex-row items-center'>
            <div className='flex flex-col'>
              {club.archive ? (
                <p className='text-center w-[37px] h-[17px] px-1 border text-[10px] text-white bg-[#B3C1CC] rounded-md'>
                  종료
                </p>
              ) : (
                <p className='text-center px-1 border w-[37px] h-[17px] text-[10px] text-white bg-subblue rounded-md'>
                  진행중
                </p>
              )}
              <div className='w-[178px]'>{club.name}</div>
            </div>

            <div className='ml-auto'>
              <Link href={'/'}>
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7.56294 4.03125L14.4379 10.9062L7.375 17.9688'
                    stroke='#B3C1CC'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                  />
                </svg>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookClub;
