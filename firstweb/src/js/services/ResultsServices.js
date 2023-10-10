
define(['utils/Service'], function (ServiceUtils) {
  
  function ResultsServices() {}
    
  ResultsServices.prototype.fetchResults = async function () {
    console.log("hello");
    return await ServiceUtils.getData('result');
  }
  
  ResultsServices.prototype.addResult = async function (result_data) {
    return await ServiceUtils.postData('result', result_data);
  }

  ResultsServices.prototype.updateResult = async function (result_data) {
    console.log(result_data)
    return await ServiceUtils.putData('result', result_data);
  }

  return new ResultsServices();
});