import { cookies } from 'next/headers';
import { AuthUserButton, LoginUserButton } from './lottie-user-button/LottieUserBtn';
import UserActions from '@/actions/users-actions';

export async function AuthControls() {
  const refreshToken = cookies().get('refresh_token');
  if (refreshToken?.value) {
    const payload = await UserActions.users.decodeToken({ token: refreshToken.value });
    if (typeof payload !== 'string') {
      const { data } = await UserActions.users.getUserByID(payload.user.ID);
      if (data) {
        return <AuthUserButton user={data} />;
      }
    }
  }

  return <LoginUserButton />;
}
