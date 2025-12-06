import {ValidationError} from "../../videos/types/validationError";

export const createErrorMessage = (
    errors: ValidationError[],): {errorMessage: ValidationError[] } => {
    return {errorMessage: errors};
}