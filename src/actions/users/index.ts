"use server";

import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { COOKIES_OPTIONS } from "@/utils/config";
import {EmailSignupFormPayload} from "@/components/auth/email";
import {connectDB} from "@/database";

export const generateToken = async (payload: Object) => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: eval(process.env.SESSION_EXPIRY!),
    });
  }
};

/*TODO: Move this into a model*/
export const createNewUser = async (values: EmailSignupFormPayload) => {
  const connection = await connectDB();
  const [existUser] = await connection.execute(
    "SELECT `email` FROM `users` WHERE `email` = ?",
    [values.email]
  );
  if (Array.isArray(existUser) && existUser.length > 0) {
    connection.destroy();
    return {
      error: "user exist",
    };
  }
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(values.password, salt);
  const [result] = await connection.query(
    "INSERT INTO `users` (`email_verification`, `refresh_token`, `avatar`, `active`, `first_name`, `birthday`, `last_name`, `email`, `phone_number`, `password`, `facebook_id`) " +
      "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      false,
      null,
      "https://scontent.fsgn5-3.fna.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=XyWt8Z2JeBcAX894iLG&_nc_ht=scontent.fsgn5-3.fna&edm=AP4hL3IEAAAA&oh=15811581152ebb890135bfd3201e3439&oe=61D27B38",
      true,
      values.firstname,
      dayjs().format("YYYY-MM-DD"),
      values.lastname,
      values.email,
      null,
      encryptedPassword,
      null,
    ]
  );
  let newUser: any;
  if ("insertId" in result) {
    const token = await generateToken({ userId: result.insertId });
    await connection.query(
      "UPDATE `users` SET `refresh_token` = ? WHERE ID = ?;",
      [token, result.insertId]
    );
    const [users] = await connection.query(
      "SELECT * from `users` WHERE `ID` = ? ",
      result.insertId
    );
    if (Array.isArray(users)) {
      newUser = users[0];
    }
    connection.destroy();
  }
  cookies().set("refresh_token", newUser.refresh_token || "", COOKIES_OPTIONS);

  return newUser;
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
