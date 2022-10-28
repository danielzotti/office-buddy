import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private datePipe: DatePipe) {
  }

  jsToHtmlDate(jsDate: Date) {
    return this.datePipe.transform(jsDate, environment.formatter.badgeIsoDateTime) || undefined;
  }

  isoToHumanDate(isoDate: string) {
    return this.datePipe.transform(isoDate, environment.formatter.badgeHumanDateTime) || undefined;
  }

  isoToHtmlDate(isoDate?: string) {
    if(!isoDate) {
      return;
    }
    return this.datePipe.transform(new Date(isoDate), environment.formatter.badgeIsoDateTime) || undefined;
  }

  htmlToIso(htmlDate: string) {
    return new Date(htmlDate + ':00.000').toISOString();
  }
}
