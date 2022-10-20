import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private datePipe: DatePipe) {
  }

  jsToHtmlDate(jsDate: Date) {
    return this.datePipe.transform(jsDate, 'yyyy-MM-ddTHH:mm') || undefined;
  }

  isoToHtmlDate(isoDate?: string) {
    if(!isoDate) {
      return;
    }
    return this.datePipe.transform(new Date(isoDate), 'yyyy-MM-ddTHH:mm') || undefined;
  }

  htmlToIso(htmlDate: string) {
    return new Date(htmlDate + ':00.000').toISOString();
  }
}
