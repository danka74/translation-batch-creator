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

export class ResultMetadata {
  items: number = 0;
  total: number = 0;
  limit: number = 0;
  part: number = 0;
  searchAfter: string = '';
}

@Injectable({
  providedIn: 'root'
})
export class SnomedService {

  readonly host = '/';
  readonly branch = 'MAIN/SNOMEDCT-SE';

  resultMetadata: ResultMetadata = new ResultMetadata();

  constructor(private http: HttpClient) { }

  endOfResults() {
    return this.resultMetadata.searchAfter === '';
  }

  getResultMetadata() {
    return this.resultMetadata;
  }

  findDescriptions(param: Param, doSearchAfter: boolean = false): Observable<DescriptionItem> {

    if (doSearchAfter && !this.resultMetadata.searchAfter.length) {
      throw(new Error('No previous search executed'));
    }

    if (!doSearchAfter) {
      this.resultMetadata = new ResultMetadata();
    }

    // console.log(param);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv',
      })
    };

    return this.http.get(this.host + this.branch + '/concepts?activeFilter=true&limit=500' +
      '&term=' + encodeURI(param.term) +
      '&ecl=' + encodeURI(param.ecl) +
      (doSearchAfter ? '&searchAfter=' + this.resultMetadata.searchAfter : ''),
      httpOptions).pipe(
        tap((data: any) => {
          console.log(data);
          this.resultMetadata.items = data.items.length;
          this.resultMetadata.total = data.total;
          this.resultMetadata.limit = data.limit;
          if (data.items.length < data.limit) {
            this.resultMetadata.searchAfter = '';
          } else {
            this.resultMetadata.searchAfter = data.searchAfter;
          }
          this.resultMetadata.part++;
        }),
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
            const descFound: boolean = item.descriptions.find((d) => d.lang === c.lang && r.test(d.term)) !== undefined;
            return descFound ? c.present : !c.present;
          });
        }),
      );
  }
}
