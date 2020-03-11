import {JsonApiRequest} from '@dangular-data/request/jsonapi-request';
import {configRequest} from '@dangular-data/request/_testing/data';


describe('Request', () => {


  it('should create', () => {
    const request = new JsonApiRequest('one', configRequest);
    expect(request).toBeTruthy();
  });

});
