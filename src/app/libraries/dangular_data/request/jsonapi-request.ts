import {addConditions, addFilters, addInclude} from '@dangular-data/request/request-util';
import {IQueryParams, IRequest, IRequestConfig, IRequestOptions, IRequestPointConfig, TRequestSource, TRequestType} from '@dangular-data/request/types';


export enum EConditionOperator {
  EQUAL = '=',
  NOT_EQUAL = '<>',
  MORE = '>',
  MORE_OR_EQUAL = '>=',
  LESS = '<',
  LESS_OR_EQUAL = '<=',
  STARTS_WITH = 'STARTS_WITH',
  CONTAINS = 'CONTAINS',
  ENDS_WITH = 'ENDS_WITH',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT BETWEEN',
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL'
}

export class JsonApiRequest implements IRequest {

  configUrl: string;
  config: IRequestPointConfig;
  headers: Record<string, string>;

  constructor(public type: TRequestType, config: IRequestConfig, private query?: IQueryParams) {
    this.config = this.getConfig(config);
    this.configUrl = this.getConfigUrl(config);
    this.headers = this.defaultHeaders();
  }

  get url(): string {

    let url: string = this.configUrl;
    switch (this.type) {
      case 'one':
      case 'update':
        if (this.query.id) {
          url = url + '/' + this.query.id;
        }
        break;
    }
    // console.log('[url]', url);
    return '/' + url;
  }

  get options(): IRequestOptions {
    const params: Record<string, string> = {};
    const {headers} = this;

    addInclude(params, this.config, this.query);
    addFilters(params, this.config, this.query);
    addConditions(params, this.config, this.query);

    return {params, headers};
  }

  _body: any;

  get body() {
    return this.query ? this.query.body : null;
  }

  set body(body: any) {
    this._body = body;
  }

  addHeader(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  defaultHeaders() {
    let headers: Record<string, string>;

    switch (this.type) {
      case 'add':
      case 'update':
        headers = headers || {};
        headers['Content-Type'] = 'application/vnd.api+json';
        break;
    }
    return headers;
  }

  getConfig(config: IRequestConfig): IRequestPointConfig {
    const source: TRequestSource = this.query && this.query.source ? this.query.source : 'default';
    return config.sources[source].types[this.type];
  }

  getConfigUrl(config: IRequestConfig): string {
    const source: TRequestSource = this.query && this.query.source ? this.query.source : 'default';
    return config.sources[source].url;
  }


}
