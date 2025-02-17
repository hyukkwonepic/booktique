import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/auth/callback`
    }
  });
};
//나의찬,남해리,양희철그리고 황인정
export const kakaoLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/auth/callback`
    }
  });
  if (data) {
    return console.log('카카오 로그인 성공');
  }
  if (error) {
    return console.error('카카오 로그인 에러: ', error);
  }
};
