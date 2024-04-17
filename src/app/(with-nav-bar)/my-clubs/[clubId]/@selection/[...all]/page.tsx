'use client';

import { getOrCreateUserProfile } from '@/app/auth/authAPI';
import { Tables } from '@/lib/types/supabase';
import {
  getClubInfo,
  getUserClubIds,
  getUserId
} from '@/utils/userAPIs/authAPI';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Clubs = Tables<'clubs'>;

type Props = {};

const Page = (props: Props) => {
  const params = useParams<{
    clubId: string;
  }>();

  const router = useRouter();
  // TODO: hook으로 만들어서 재사용하던지... 음... 최상단에서 한번만 호출해서 props로 나리던지... memoization을 하던지...
  const [clubInfo, setClubInfo] = useState<Clubs[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserId = await getUserId();
        if (fetchedUserId) {
          const fetchedUserProfile = await getOrCreateUserProfile();
          if (fetchedUserProfile) {
            const fetchedClubIds = await getUserClubIds(fetchedUserId);
            const fetchClubInfo = await getClubInfo(
              fetchedClubIds.filter(
                (id) => !clubInfo.find((club) => club.id === id)?.archive
              )
            );
            setClubInfo(fetchClubInfo);

            // TODO: 이거 나중에 처리하기
            // if (!selectedClubId && fetchedClubIds.length > 0) {
            //   setSelectedClubId(fetchClubInfo[0].id); // 첫 번째 북클럽을 선택
            // }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const getSelectClasses = () => {
    if (clubInfo.length <= 1) {
      return 'appearance-none text-[22px] font-bold p-2';
    }
    return ' p-2 font-bold text-[22px] max-w-[350px] overflow-hidden whitespace-nowrap';
  };

  return (
    <select
      value={params.clubId || ''}
      onChange={(event) => {
        router.push(`/my-clubs/${event.target.value}/info`);
      }}
      className={getSelectClasses()}>
      {clubInfo.length === 0 && <option value=''>내 북클럽</option>}
      {clubInfo.map((club) => {
        const displayText =
          club.name!.length > 20
            ? club.name!.substring(0, 17) + '...'
            : club.name;
        return (
          <option key={club.id} value={club.id} className=''>
            {displayText}
          </option>
        );
      })}
    </select>
  );
};

export default Page;
