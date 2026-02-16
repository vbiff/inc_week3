// declare global {
//   namespace Express {
//     interface Request {
//       user: idType | null;
//     }
//   }
// }
//
// type idType = {
//   id: string;
// };

import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      deviceId: string;
    } | null;
  }
}
