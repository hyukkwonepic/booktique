'use client';
import LoadingOverlay from '@/common/LoadingOverlay';
import { Tables } from '@/lib/types/supabase';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import EndButton from './EndButton';

interface MemberListProps {
  clubMembers: Tables<'members'>[] | null;
}

const MemberList = ({ clubMembers }: MemberListProps) => {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Tables<'profiles'>[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilePromises = clubMembers?.map(async (clubMember) => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', clubMember.user_id)
            .single();
          console.log('data', data);
          if (error) {
            throw new Error('프로필 정보를 가져오는 도중 오류가 발생했습니다');
          }
          return data;
        });

        const profilesData = await Promise.all(profilePromises || []);
        console.log('profilesData', profilesData);
        setProfiles(profilesData);
        setLoading(false);
      } catch (error) {
        console.error('알수없는 오류가 발생했습니다 새로고침 해주세요');
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [clubMembers, supabase]);
  if (loading) {
    return <LoadingOverlay show={loading} />;
  }
  return (
    <div className=' flex flex-col '>
      <div className='mt-[230px] mb-[16px]'> 북클럽 멤버</div>
      <div className='flex flex-wrap ml-[16px] gap-[8px] justify-start'>
        {profiles?.map((profile, index) => (
          <div key={index} className='flex flex-col bg-[#d9d9d9]'>
            {profile?.photo_URL && (
              <figure className='relative w-[109px] h-[150px] mt-[15px]'>
                <Image
                  src={profile.photo_URL}
                  width={'56'}
                  height={'56'}
                  alt='프로필 이미지'
                  className='mx-[auto] rounded-full object-contain'
                />
                {profile?.display_name}
              </figure>
            )}
          </div>
        ))}
      </div>
      <EndButton />
    </div>
  );
};

export default MemberList;
