'use client';
import React, { useEffect, useState } from 'react';
import { Tables } from '@/lib/types/supabase';
import { useRouter } from 'next/navigation';
import { getAllSentences, getSentenceComments } from '@/utils/userAPIs/authAPI';
import { createClient } from '@/utils/supabase/client';
import SentenceUser from './SentenceUser';
import SentenceModal from './SentenceModal';

type Sentences = Tables<'sentences'>;

const SentenceStorage = ({
  clubId,
  userId,
  bookpage
}: {
  clubId: string;
  userId: string | null;
  bookpage: number | null;
}) => {
  const router = useRouter();
  const supabase = createClient();
  const [sentences, setSentences] = useState<Sentences[]>([]);
  const [commentCounts, setCommentCounts] = useState<{
    [sentenceId: string]: number;
  }>({});
  const [isModal, setIsModal] = useState(false);
  useEffect(() => {
    fetchData();
  }, [clubId]);

  const fetchData = async () => {
    if (clubId) {
      const sentences = await getAllSentences(clubId);
      setSentences(sentences);
      fetchCommentCounts(sentences);
    }
  };

  const fetchCommentCounts = async (sentences: Sentences[]) => {
    const newCommentCountMap: { [sentenceId: string]: number } = {};
    for (const sentence of sentences) {
      const comments = await getSentenceComments(sentence.id);
      newCommentCountMap[sentence.id] = comments !== null ? comments.length : 0;
    }
    setCommentCounts(newCommentCountMap);
  };
  console.log('fetchCommentCounts', fetchCommentCounts);

  const handleSentenceClick = (id: string) => {
    router.push(`/sentences/${id}`);
  };
  const handleSentenceSaveBtn = () => {
    setIsModal(true);
  };
  const handleCloseModal = () => {
    setIsModal(false);
    fetchData();
  };
  return (
    <div>
      <ul className='p-4'>
        {sentences?.map((sentence) => (
          //Link로 디테일 페이지 보내기.
          <li
            key={sentence.id}
            className=' cursor-pointer py-4'
            onClick={() => handleSentenceClick(sentence.id)}>
            <SentenceUser sentenceId={sentence.user_id || ''} />
            <div className='bg-gray-100 rounded-md ml-7 px-4 py-2'>
              <div className='text-sm'>{sentence.sentence_content}</div>
              <div className='text-[11px] text-[#3F3E4E] overflow-hidden overflow-ellipsis whitespace-nowrap mt-1'>
                {sentence.sentence_page}p
              </div>
            </div>
            {/* <div className='text-sm text-gray-500'>
              {sentence.created_at}, {sentence.user_id}
            </div> */}
            {/* <div className='text-sm text-gray-500'>
              댓글 수: {commentCounts[sentence.id] || 0}
            </div> */}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSentenceSaveBtn}
        className='bg-mainblue py-[15px] px-[20px] absolute bottom-24 right-4 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300 font-bold cursor-pointer'>
        문장 공유하기
      </button>

      <SentenceModal
        bookpage={bookpage}
        isModal={isModal}
        onClose={handleCloseModal}
        clubId={clubId}
        userId={userId}
      />
    </div>
  );
};

export default SentenceStorage;
