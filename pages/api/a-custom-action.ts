// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// import url from "node:url";

//
// https://example.com/api/custom-action?sign_up_id=<my_sign_up_id>
//
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // check hubspot

  // if bad err
  // {error: "some custom error"}

  // else

  const params = new URLSearchParams({ custom_action: "true" });
  axios
    .patch(
      `https://api.clerk.dev/v1/sign_ups/${req.body["sign_up_id"]}`,
      params.toString(),
      { headers: { Authorization: `Bearer ${process.env.CLERK_API_KEY}` } }
    )
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: `oh no what happened... ${err}` });
    });
}
