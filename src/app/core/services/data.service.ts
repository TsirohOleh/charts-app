import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GenericHttpService } from './generic-http.service';

@Injectable()
export class DataService {
  private mockedChartDataUrl = 'assets/mocked/mocked-data.json';

  constructor(
      private httpService: GenericHttpService
  ) {}

  public getChartData(): Observable<any> {
    return this.httpService.get(this.mockedChartDataUrl);
  }
}
