
import { ValidationError } from "../types/validationError";
import { AvailableResolutions } from "../types/video";
import {videoUpdateDto} from "../dto/video.update-dto";

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
    if (
        !videoUpdate.author ||
        // videoInput.author.trim().length < 2 ||
        videoUpdate.author.trim().length > 20
    ) {
        errors.push({ field: "author", message: "Invalid author name" });
    }
    if (
        !videoUpdate.title ||
        // videoInput.title.trim().length < 2 ||
        videoUpdate.title.trim().length > 40
    ) {
        errors.push({ field: "title", message: "Invalid title name" });
    }
    if (
        !videoUpdate.minAgeRestriction ||
        // videoInput.title.trim().length < 2 ||
        videoUpdate.minAgeRestriction > 18 ||
        videoUpdate.minAgeRestriction < 1
    ) {
        if (videoUpdate.minAgeRestriction === null) {
            errors.push({ field: "minAgeRestriction", message: "null - no restriction" })
        }
        errors.push({ field: "minAgeRestriction", message: "Invalid min or max age" });
    }
    if (
        !videoUpdate.availableResolutions ||
        !isInclude(videoUpdate.availableResolutions)
    ) {
        errors.push({ field: "availableResolutions", message: "Unacceptable resolution name(s)" });
    }
    if (
       typeof !videoUpdate.publicationDate !== typeof new Date()

    ) {
        errors.push({ field: "publicationDate", message: "Unacceptable publication date format" });
    }
    return errors;
};
