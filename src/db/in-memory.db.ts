//db
import { AvailableResolutions, Video } from "../videos/types/video";

export const db = {
  videos: <Video[]>[
    {
      id: 0,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: [AvailableResolutions.P144],
    },
    {
      id: 1,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: [AvailableResolutions.P240],
    },
    {
      id: 2,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),
      availableResolutions: [AvailableResolutions.P720],
    },
  ],
};
