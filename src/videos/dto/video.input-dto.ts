import { AvailableResolutions } from "../types/video";

export type videoInputDto = {
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null;
  publicationDate: Date;
  availableResolutions: AvailableResolutions[];
};
