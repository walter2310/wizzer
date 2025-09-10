import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  convertDateToDDMMYYYYFormat(date: Date): string {
    const dateToString = date.toISOString();
    const formattedDate = dateToString.split('T')[0];
    const [year, month, day] = formattedDate.split('-');

    const formattedDateDDMMYYYY = `${day}/${month}/${year}`;

    return formattedDateDDMMYYYY;
  }
}
