import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, mergeMap, switchMap, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnomedService {

  readonly host = '/';
  readonly branch = 'MAIN/SNOMEDCT-SE';

  constructor(private http: HttpClient) { }

  findDescriptions(param: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'en',
      })
    };

    return this.http.get(this.host + this.branch + '/concepts?activeFilter=true&language=en&offset=0&limit=10' +
      '&term=' + encodeURI(param.enTerm) +
      '&ecl=' + encodeURI(param.ecl),
      httpOptions).pipe(
        switchMap((data: any) => from(data.items)),
        mergeMap((concept: any) => {
          return this.http.get(
            this.host + this.branch + '/descriptions?concept=' + concept.conceptId,
            httpOptions).pipe(
              switchMap((data: any) => from(data.items)),
            );
        }),
        tap(console.log),
        filter<any>((description: any, index: number) => {
          console.log(param.enExp + ' ' + (description.term as string).match(param.enExp));
          return description.active && (description.term as string).match(param.enExp) != null;
        }),
      );
  }
}
