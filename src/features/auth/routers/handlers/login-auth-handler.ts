import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { authService } from "../../../../composition-root";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";

export async function loginAuthHandler(req: Request, res: Response) {
  try {
    const title = req.headers["user-agent"] || "Unknown device";
    const ip = req.ip || "Unknown ip";
    const authResult = await authService.login(req.body, title, ip);

    if (authResult.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(authResult.status))
        .send(authResult.extensions);
      return;
    }
    res
      .cookie("refreshToken", authResult.data?.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 900000),
        path: "/",
      })
      .status(HttpStatuses.OK_200)
      .send({ accessToken: authResult.data?.accessToken });
  } catch (e) {
    console.error(e);
    res.sendStatus(HttpStatuses.SERVERERROR_500);
  }
}
