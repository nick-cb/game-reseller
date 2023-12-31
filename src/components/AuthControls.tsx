import { cookies } from "next/headers";
import {
  AuthUserButton,
  LoginUserButton,
} from "./lottie-user-button/LottieUserBtn";
import { decodeToken, findUserById } from "@/actions/users";

export async function AuthControls() {
  const refreshToken = cookies().get("refresh_token");
  if (refreshToken?.value) {
    const payload = decodeToken(refreshToken?.value);
    if (typeof payload !== "string") {
      const { data: user } = await findUserById({ id: payload.userId });
      if (user) {
        return <AuthUserButton user={user} />;
      }
    }
  }

  return <LoginUserButton />;
}
