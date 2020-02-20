import config from '../config';
import { request } from 'http';

export class HttpRequest {
  private url: any;
  private path: string;
  private id: string;

  constructor(path: string, id: string) {
    this.url = config.masterProductionURL;
    this.path = path;
    this.id = id;
  }

  private Join(): string {
    return '/api/' + this.path + '/' + this.id;
  }

  public get() {
    try {
      const req = request(
        {
          host: this.url,
          path: this.Join(),
          method: 'GET',
        },
        response => {
          console.log(response.statusCode); // 200
          if (response.statusCode === 200) {
            return true;
          } else {
            return false;
          }
        },
      );
      req.end();
    } catch (e) {
      throw e;
    }
  }
}
