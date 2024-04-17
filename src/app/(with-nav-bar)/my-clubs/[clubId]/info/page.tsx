'use client';

import { getOrCreateUserProfile } from '@/app/auth/authAPI';
import HomeTab from '@/components/myclubinfo2/HomeTab';
import { Tables } from '@/lib/types/supabase';
import {
  getClubInfo,
  getUserClubIds,
  getUserId
} from '@/utils/userAPIs/authAPI';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Clubs = Tables<'clubs'>;

type Props = {};

const Page = (props: Props) => {
  const params = useParams<{
    clubId: string;
  }>();
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

  const club = clubs.find((club) => club.id === params.clubId);

  if (!club) {
    return null;
  }

  return <HomeTab club={club} />;
};

export default Page;
