import {AvailableResolutions} from "../types/video";

export type videoUpdateDto = {
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: null;
    publicationDate: Date;
    availableResolutions: AvailableResolutions[];
};
