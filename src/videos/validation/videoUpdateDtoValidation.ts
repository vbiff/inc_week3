import { ValidationError } from "../../core/types/validationError";
import { AvailableResolutions } from "../types/video";
import { videoUpdateDto } from "../dto/video.update-dto";

export const videoUpdateDtoValidation = (videoUpdate: videoUpdateDto) => {
  const errors: ValidationError[] = [];

  const isInclude = (resolutions: string[]): boolean => {
    const allResolution = Object.values(AvailableResolutions) as string[];
    for (let i = 0; i < resolutions.length; i++) {
      if (!allResolution.includes(resolutions[i])) {
        return false;
      }
    }
    return true;
  };

  //if
  if (!videoUpdate.author || videoUpdate.author.trim().length > 20) {
    errors.push({ field: "author", message: "author" });
  }
  if (!videoUpdate.title || videoUpdate.title.trim().length > 40) {
    errors.push({ field: "title", message: "Invalid title name" });
  }
  if (
    !videoUpdate.minAgeRestriction ||
    videoUpdate.minAgeRestriction > 18 ||
    videoUpdate.minAgeRestriction < 1
  ) {
    // if (videoUpdate.minAgeRestriction === null) {
    //    return;
    // }
    errors.push({
      field: "minAgeRestriction",
      message: "Invalid min or max age",
    });
  }
  if (
    !videoUpdate.availableResolutions ||
    !isInclude(videoUpdate.availableResolutions)
  ) {
    errors.push({
      field: "availableResolutions",
      message: "Unacceptable resolution name(s)",
    });
  }
  if (
    !videoUpdate.canBeDownloaded ||
    typeof (videoUpdate as any).canBeDownloaded !== "boolean"
  ) {
    errors.push({
      field: "canBeDownloaded",
      message: "Unacceptable canBeDownloaded",
    });
  }
  if (typeof (videoUpdate as any).publicationDate !== "string") {
    errors.push({
      field: "publicationDate",
      message: "Unacceptable publication date format",
    });
  }
  return errors;
};
