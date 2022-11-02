import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserApiService } from './user-api.service';
import { AuthService } from '../modules/core/services/auth.service';
import { distinctUntilChanged, filter, of, switchMap, tap, withLatestFrom } from 'rxjs';

interface GoogleSpreadsheetApiParams {
  spreadsheetId: string;
  range: string;
  valueRenderOption?: string;
  dateTimeRenderOption?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSpreadsheetApiService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  get({
        spreadsheetId,
        range,
        valueRenderOption = 'FORMATTED_VALUE',
        dateTimeRenderOption = 'FORMATTED_STRING'
      }: GoogleSpreadsheetApiParams) {
    const url = `https://sheets.googleapis.com/v3/spreadsheets/${ spreadsheetId }/values/${ range }?dateTimeRenderOption=${ dateTimeRenderOption }&majorDimension=ROWS&valueRenderOption=${ valueRenderOption }&key=${ environment.firebase.apiKey }`;
    return this.authService.accessToken$.pipe(
      distinctUntilChanged(),
      filter(token => !!token),
      switchMap(token => this.http.get(url, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authentication': `Bearer ${ token }`,
        })
      }))
    );
  }
}
