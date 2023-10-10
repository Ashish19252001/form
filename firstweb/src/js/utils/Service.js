
define(['text!../../json/config.json'], function (configFile) {
  const config = JSON.parse(configFile);
  class ServiceUtils {
    constructor() {}

    buildEndpointUrl(endpointProperty) {
      const url = `${config.isSecure ? 'https' : 'http'}://${config.host}:${config.port}/${
        config.endpoints[endpointProperty]
      }`;
      // console.log(url, config.endpoints[endpointProperty]);
      return url;
    }

    async getData(endpointProperty) {
      const api_url = this.buildEndpointUrl(endpointProperty);
      console.log(api_url)
      let dataFromService;
      try {
        const response = await fetch(api_url);
        console.log(response)
        if (!response.ok) throw Error('Something went wrong');
        dataFromService = await response.json();
      } catch (error) {
        console.log(dataFromService)
        throw Error('Something went wrong');
      }
      return dataFromService;
    }

    async postData(endpointProperty, bodyData) {
      // let dataFromService;
      const api_url = this.buildEndpointUrl(endpointProperty);
      
      try {
        const response = await fetch(
          api_url, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(bodyData),
          }
        );
        if (!response.ok) throw Error('Something went wrrong');
        // dataFromService = await response.json();
        // console.log(dataFromService);
      } 
      catch (error) {
        throw Error('Something went wrrong', error);
      }
      // return dataFromService;
    }

    async putData(endpointProperty, bodyData) {
      console.log(bodyData)
      const api_url = this.buildEndpointUrl(endpointProperty) + `/${bodyData.ID}`;
      console.log(api_url)
      try {
        const response = await fetch(
          api_url, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(bodyData),
          }
        );
        console.log(bodyData    +"g")
        if (!response.ok) throw Error('Something went wrong');
        //console.log(response)
        return response;
      } 
      catch (error) {
        throw Error('Something went wrong', error);
      }
      // return dataFromService;
    }

    async deleteData(endpointProperty, bodyData) {
      const api_url = this.buildEndpointUrl(endpointProperty) + `/${bodyData.ID}`;
      try {
        const response = await fetch(
          api_url, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'DELETE',
            body: JSON.stringify(bodyData),
          }
        );
        if (!response.ok) throw Error('Something went wrong');
        return response;
      } 
      catch (error) {
        throw Error('Something went wrong', error);
      }
      // return dataFromService;
    }

  }

  return new ServiceUtils();
});
