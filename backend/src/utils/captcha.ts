import fetch from "node-fetch";
import { isDevEnvironment } from "./misc";

type CaptchaData = {
  success: boolean;
  challenge_ts?: number;
  hostname: string;
  "error-codes"?: string[];
};

export async function verify(captcha: string): Promise<boolean> {
  if (isDevEnvironment()) {
    return true;
  }
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env["RECAPTCHA_SECRET"]}&response=${captcha}`,
    }
  );

  if (!response.ok) {
    return false;
  } else {
    const captchaData = (await response.json()) as CaptchaData;
    return captchaData.success;
  }
}
