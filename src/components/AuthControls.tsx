import { cookies } from "next/headers";
import {
  AuthUserButton,
  LoginUserButton,
} from "./lottie-user-button/LottieUserBtn";
import { decodeToken } from "@/actions/users";
import { findUserById } from "@/database/repository/user/select";

export async function AuthControls() {
  const refreshToken = cookies().get("refresh_token");
  if (refreshToken?.value) {
    const payload = decodeToken(refreshToken?.value);
    if (typeof payload !== "string") {
      const { data: user } = await findUserById({ id: payload.userId });
      return <AuthUserButton user={user} />;
    }
  }

  return <LoginUserButton />;
}
