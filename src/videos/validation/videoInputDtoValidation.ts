import { videoInputDto } from "../dto/video.input-dto";
import { ValidationError } from "../types/validationError";
import { AvailableResolutions } from "../types/video";

export const videoInputDtoValidation = (videoInput: videoInputDto) => {
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
  if (
    !videoInput.author ||
    // videoInput.author.trim().length < 2 ||
    videoInput.author.trim().length > 20
  ) {
    errors.push({ field: "author", message: "Invalid author name" });
  }
  if (
    !videoInput.title ||
    // videoInput.title.trim().length < 2 ||
    videoInput.title.trim().length > 40
  ) {
    errors.push({ field: "title", message: "Invalid title name" });
  }
  if (
    !videoInput.availableResolutions ||
    !isInclude(videoInput.availableResolutions)
  ) {
    errors.push({ field: "availableResolutions", message: "Unacceptable resolution name(s)" });
  }
  return errors;
};
