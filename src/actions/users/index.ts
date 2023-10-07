"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { COOKIES_OPTIONS } from "@/utils/config";
import {
  EmailLoginFormPayload,
  EmailSignupFormPayload,
} from "@/components/auth/email";
import { connectDB } from "@/database";
import { findUserByEmail } from "@/database/repository/user/select";
import { insertUser } from "@/database/repository/user/insert";
import { updateUserById } from "@/database/repository/user/update";
import { bucket } from "@/firebase";
import { uuidv4 } from "@/utils";

export const generateToken = async (payload: Object) => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: eval(process.env.SESSION_EXPIRY!),
    });
  }
  throw new Error("No JWT_SECRET found");
};

export const decodeToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Not found JWT_SECRET");
  }
  const payload = jwt.verify(token, secret);
  if (typeof payload !== "string") {
    return payload as jwt.JwtPayload & { userId: number };
  }
  return payload;
};

/*TODO: Move this into a model*/
export const createNewUser = async (values: EmailSignupFormPayload) => {
  try {
    const connection = await connectDB();
    const existUser = await findUserByEmail({
      email: values.email,
      db: connection,
    });
    if (existUser.data) {
      connection.destroy();
      return {
        ok: false,
        error: "user exist",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(values.password, salt);
    const { data: inserteduser } = await insertUser({
      user: {
        ...values,
        password: encryptedPassword,
        avatar: null,
      },
      db: connection,
    });
    const avatar = await fetch(
      "https://api.dicebear.com/7.x/lorelei/svg?seed=" + uuidv4(),
    ).then((res) => res.arrayBuffer());
    const fileName = inserteduser.ID + uuidv4() + "avatar.svg";
    const file = bucket.file(fileName);
    await file
      // @ts-ignore
      .save(new Uint8Array(avatar), async () => {
        await file.makePublic();
      })
      .then(async () => {
        const token = await generateToken({ userId: inserteduser.ID });
        const url = file.publicUrl();
        await updateUserById(inserteduser.ID, {
          user: {
            refresh_token: token,
            avatar: url,
          },
        });
        connection.destroy();
        cookies().set("refresh_token", token || "", COOKIES_OPTIONS);
      });

    return { ok: true, data: null };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Something went wrong, please try again",
    };
  }
};

export const getLoggedInStatus = async () => {
  const cookie = cookies().get("refresh_token");
  if (!cookie) {
    return false;
  }

  const verifiedToken = jwt.verify(cookie.value, process.env.JWT_SECRET!);
  if (typeof verifiedToken === "string") {
    return false;
  }

  return true;
};

export const login = async (values: EmailLoginFormPayload) => {
  const { data: user } = await findUserByEmail({ email: values.email });
  if (!user) {
    return {
      error: "User not found",
    };
  }

  const matchPass = await bcrypt.compare(values.password, user.password);
  if (!matchPass) {
    return {
      error: "Wrong password",
    };
  }
  const token = await generateToken({ userId: user.ID });
  await updateUserById(user.ID, {
    user: {
      refresh_token: token,
    },
  });
  cookies().set("refresh_token", token);
  return {
    data: user,
  };
};

export const logout = async () => {
  try {
    const cookie = cookies().get("refresh_token");
    if (!cookie) {
      return;
    }
    const payload = jwt.verify(
      cookie.value,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload & { userId: number };
    if (typeof payload === "string") {
      return;
    }

    await updateUserById(payload.userId, {
      user: { refresh_token: null },
    });
    cookies().delete("refresh_token");
  } catch (error) {}
};
