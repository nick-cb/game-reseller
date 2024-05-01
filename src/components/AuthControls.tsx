import { cookies } from 'next/headers';
import { AuthUserButton, LoginUserButton } from './lottie-user-button/LottieUserBtn';
import ShareActions from '@/actions2/share';

export async function AuthControls() {
  const refreshToken = cookies().get('refresh_token');
  if (refreshToken?.value) {
    const payload = await ShareActions.users.decodeToken({ token: refreshToken.value });
    if (typeof payload !== 'string') {
      const { data } = await ShareActions.users.getUserByID(payload.user.ID);
      if (data) {
        return <AuthUserButton user={data} />;
      }
    }
  }

  return <LoginUserButton />;
}
