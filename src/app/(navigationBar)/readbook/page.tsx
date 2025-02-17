import React, { Suspense } from 'react';
import ReadBookLayout from '../readbook/layout';
import Image from 'next/image';
import noclub from '../../../../public/noclub.png';
import blue from '../../../../public/booktiquereadblue.png';
import { createClient } from '@/utils/supabase/server';
import ClubList from './ClubList';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const ReadBookPage = async () => {
  revalidatePath('/', 'layout');
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user?.id) {
    redirect('/login');
  }

  const { data: memberData, error: memberError } = await supabase
    .from('members')
    .select('club_id')
    .eq('user_id', user?.id as string);

  if (memberError) {
    throw new Error(
      '해당 회원이 등록된 클럽정보를 가져오는 도중 오류가 발생했습니다.'
    );
  }

  const clubDataPromises = memberData.map(async (member) => {
    const clubId = member.club_id;
    const { data: clubData, error: clubError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();
    // console.log('clubData', clubData);
    if (clubError) {
      throw new Error('클럽 정보를 가져오는 도중 오류가 발생했습니다.');
    }
    return clubData;
  });

  const allClubData = await Promise.all(clubDataPromises);

  // const { data: activitiesData, error: activitiesError } = await supabase
  //   .from('club_activities')
  //   .select('*')
  //   .eq('user_id', user?.id as string);
  // console.log('activitiesData', activitiesData);
  // if (activitiesError) {
  //   throw new Error('클럽 활동을 가져오는 도중 오류가 발생했습니다.');
  // }

  const { data: bookClubsData, error: bookClubsError } = await supabase
    .from('clubs')
    .select('*');
  if (bookClubsError) {
    throw new Error('책 정보를 가져오는 도중 오류가 발생했습니다.');
  }
  const filteredBookClubsData = bookClubsData.filter((bookClub) => {
    return allClubData.some((club) => club.id === bookClub.id);
  });

  return (
    <ReadBookLayout>
      <Suspense fallback={<></>}>
        {filteredBookClubsData.length > 0 ? (
          <>
            <div></div>
            <Image
              src={blue}
              width={134}
              height={26}
              alt={'booktique'}
              className='pt-[38px] mx-auto mb-[24px]'
              priority={true}
            />
            <ClubList
              id={user?.id as string}
              filteredBookClubsData={filteredBookClubsData}
            />
          </>
        ) : (
          /* 가입한 북클럽이 없습니다. 북클럽에 가입해서 책 읽어보세요 */
          <div className='flex flex-col'>
            <div></div>
            <Image
              src={blue}
              width={134}
              height={26}
              alt={'booktique'}
              className='pt-[38px] mx-auto'
              priority={true}
            />
            <div className='flex flex-row'>
              <div className='bg-[#DBE3EB] mb-[40px] w-[302px] h-[464px] rounded-[20px]  mx-auto mt-[24px]'>
                <div className='flex mt-[108px] mb-[37px] w-[196px] h-[48px] text-center font-bold text-[18px] leading-[24px] text-[white]  mx-auto justify-center items-center'>
                  가입한 북클럽이 없습니다. 북클럽에 가입해서 책 읽어보세요
                </div>
                <Image
                  src={noclub}
                  width={166}
                  height={166}
                  alt={'noclub'}
                  className=' w-[166px] h-[166px] mx-auto'
                />
              </div>
            </div>

            <button className='bg-[#DBE3EB] w-[302px] h-[56px] rounded-full text-white mx-auto'>
              북클럽 책읽기
            </button>
          </div>
        )}
      </Suspense>
    </ReadBookLayout>
  );
};

export default ReadBookPage;
