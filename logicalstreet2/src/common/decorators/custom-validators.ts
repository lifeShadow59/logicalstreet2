import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Custom validator for minimum age
@ValidatorConstraint({ name: 'isAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(dob: string, args: ValidationArguments) {
    const birthDate = new Date(dob);
    const age = this.calculateAge(birthDate);
    const minAge = args.constraints[0] || 18;
    return age >= minAge;
  }

  defaultMessage(args: ValidationArguments) {
    const minAge = args.constraints[0] || 18;
    return `User must be at least ${minAge} years old`;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}

// Decorator function for minimum age
export function IsAdult(
  minAge: number = 18,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minAge],
      validator: IsAdultConstraint,
    });
  };
}

// Custom validator for future dates
@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: string) {
    const checkDate = new Date(date);
    const today = new Date();
    return checkDate <= today;
  }

  defaultMessage() {
    return 'Date cannot be in the future';
  }
}

// Decorator function for future date validation
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotFutureDateConstraint,
    });
  };
}
