import { ValidatorFn, AbstractControl } from "@angular/forms";

export function pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let value = control.value as Date;
      let isPast = new Date().toDateString() < new Date(value).toDateString();
      
      return !isPast ? {'futureValue': {value: control.value}} : null;
    };
  }