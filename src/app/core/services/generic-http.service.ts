import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GenericHttpService {
  constructor(private http: Http) {}

  public get(url: string, options?: any): Observable<any> {
    return this.http.get(url, options)
                    .map((res: Response) => res.json())
                    .catch((error: any) => {
                      return Observable.throw(error.json().error ||
                          'Server error');
                    });
    }
}
