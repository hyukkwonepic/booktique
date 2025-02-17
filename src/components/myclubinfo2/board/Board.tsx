'use client';

import { fetchPosts } from '@/utils/postAPIs/postAPI';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import ArticleTimeStamp from './boardDetail/ArticleTimeStamp';

const Board = ({ clubId }: { clubId: string }) => {
  const {
    data: posts,
    error,
    isLoading
  } = useQuery({
    queryKey: ['posts', clubId],
    queryFn: fetchPosts,
    staleTime: 1000 * 120
  });

  if (isLoading && !posts) return <div>로딩중</div>;

  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className='w-full'>
      {posts?.map(
        (
          post //FIXME - query는 타입명시 필요
        ) => (
          <div key={post.id} className=' border-b'>
            <div className='m-4 flex'>
              <Link
                className='w-full'
                href={`/myclubinfo2/board/detail/${post.id}?clubId=${clubId}`}>
                <section className='flex gap-1 items-center'>
                  {post.profile?.photo_URL && (
                    <Image
                      className='rounded-full w-6 h-6'
                      src={post.profile?.photo_URL}
                      alt='유저 프로필'
                      width={24}
                      height={24}
                    />
                  )}
                  <p className={'text-xs'}>{post.profile?.display_name}</p>
                  <ArticleTimeStamp created_at={post.created_at} />
                </section>
                <section className='mt-2 min-h-[90px] w-full flex justify-between'>
                  <div className='flex flex-col'>
                    <p className=' font-bold w-full break-words line-clamp-2'>
                      {post.title}
                    </p>
                    <p className='mt-1 mb-1 text-xs break-words line-clamp-2'>
                      {post.content}
                    </p>
                  </div>
                  {post.thumbnail ? (
                    <Image
                      src={`${post.thumbnail}?${Math.random()}`}
                      alt='썸네일'
                      width={88}
                      height={88}
                    />
                  ) : (
                    <></>
                  )}
                </section>
              </Link>
            </div>
          </div>
        )
      )}
      <div className='flex justify-end w-full'>
        <Link
          className='py-[15px] px-[20px] fixed bottom-24 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300 font-bold cursor-pointer bg-mainblue'
          href={`/myclubinfo2/board/posting/${crypto.randomUUID()}?clubId=${clubId}`}>
          글 쓰러가기
        </Link>
      </div>
    </div>
  );
};

export default Board;
