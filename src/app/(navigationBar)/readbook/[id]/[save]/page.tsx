import { createClient } from '@/utils/supabase/server';
import React from 'react';
import SaveBookInfo from './SaveBookInfo';
import SaveCard from './SaveCard';
// import Link from 'next/link';
import { redirect } from 'next/navigation';

const SavePage = async ({ params: { id } }: { params: { id: string } }) => {
  // id는 클럽 id임
  //   const page = async ({
  //   params: { id }
  // }: {
  //   params: { id: string };
  // }) => {
  //   const id = props.params.id;
  const supabase = createClient();

  const clubId = id;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', user?.id);
  if (!user?.id) {
    redirect('/login');
  }
  // if (user?.id === null || user?.id === undefined) {
  //   return;
  // }
  // if (user?.id === null || user?.id === undefined) {
  //   return <Link href={'/login'}>dd</Link>;
  // }
  // <Link> 컴포넌트는 단순히 다른 페이지로의 링크를 설정할 뿐, 화면에는 나타나지 않습니다.
  const { data: clubMembers, error: membersError } = await supabase
    .from('members')
    .select('*')
    .eq('club_id', id);
  if (membersError) {
    throw new Error('멤버 정보를 가져오는 도중 오류가 발생했습니다.');
  }
  // console.log('clubMembers', clubMembers);
  //   clubMembers는 회원 정보 배열
  const profilePromises = clubMembers?.map(async (clubMember) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clubMember.user_id as string)
      .single();
    // console.log('data', data);
    if (error) {
      throw new Error('프로필 정보를 가져오는 도중 오류가 발생했습니다');
    }
    // data는 클럽 회원의 프로필 정보 객체
    return data;
  });
  const profilesData = await Promise.all(profilePromises || []);
  //   profilesData는 모든 회원의 프로필 정보 배열
  // console.log('profilesData', profilesData);
  const matchingProfile = profilesData.find(
    (profile) => profile?.id === user?.id
  );
  // console.log('matchingProfile', matchingProfile);
  const myProfileId = matchingProfile?.id;

  // console.log('myProfileId', myProfileId);

  // 내가 한 모든 클럽 액티비티
  const { data: clubActivities, error: activitiesError } = await supabase
    .from('club_activities')
    .select('*')
    .eq('club_id', clubId)
    .eq('user_id', myProfileId || '');

  console.log('clubActivities1111111111111111111', clubActivities);

  const myClubActivities = clubActivities;

  if (activitiesError) {
    throw new Error('클럽 활동 정보를 가져오는 도중 오류가 발생했습니다.');
  }

  // const matchingActivities = clubActivities.filter(
  //   (activity) => activity.club_id === id
  // );
  // console.log('matchingActivities', matchingActivities);
  // clubs 테이블에서 클럽 ID와 param(코드 최상단)에 해당하는 데이터 조회
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .single();

  if (clubError) {
    throw new Error('클럽 정보를 가져오는 도중 오류가 발생했습니다.');
  }
  // console.log('matchingActivities1111', matchingActivities);
  return (
    <div className='bg-white h-full'>
      {/* <SaveBookInfo clubData={club} clubId={id} /> */}
      <SaveCard
        clubId={clubId}
        club={club}
        myClubActivities={
          myClubActivities?.filter((activity) => activity !== null) ?? []
        }
      />
    </div>
  );
};

export default SavePage;
