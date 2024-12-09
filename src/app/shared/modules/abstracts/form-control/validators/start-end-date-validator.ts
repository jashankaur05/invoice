import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * custom Validator for checking if end date is > =  to start date
 */
export function startEndDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const start = control.get('startDate');
        const end = control.get('endDate');
        return start?.value !== null &&
            end?.value !== null &&
            start?.value < end?.value
            ? null
            : { dateValid: true };
    };
}
