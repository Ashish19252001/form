define(['../accUtils', "require", "exports", "knockout", 
  "ojs/ojbootstrap", "ojs/ojarraydataprovider", 
  "ojs/ojlistdataproviderview",
  "ojs/ojrestdataprovider", "ojs/ojmodel", "ojs/ojcollectiondataprovider",
  "ojs/ojtable", "ojs/ojknockout"],
  function(accUtils, require, exports, ko,
    ojbootstrap_1, ArrayDataProvider, 
    ListDataProviderView,
    RESTDataProvider, ojmodel_1, CollectionDataProvider
    ) {
      
      
    function CustomerViewModel() {
      this.serviceURL = 'http://localhost:5000/payment-config-params';
      this.DeptCol = ko.observable();
      this.datasource = ko.observable();
      this.parseSaveDept = (response) => {
          return {
              ID: response['ID'],
              PAYMENT_SITE_NAME: response['PAYMENT_SITE_NAME'],
              PAYMENT_TYPE: response['PAYMENT_TYPE'],
              PAYMENT_CHANNEL: response['PAYMENT_CHANNEL']
          };
      };
      this.parseDept = (response) => {
          return {
              ID: response['ID'],
              PAYMENT_SITE_NAME: response['PAYMENT_SITE_NAME'],
              PAYMENT_TYPE: response['PAYMENT_TYPE'],
              PAYMENT_CHANNEL: response['PAYMENT_CHANNEL']
          };
      };
      this.Department = ojmodel_1.Model.extend({
          urlRoot: this.serviceURL,
          parse: this.parseDept,
          parseSave: this.parseSaveDept,
          idAttribute: 'ID'
      });
      this.myDept = new this.Department();
      this.DeptCollection = ojmodel_1.Collection.extend({
          url: this.serviceURL,
          model: this.myDept,
          comparator: 'ID'
      });
      this.DeptCol(new this.DeptCollection());
      this.datasource(new CollectionDataProvider(this.DeptCol()));
    }
    return CustomerViewModel;
  }
);
