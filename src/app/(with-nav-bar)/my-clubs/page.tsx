'use client';

import { getOrCreateUserProfile } from '@/app/auth/authAPI';
import NonMyClub from '@/components/myclubinfo2/NonMyClub';
import { Tables } from '@/lib/types/supabase';
import {
  getUserId,
  getUserClubIds,
  getClubInfo
} from '@/utils/userAPIs/authAPI';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Clubs = Tables<'clubs'>;

type Props = {};

const Page = (props: Props) => {
  // TODO: 내 북클럽 찾아서 첫번째 녀석으로 리다이렉션
  // id: abcd-1234-efgh
  // redirect(/my-clubs/abcd-1234-efgh/info)

  const router = useRouter();

  const [clubs, setClubs] = useState<Clubs[]>([]);

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
                (id) => !clubs.find((club) => club.id === id)?.archive
              )
            );
            setClubs(fetchClubInfo);

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

  if (clubs.length === 0) {
    // return <div>로딩중...</div>;
    return null;
  }

  // get first item of clubs
  const club = clubs[0];
  if (!club) {
    return (
      <>
        <div>눈 속임 nav bar</div>
        <NonMyClub />
      </>
    );
  }

  // return <div>Page</div>;
  router.push(`/my-clubs/${club.id}/info`);
  return null;
};

export default Page;
