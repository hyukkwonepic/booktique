'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import mybookclub from '../../../public/footer_mybookclub.png';
import mybookclubActive from '../../../public/footer_mybookclubactive.png';
import readbook from '../../../public/footer_readbook.png';
import readbookActive from '../../../public/footer_readbookactive.png';
import search from '../../../public/footer_searchclub.png';
import searchActive from '../../../public/footer_searchclubactive.png';
import mypage from '../../../public/footer_mypage.png';
import mypageActive from '../../../public/footer_mypageactive.png';

const Footer = () => {
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }
  }, []);

  const handleClick = (link: string) => {
    setActiveLink(link);
    localStorage.setItem('activeLink', link);
  };

  return (
    <div className='w-full md:w-[375px] h-[78px] fixed bottom-0 bg-white border-t-[4px] mx-auto'>
      <ul className='flex w-[90%] mx-auto justify-between  h-auto items-center text-[12px] text-center leading-[18px] font-medium px-2'>
        <li
          className={`flex h-[78px] justify-center ${
            activeLink === 'myclubinfo2'
              ? 'text-[#35A5F6] mb-[2px]'
              : 'text-[#B2B5B9] mb-[2px]'
          }`}>
          <Link href='/myclubinfo2' onClick={() => handleClick('myclubinfo2')}>
            <Image
              src={activeLink === 'myclubinfo2' ? mybookclubActive : mybookclub}
              alt='mybookclub'
              width={64.69}
              height={46}
              className='mt-1 w-[64.69px] h-[46px]'
            />
            내 북클럽
          </Link>
        </li>
        <li
          className={`flex  h-[78px] justify-center ${
            activeLink === 'readbook'
              ? 'text-[#35A5F6] mb-[2px]'
              : 'text-[#B2B5B9] mb-[2px]'
          }`}>
          <Link href='/readbook' onClick={() => handleClick('readbook')}>
            <Image
              src={activeLink === 'readbook' ? readbookActive : readbook} // 변경
              alt='mybookclub'
              width={64.69}
              height={46}
              className='mt-1 w-[64.69px] h-[46px]'
            />
            책 읽기
          </Link>
        </li>
        <li
          className={`flex  h-[78px] justify-center ${
            activeLink === 'bookclubs'
              ? 'text-[#35A5F6] mb-[2px]'
              : 'text-[#B2B5B9] mb-[2px]'
          }`}>
          <Link href='/bookclubs' onClick={() => handleClick('bookclubs')}>
            <Image
              src={activeLink === 'bookclubs' ? searchActive : search} // 변경
              alt='mybookclub'
              width={64}
              height={46}
              className='mt-1 w-[64px] h-[46px]'
            />
            북클럽 찾기
          </Link>
        </li>
        <li
          className={`flex  h-[78px] justify-center ${
            activeLink === 'mypage'
              ? 'text-[#35A5F6] mb-[2px]'
              : 'text-[#B2B5B9] mb-[2px]'
          }`}>
          <Link href='/mypage' onClick={() => handleClick('mypage')}>
            <Image
              src={activeLink === 'mypage' ? mypageActive : mypage} // 변경
              alt='mybookclub'
              width={64}
              height={46}
              className='mt-1 w-[64px] h-[46px]'
            />
            마이 페이지
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
