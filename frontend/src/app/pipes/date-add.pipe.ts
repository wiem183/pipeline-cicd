import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'dateAdd' })
export class DateAddPipe implements PipeTransform {
transform(value: Date, days: number): Date {
const newDate = new Date(value);
newDate.setDate(newDate.getDate() + days);
return newDate;
}
}