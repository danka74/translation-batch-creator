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
    type: string;
    accept: string;
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

export const langRefsetMap: Record<string, string> = {
  en: '900000000000509007',
  sv: '46011000052107',
};

export const createRegExp = (s: string): RegExp => {
  if (s.startsWith('/')) {
    const pattern = s.slice(1).slice(0, s.lastIndexOf('/'));
    const flags = s.slice(s.lastIndexOf('/') + 1);
    return new RegExp(pattern, flags);
  }
  return new RegExp(s);
};

@Injectable({
  providedIn: 'root'
})
export class SnomedService {

  readonly host = '/snowstorm/';
  private _branch = 'MAIN/SNOMEDCT-SE';
  private _limit = '500';

  private allowedLimits = [ '10', '500', '1000', '2000', '5000' ];

  private _resultMetadata: ResultMetadata = new ResultMetadata();



  constructor(private http: HttpClient) { }

  endOfResults() {
    return this._resultMetadata.searchAfter === '';
  }

  get resultMetadata() {
    return this._resultMetadata;
  }

  getBranches() {
    return this.http.get(this.host + 'branches');
  }

  get branch() {
    return this._branch;
  };

  set branch(b: string) {
    this._branch = b;
  }

  getAllowedLimits() {
    return this.allowedLimits;
  }

  get limit() {
    return this._limit;
  }

  set limit(l: string) {
    this._limit = l;
  }

  findDescriptions(param: Param, doSearchAfter: boolean = false): Observable<DescriptionItem> {

    if (doSearchAfter && !this.resultMetadata.searchAfter.length) {
      throw(new Error('No previous search executed'));
    }

    if (!doSearchAfter) {
      this._resultMetadata = new ResultMetadata();
    }

    // console.log(param);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv',
      })
    };

    // search for active concepts, active descriptions
    return this.http.get(this.host + this.branch + '/concepts?activeFilter=true&termActive=true&limit=' + this.limit +
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
            this.host + this.branch + '/descriptions?active=true&conceptId=' + concept.conceptId,
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
            const r = createRegExp(c.regexp);
            // console.log(c);
            const descFound: boolean = item.descriptions.find((d) => {
              // console.log(d.term);
              const langEq = d.lang === c.lang;
              const typeEq = ((c.type && c.type.length) ? c.type === d.type : true);
              const acceptEq = ((c.accept && c.accept.length) ? c.accept === d.acceptabilityMap[langRefsetMap[d.lang]] : true);
              const termTest = r.test(d.term);
              return d.lang === c.lang &&
                ((c.type && c.type.length) ? c.type === d.type : true) &&
                ((c.accept && c.accept.length) ? c.accept === d.acceptabilityMap[langRefsetMap[d.lang]] : true) &&
                r.test(d.term);
            }) !== undefined;
            return descFound ? c.present : !c.present;
          });
        }),
      );
  }
}
