import { GenericHttpService } from './generic-http.service';
import { DataService } from './data.service';

export { DataService } from './data.service';
export { Chart } from './Chart';

export const APP_SERVICES: any[] = [
  GenericHttpService,
  DataService
];
