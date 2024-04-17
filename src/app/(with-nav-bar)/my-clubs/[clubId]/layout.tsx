'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import ClubSelector from './ClubSelector';

type Props = {
  children: React.ReactNode;
  params: {
    clubId: string;
  };
};

const Layout = ({ children, params }: Props) => {
  const pathname = usePathname();

  return (
    <div>
      <div className='sticky top-0 left-0 right-0 z-10 bg-white flex flex-col justify-between'>
        {/* 북클럽 셀렉트 박스 */}
        <div className='relative inline-block'>
          <ClubSelector />
        </div>
        <div className='flex flex-row justify-between w-full font-bold'>
          <Link
            href={`/my-clubs/${params.clubId}/info`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              pathname.includes('info')
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span>정보</span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/sentences`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              pathname.includes('sentences')
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span>문장 저장소</span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/quizzes`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              pathname.includes('quizzes')
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span>퀴즈</span>
          </Link>

          <Link
            href={`/my-clubs/${params.clubId}/posts`}
            className='flex flex-1 px-2 py-2 focus:outline-none justify-center'
            style={
              pathname.includes('posts')
                ? { borderBottom: '2px solid black' }
                : {}
            }>
            <span>자유 게시판</span>
          </Link>
        </div>
      </div>
      <div className='mb-[78px] overflow-y-auto'>
        {/* 탭 컨텐츠 */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
