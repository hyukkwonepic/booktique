'use client';
import React from 'react';
import { getClubInfo, getUserId } from '@/utils/userAPIs/authAPI';
import { getUserClubIds } from '@/utils/userAPIs/authAPI';
import { useState } from 'react';
import { useEffect } from 'react';
import HomeTab from '@/components/myclubinfo2/HomeTab';
import { Tables } from '@/lib/types/supabase';
import SentenceStorage from '@/components/myclubinfo2/SentenceStorage';
import NonMyClub from '@/components/myclubinfo2/NonMyClub';
import { getOrCreateUserProfile } from '@/app/auth/authAPI';
import Board from '@/components/myclubinfo2/board/Board';
import QuizArchiving from '@/components/myclubinfo2/QuizArchiving';
import { useTabStore } from '@/store/zustandStore';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Clubs = Tables<'clubs'>;

const PageClient = () => {
  const params = useParams<{
    clubId: string;
    tab: string;
  }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clubInfo, setClubInfo] = useState<Clubs[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // NOTE: 높은 확률로 필요없음
  const [isServer, setIsServer] = useState(true);

  const { selectedTab, selectedClubId, setSelectedTab, setSelectedClubId } =
    useTabStore();

  // tab: info, sentences, quizzes, posts
  console.log('selectedTab', selectedTab);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserId = await getUserId();
        setUserId(fetchedUserId);
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

            if (!selectedClubId && fetchedClubIds.length > 0) {
              setSelectedClubId(fetchClubInfo[0].id); // 첫 번째 북클럽을 선택
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    setIsServer(false);
  }, []);

  const handleClubChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedClubId = event.target.value;
    setSelectedClubId(newSelectedClubId);
  };
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  const getSelectClasses = () => {
    if (clubInfo.length <= 1) {
      return 'appearance-none text-[22px] font-bold p-2';
    }
    return ' p-2 font-bold text-[22px] max-w-[350px] overflow-hidden whitespace-nowrap';
  };

  // NOTE: 선택된 탭에 따라 컨텐츠를 렌더링하는 녀석
  const renderSelectedTabContents = () => {
    const selectedClub = clubInfo.find((club) => club.id === selectedClubId);

    if (!selectedClub || clubInfo.length === 0) {
      return <NonMyClub />;
    }
    switch (selectedTab) {
      case 'home':
        return <HomeTab club={selectedClub} />;
      case 'sentenceStorage':
        return (
          <SentenceStorage
            clubId={selectedClubId}
            bookpage={selectedClub.book_page}
            userId={userId}
          />
        );
      case 'board':
        return <Board clubId={selectedClubId} />;
      case 'quiz':
        return <QuizArchiving clubId={selectedClubId} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='sticky top-0 left-0 right-0 z-10 bg-white flex flex-col justify-between'>
        {/* 북클럽 셀렉트 박스 */}
        <div className='relative inline-block'>
          <select
            value={selectedClubId || ''}
            onChange={handleClubChange}
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
        </div>
        {/* 탭 버튼들 */}
        {/* TODO: 탭은 layout.tsx를 만들어서 거기다가 집어넣자. */}
        <div className='flex flex-row justify-between w-full font-bold'>
          <Link
            href={`/my-clubs/${params.clubId}/info`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              params.tab === 'info' ? { borderBottom: '2px solid black' } : {}
            }>
            <span
              className={`text-[16px] font-bold ${
                clubInfo.length !== 0 ? 'text-gray-500' : ''
              }`}>
              정보
            </span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/sentences`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              params.tab === 'sentences'
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span
              className={`text-[16px] font-bold ${
                clubInfo.length !== 0 ? 'text-gray-500' : ''
              }`}>
              문장 저장소
            </span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/quizzes`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              params.tab === 'quizzes'
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span
              className={`text-[16px] font-bold ${
                clubInfo.length !== 0 ? 'text-gray-500' : ''
              }`}>
              퀴즈
            </span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/posts`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              params.tab === 'posts' ? { borderBottom: '2px solid black' } : {}
            }>
            <span
              className={`text-[16px] font-bold ${
                clubInfo.length !== 0 ? 'text-gray-500' : ''
              }`}>
              자유 게시판
            </span>
          </Link>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className='mb-[78px] overflow-y-auto'>
        {!isLoading && renderSelectedTabContents()}
      </div>
    </div>
  );
};

export default PageClient;
