import { cookies } from "next/headers";
import {
  AuthUserButton,
  LoginUserButton,
} from "./lottie-user-button/LottieUserBtn";
import { decodeToken, findUserById } from "@/actions/users";
import { testServerAction } from "@/actions/test";

export async function AuthControls() {
  const refreshToken = cookies().get("refresh_token");
  if (refreshToken?.value) {
    // testServerAction();
    const payload = decodeToken(refreshToken?.value);
    // if (typeof payload !== "string") {
    //   const { data: user } = await findUserById({ id: payload.userId });
    //   return <AuthUserButton user={user} />;
    // }
  }

  return <LoginUserButton />;
}
