'use client';

import {
  deletePostComment,
  fetchPostComments
} from '@/utils/api/postCommentAPIs/commentAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import ArticleTimeStamp from './ArticleTimeStamp';
import { getUserId } from '@/utils/userAPIs/authAPI';
import { useEffect, useState } from 'react';

const ArticleComment = ({ postId }: { postId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: fetchPostComments
  });

  const queryClient = useQueryClient();

  //삭제 로직
  const deleteCommentMutation = useMutation({
    mutationFn: deletePostComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });

  const handleDeleteComment = (id: string) => {
    deleteCommentMutation.mutate(id);
  };

  //user정보 get
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const getUser = async () => {
      const res = await getUserId();
      if (!res) return;
      setUserId(res);
    };
    getUser();
  }, []);

  if (!data || isLoading) return <div>로딩중</div>;
  return (
    <div>
      <div className=' h-[52px] text-sm text-fontGrayBlue items-center flex border-b-[1px]'>
        <p> 💬댓글 {data.length}</p>
      </div>
      {data.map((comment) => (
        <div key={comment.id} className='flex items-center gap-1 my-4 mx-4'>
          {comment.profile?.photo_URL ? (
            <Image
              className='w-8 h-8 rounded-full'
              src={comment.profile?.photo_URL}
              alt='야호링'
              width={32}
              height={32}
            />
          ) : (
            <Image
              src={'/booktique.png'}
              alt='야호링'
              width={32}
              height={32}
              className=' w-8 h-8 rounded-full'
            />
          )}
          <div className='gap-1'>
            <div className='flex gap-1'>
              <p className=' text-sm'>{comment.profile?.display_name}</p>
              <ArticleTimeStamp created_at={comment.created_at} />
              {userId === comment.user_id ? (
                <p
                  className='text-xs text-red-300'
                  onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </p>
              ) : (
                <></>
              )}
            </div>
            <p className='text-sm'>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleComment;
