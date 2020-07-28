import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, mergeMap, switchMap, filter, tap } from 'rxjs/operators';

export interface Param {
  term: string;
  ecl: string;
  criteria: {
    present: boolean;
    lang: string;
    regexp: string;
  }[];
}

export interface Description {
  active: boolean;
  released: boolean;
  releasedEffectiveTime: string;
  descriptionId: string;
  term: string;
  conceptId: string;
  moduleId: string;
  typeId: string;
  acceptabilityMap: {
       [key: string]: string;
  };
  type: string;
  caseSignificance: string;
  lang: string;
  effectiveTime: string;
}

export interface DescriptionItem {
  conceptId: string;
  descriptions: Description[];
  fsn: string;
}

@Injectable({
  providedIn: 'root'
})
export class SnomedService {

  readonly host = '/';
  readonly branch = 'MAIN/SNOMEDCT-SE';

  constructor(private http: HttpClient) { }

  findDescriptions(param: Param): Observable<any> {
    console.log(param);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv',
      })
    };

    return this.http.get(this.host + this.branch + '/concepts?activeFilter=true&offset=0&limit=100' +
      '&term=' + encodeURI(param.term) +
      '&ecl=' + encodeURI(param.ecl),
      httpOptions).pipe(
        switchMap((data: any) => from(data.items)),
        mergeMap((concept: any) => {
          return this.http.get(
            this.host + this.branch + '/descriptions?active=true&concept=' + concept.conceptId,
            httpOptions).pipe(
              map((x: any) => ({
                conceptId: concept.conceptId,
                descriptions: x.items.filter((desc: Description) => desc.active === true),
                fsn: concept.fsn.term,
            })),
            );
        }),
        filter((item: DescriptionItem) => {
          // all criteria must be fulfilled
          return param.criteria.every(c => {
            const r = RegExp(c.regexp);
            // console.log('-----------------------------');
            // console.log(c.present + ' ' + c.regexp + ' ' + c.lang);
            // console.log(item.descriptions);
            // console.log(item.descriptions.find((d) => d.lang === c.lang && r.test(d.term)));
            // console.log(item.descriptions.find((d) => d.lang === c.lang && r.test(d.term)) !== undefined);
            const descFound = item.descriptions.find((d) => d.lang === c.lang && r.test(d.term)) !== undefined;

            return descFound === c.present;
          });
        }),
      );
  }
}
