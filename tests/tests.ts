import { StatusCodes } from 'http-status-codes';
import { url } from '../ApiURL';
import  request  from 'supertest';
const jsonBody = {
    "activity": expect.any(String),
    "type": expect.stringMatching(/education|recreational|social|diy|charity|cooking|relaxation|music|busywork/),
    "participants": expect.any(Number),
    "price": expect.any(Number),
    "link": expect.any(String),
    "key": expect.any(String), //"key": expect.any(Number), - should be the right expectation according to the documentation
    "accessibility": expect.any(Number)
    }

const errorNotFoundBody = {error:'No activity found with the specified parameters'}

const errorInArgumentsBody = {error:'Failed to query due to error in arguments'}

describe('Testing the GET api/activity - gets a random activity', () => {
    it('gets a random event', async () => {
        const response = await request(url)
        .get('')
        .set('Accept', 'application/json');       
        
        expect(response.statusCode).toBe(StatusCodes.OK);
        
        expect(response.body).toStrictEqual(jsonBody);
        expect(response.body['price']).toBeGreaterThanOrEqual(0);
        expect(response.body['price']).toBeLessThanOrEqual(1);
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0);
        expect(response.body['accessibility']).toBeLessThanOrEqual(1);
        expect(response.body['participants']).toBeGreaterThanOrEqual(0);
        //expect(response.body['key']).toBeGreaterThanOrEqual(1000000); - this should be checking for the borders of the numeric 'key' but the actual one returned as string
        //expect(response.body['key']).toBeLessThanOrEqual(9999999);
    
    });

    it('gets a random event with the Header settings accepting all response content types', async () => {
        const response = await request(url)
        .get('')
        .set('Accept', '*/*')
        .expect(StatusCodes.OK);

        expect(response.body).toStrictEqual(jsonBody);
        expect(response.body['price']).toBeGreaterThanOrEqual(0);
        expect(response.body['price']).toBeLessThanOrEqual(1);
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0);
        expect(response.body['accessibility']).toBeLessThanOrEqual(1);
        expect(response.body['participants']).toBeGreaterThanOrEqual(0);
        //expect(response.body['key']).toBeGreaterThanOrEqual(1000000); - this should be checking for the borders of the numeric 'key' but the actual one returned as string
        //expect(response.body['key']).toBeLessThanOrEqual(9999999);
    });

    it('gets a random event with the Header settings accepting xml response', async () => {
        const response = await request(url)
        .get('')
        .set('Accept', 'application/xml')
        .expect(StatusCodes.OK);

        expect(response.body).toStrictEqual(jsonBody);
        expect(response.body['price']).toBeGreaterThanOrEqual(0);
        expect(response.body['price']).toBeLessThanOrEqual(1);
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0);
        expect(response.body['accessibility']).toBeLessThanOrEqual(1);
        expect(response.body['participants']).toBeGreaterThanOrEqual(0);
        //expect(response.body['key']).toBeGreaterThanOrEqual(1000000); - this should be checking for the borders of the numeric 'key' but the actual one returned as string
        //expect(response.body['key']).toBeLessThanOrEqual(9999999);
    });

    it('responds with error on getting a random event with incorrect endpoint', async () => {
        const response = await request(url)
        .get('/')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK); // The Status Code should be 'not found' but actual is ok - 200

        expect(response.body).toMatchObject({error: 'Endpoint not found'});
    });

    it('gets a random event then gets another random event and they are different. In case it fails due to responses equity, please run the test again', async () => {
        const responseFirst = await request(url)
        .get('')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseFirst.body['price']).toBeGreaterThanOrEqual(0);
        expect(responseFirst.body['price']).toBeLessThanOrEqual(1);
        expect(responseFirst.body['accessibility']).toBeGreaterThanOrEqual(0);
        expect(responseFirst.body['accessibility']).toBeLessThanOrEqual(1);
        expect(responseFirst.body['participants']).toBeGreaterThanOrEqual(0);
        //expect(responseFirst.body['key']).toBeGreaterThanOrEqual(1000000); - this should be checking for the borders of the numeric 'key' but the actual one returned as string
        //expect(responseFirst.body['key']).toBeLessThanOrEqual(9999999);
        expect(responseSecond.body).toStrictEqual(jsonBody);
        expect(responseSecond.body['price']).toBeGreaterThanOrEqual(0);
        expect(responseSecond.body['price']).toBeLessThanOrEqual(1);
        expect(responseSecond.body['accessibility']).toBeGreaterThanOrEqual(0);
        expect(responseSecond.body['accessibility']).toBeLessThanOrEqual(1);
        expect(responseSecond.body['participants']).toBeGreaterThanOrEqual(0);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']);
    });
});

describe('Testing GET api/activity?key = :key - getting an activity by the unique key', () => {
    it('gets an activity by unique key', async () => {        
        const response = await request(url)
        .get('?key=5881028')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK);
        const responseJson = {
            "activity" : "Learn a new programming language",
            "type": "education",
            "participants": 1,
            "price": 0.1,
            "link": "",
            "key": "5881028",
            "accessibility": 0.25

        }
        
        expect(response.body).toStrictEqual(responseJson);    
    });

    it('gets an activity by unique key then gets another activity and they are different. In case it fails due to responses equity, please run the test again', async () => {      
        const responseFirst = await request(url)
        .get('?key=7023703')
        .set('Accept', 'application/json');    
        const responseSecond = await request(url)
        .get('?key=4558850')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseSecond.body).toStrictEqual(jsonBody);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']);               
    });

    it('gets an activity by unique key then gets activity by the same key and they are same', async () => {        
        const responseFirst = await request(url)
        .get('?key=1645485')
        .set('Accept', 'application/json');        
        const responseSecond = await request(url)
        .get('?key=1645485')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);              
        expect(responseFirst.body).toStrictEqual(responseSecond.body);                     
    });

    it('returns an error on getting an activity by key missing 1 digit', async () => {
        const response = await request(url)
        .get('?key=588102')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should be 'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });

    it('returns an error on getting an activity by key with extra 1 digit', async () => {
        const response = await request(url)
        .get('?key=16454855')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should 'be not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})          
    });

    it('returns an error on getting an activity by not existing key', async () => {
        const response = await request(url)
        .get('?key=1234567')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should be 'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });

    it('returns an error on getting an activity by key containing text', async () => {
        const response = await request(url)
        .get('?key=relaxation')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should be 'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });             
  
    // accroding to the documentation the key field is a numeric but actually it is a string. With a string type these test cases below are obsolete.
    // With numeric key they should be implemented
    it('gets an activity by min key value', async () => { 
        const response = await request(url)
        .get('?key=1000000')
        .set('Accept', 'application/json');
        const responseJson = {
            "activity" : "Make a new friend",
            "type": "social",
            "participants": 1,
            "price": 0,
            "link": "",
            "key": "1000000",
            "accessibility": 0
        }
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(responseJson);          
    });

    it('gets an activity by max key value', async () => { 
        const response = await request(url)
        .get('?key=9999999')
        .set('Accept', 'application/json');
        const responseJson = {
            "activity" : "Resolve a problem you've been putting off",
            "type": "busywork",
            "participants": 1,
            "price": 0,
            "link": "",
            "key": "9999999",
            "accessibility": 0
        }
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(responseJson);         
    });

    it('returns an error on getting an activity by key out of range - greater', async () => {
        const response = await request(url)
        .get('?key=10000000')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})         
    });

    it('returns an error on getting an activity by key out of range - less', async () => {
        const response = await request(url)
        .get('?key=999999')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });
});

describe('testing GET api/activity?type = :type - gets a random activity by type', () => {
    it('gets a random activity by type', async () => { 
        const response = await request(url)
        .get('?type=recreational')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['type']).toEqual('recreational');    
    });

    it('gets an activity by type then gets activity by the same type and they are different. In case it fails due to responses equity, please run the test again', async () => {      
        const responseFirst = await request(url)
        .get('?type=relaxation')
        .set('Accept', 'application/json');     
        const responseSecond = await request(url)
        .get('?type=relaxation')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseSecond.body).toStrictEqual(jsonBody);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']);
        expect(responseFirst.body['type']).toEqual(responseSecond.body['type']);                 
    });

    it('returns an error on getting an activity by invalid type value - number', async () => {
        const response = await request(url)
        .get('?type=1000000')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });

    it('returns an error on getting an activity by invalid type value - text', async () => {
        const response = await request(url)
        .get('?type=someText')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})            
    });
});

describe('Testing GET api/activity?participants=:participants - gets a random activity by participants number', () => {
    it('gets a random activity by min participants value', async () => { 
        const response = await request(url)
        .get('?participants=1')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['participants']).toEqual(1);        
    });

    it('gets a random activity by max participants value', async () => { 
    const response = await request(url)
        .get('?participants=5')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['participants']).toEqual(5);        
    });

    it('gets a random activity by participants number then gets another activity by same participants number and they are different. In case it fails due to responses equity, please run the test again', async () => { 
        const responseFirst = await request(url)
        .get('?participants=3')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('?participants=3')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseSecond.body).toStrictEqual(jsonBody);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']); 
        expect(responseFirst.body['participants']).toEqual(responseSecond.body['participants']);  
    });

    it('returns an error on getting an activity by invalid participants value - text', async () => {
        const response = await request(url)
        .get('?participants=relaxation')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'Failed to query due to error in arguments'})               
    });

    it('returns an error on getting an activity by participants value out of range - greater', async () => {
        const response = await request(url)
        .get('?participants=6')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})           
    });

    it('returns an error on getting an activity by participants value out of range - less', async () => {
        const response = await request(url)
        .get('?participants=0')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})        
    });

    it('returns an error on getting an activity by invalid participants value - number with floating point', async () => {
        const response = await request(url)
        .get('?participants=2.5')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})            
    });
});

describe('Testing GET api/activity?price=:price - gets a random activity by price value', () => {
    it('gets a random activity by min price value', async () => { 
        const response = await request(url)
        .get('?price=0')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toEqual(0);        
    });

    it('gets a random activity by max price value', async () => { 
        const response = await request(url)
        .get('?price=0.8')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toEqual(0.8);        
    });

    it('gets a random activity by price then gets another activity by same price and they are different. In case it fails due to responses equity, please run the test again', async () => { 
        const responseFirst = await request(url)
        .get('?price=0.1')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('?price=0.1')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseSecond.body).toStrictEqual(jsonBody);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']);
        expect(responseFirst.body['price']).toEqual(responseSecond.body['price']);   
    });

    it('returns an error on getting an activity by invalid price value - text', async () => {
        const response = await request(url)
        .get('?price=relaxation')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'Failed to query due to error in arguments'})         
    });

    it('returns an error on getting an activity by price value out of range - greater', async () => {
        const response = await request(url)
        .get('?price=2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})          
    });

    it('returns an error on getting an activity by price value out of range - negative number', async () => {
        const response = await request(url)
        .get('?price=-0.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // expected should be'not found' - 404
        expect(response.body).toMatchObject({error: 'No activity found with the specified parameters'})        
    });
});

describe('Testing GET api/activity?minprice=:minprice&maxprice=:maxprice', () => {
    it('gets a random activity by a price range', async () => { 
        const response = await request(url)
        .get('?minprice=0.1&maxprice=0.5')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toBeLessThanOrEqual(0.5); 
        expect(response.body['price']).toBeGreaterThanOrEqual(0.1);      
    });

    it('gets a random activity by a price range then gets another activity by the same range and responses are different. In case it fails due to responses equity, please run the test again', async () => { 
        const responseFirst = await request(url)
        .get('?minprice=0.2&maxprice=0.8')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('?minprice=0.2&maxprice=0.8')
        .set('Accept', 'application/json');   
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK); 
        expect(responseFirst.body).toMatchObject(jsonBody);
        expect(responseFirst.body['price']).toBeLessThanOrEqual(0.8); 
        expect(responseFirst.body['price']).toBeGreaterThanOrEqual(0.2);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key'])

        expect(responseSecond.statusCode).toBe(StatusCodes.OK); 
        expect(responseSecond.body).toMatchObject(jsonBody);
        expect(responseSecond.body['price']).toBeLessThanOrEqual(0.8); 
        expect(responseSecond.body['price']).toBeGreaterThanOrEqual(0.2);      
    });

    it('gets a random activity by a price range put in opposite order', async () => { 
        const response = await request(url)
        .get('?maxprice=0.3&minprice=0.1')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toBeLessThanOrEqual(0.3); 
        expect(response.body['price']).toBeGreaterThanOrEqual(0.1);      
    });

    it('gets a random activity by a price range where minprice = maxprice', async () => { 
        const response = await request(url)
        .get('?minprice=0.3&maxprice=0.3')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toEqual(0.3);            
    });

    it('gets a random activity by a price range containing only maxprice', async () => { 
        const response = await request(url)
        .get('?maxprice=0.1')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toBeLessThanOrEqual(0.1);              
    });

    it('gets a random activity by a price range containing only minprice', async () => { 
        const response = await request(url)
        .get('?minprice=0.7')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['price']).toBeGreaterThanOrEqual(0.7);    
    });

    it('returns an error on getting an activity by a price range containing no result', async () => { 
        const response = await request(url)
        .get('?minprice=0.14&maxprice=0.145')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(errorNotFoundBody);                    
    });

    it('returns an error on getting an activity by a price range out of limits', async () => { 
        const response = await request(url)
        .get('?minprice=1.1&maxprice=1.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // the Status code should be Not Allowed
        expect(response.body).toMatchObject(errorNotFoundBody);                     
    });

    it('returns an error on getting an activity by a price range where minprice greater than maxprice', async () => { 
        const response = await request(url)
        .get('?minprice=1.4&maxprice=1.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //the Status code should be Not Allowed
        expect(response.body).toMatchObject(errorNotFoundBody);                     
    });

    it('returns an error on getting an activity by a price range has invalid values', async () => { 
        const response = await request(url)
        .get('?minprice=1.4&maxprice=sometext')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //the code should be Not Allowed
        expect(response.body).toMatchObject(errorInArgumentsBody);                      
    });
});

describe('Testing GET api/activity?accesibility=:accessibility - gets a random activity by accessibility value', () => {
    it('gets a random activity by min accessibility value', async () => { 
        const response = await request(url)
        .get('?accessibility=0')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toEqual(0);        
    });

    it('gets a random activity by max accessibility value', async () => { 
        const response = await request(url)
        .get('?accessibility=1')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toEqual(1);        
    });

    it('gets a random activity by accessibility then gets another activity by same accessibility and they are different. In case it fails due to responses equity, please run the test again', async () => { 
        const responseFirst = await request(url)
        .get('?accessibility=0.1')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('?accessibility=0.1')
        .set('Accept', 'application/json');
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK);
        expect(responseSecond.statusCode).toBe(StatusCodes.OK);

        expect(responseFirst.body).toStrictEqual(jsonBody);
        expect(responseSecond.body).toStrictEqual(jsonBody);

        expect(responseFirst.body).not.toEqual(responseSecond.body);
        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key']);
        expect(responseFirst.body['accessibility']).toEqual(responseSecond.body['accessibility']);   
    });

    it('returns an error on getting an activity by invalid accessibility value - text', async () => {
        const response = await request(url)
        .get('?accessibility=relaxation')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject(errorInArgumentsBody);            
    });

    it('returns an error on getting an activity by accessibility value out of range - greater', async () => {
        const response = await request(url)
        .get('?accessibility=1.1')
        .set('Accept', 'application/json');
                
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject(errorNotFoundBody);            
    });

    it('returns an error on getting an activity by accessibility value out of range - negative number', async () => {
        const response = await request(url)
        .get('?accessibility=-0.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //  expected should be'not found' - 404
        expect(response.body).toMatchObject(errorNotFoundBody);            
    });
});

describe('Testing GET api/activity?minaccessibility=:minaccessibility&maxaccessibility=:maxaccesibility - gets a random activity by an accessibility range', () => {
    it('gets a random activity by an accessibility range', async () => { 
        const response = await request(url)
        .get('?minaccessibility=0.1&maxaccessibility=0.4')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toBeLessThanOrEqual(0.4); 
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0.1);      
    });

    it('gets a random activity by an accessibility range then gets another activity by the same range and responses are different. In case it fails due to responses equity, please run the test again', async () => { 
        const responseFirst = await request(url)
        .get('?minaccessibility=0.2&maxaccessibility=0.8')
        .set('Accept', 'application/json');
        const responseSecond = await request(url)
        .get('?minaccessibility=0.2&maxaccessibility=0.8')
        .set('Accept', 'application/json');   
        
        expect(responseFirst.statusCode).toBe(StatusCodes.OK); 
        expect(responseFirst.body).toMatchObject(jsonBody);
        expect(responseFirst.body['accessibility']).toBeLessThanOrEqual(0.8); 
        expect(responseFirst.body['accessibility']).toBeGreaterThanOrEqual(0.2);

        expect(responseFirst.body['key']).not.toEqual(responseSecond.body['key'])

        expect(responseSecond.statusCode).toBe(StatusCodes.OK); 
        expect(responseSecond.body).toMatchObject(jsonBody);
        expect(responseSecond.body['accessibility']).toBeLessThanOrEqual(0.8); 
        expect(responseSecond.body['accessibility']).toBeGreaterThanOrEqual(0.2);      
    });

    it('gets a random activity by an accessibility range put in opposite order', async () => { 
        const response = await request(url)
        .get('?maxaccessibility=0.7&minaccessibility=0.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toBeLessThanOrEqual(0.7); 
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0.2);      
    });

    it('gets a random activity by an accessibility range where minaccessibility = maxaccessibility', async () => { 
        const response = await request(url)
        .get('?minaccessibility=0.3&maxaccessibility=0.3')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toEqual(0.3);              
    });

    it('gets a random activity by an accessibility range containing only maxaccessibility', async () => { 
        const response = await request(url)
        .get('?maxaccessibility=0.8')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toBeLessThanOrEqual(0.8);              
    });

    it('gets a random activity by an accessibility range containing only minaccessibility', async () => { 
        const response = await request(url)
        .get('?minaccessibility=0.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(jsonBody);
        expect(response.body['accessibility']).toBeGreaterThanOrEqual(0.2);      
    });

    it('returns an error on getting an activity by an accessibility range containing no result', async () => { 
        const response = await request(url)
        .get('?minaccessibility=0.14&maxaccessibility=0.145')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); 
        expect(response.body).toMatchObject(errorNotFoundBody);                     
    });

    it('returns an error on getting an activity by an accessibility range out of limits', async () => { 
        const response = await request(url)
        .get('?minaccessibility=1.1&maxaccessibility=1.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); // the Status code should be Not Allowed
        expect(response.body).toMatchObject(errorNotFoundBody);                    
    });

    it('returns an error on getting an activity by an accessibility range where minaccessibility greater than maxaccessibility', async () => { 
        const response = await request(url)
        .get('?minaccessibility=1.4&maxaccessibility=1.2')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //the Status code should be Not Allowed
        expect(response.body).toMatchObject(errorNotFoundBody);                      
    });

    it('returns an error on getting an activity by an accessibility range has invalid values', async () => { 
        const response = await request(url)
        .get('?minaccessibility=1.4&maxaccessibility=sometext')
        .set('Accept', 'application/json');        
        
        expect(response.statusCode).toBe(StatusCodes.OK); //the code should be Not Allowed
        expect(response.body).toMatchObject(errorInArgumentsBody);                      
    });
})


