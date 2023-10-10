define(['../accUtils', "require", "exports", "knockout", 
  "ojs/ojbootstrap", "ojs/ojarraydataprovider", 
  // "text!data/deptData.json", 
  "ojs/ojlistdataproviderview", "ojs/ojkeyset",
  "ojs/ojrestdataprovider", "ojs/ojmodel", "ojs/ojcollectiondataprovider",
  "ojs/ojtable", "ojs/ojknockout", "ojs/ojcheckboxset"],
    function(accUtils, require, exports, ko,
      ojbootstrap_1, ArrayDataProvider, 
      // deptData,
      ListDataProviderView, ojkeyset_1,
      RESTDataProvider, ojmodel_1, CollectionDataProvider,)
        {
        function TableViewModel() {
            var self = this;
            self.somethingChecked = ko.observable(false);
            // self.currentDeptName = ko.observable('default');
            // self.newDeptId = ko.observable(555);
            // self.newDeptName = ko.observable('');
            // self.workingId = ko.observable('');
            self.findDeptIds = () => {
                let selectedIdsArray = [];
                const divs = document.getElementsByTagName('oj-checkboxset');
                for (let i = 0; i < divs.length; i++) {
                    const cbComp = divs[i];
                    if (cbComp.value && cbComp.value.length) {
                        selectedIdsArray.push(cbComp.value[0]);
                    }
                }
                return selectedIdsArray;
            };
            self.enableDelete = (event) => {
                self.somethingChecked(event && event.detail && event.detail.value && event.detail.value.length);
            };
            self.deleteDepartment = (event, data) => {
                let deptIds = [];
                deptIds = self.findDeptIds();
                const collection = data.DeptCol();
                deptIds.forEach((value) => {
                    const model = collection.get(value);
                    if (model) {
                        collection.remove(model);
                        model.destroy();
                    }
                });
                self.enableDelete();
                document.getElementById('table').refresh();
            };

            self.serviceURL = 'http://localhost:5000/manik-test';
            self.DeptCol = ko.observable();
            self.datasource = ko.observable();
            self.parseSaveDept = (response) => {
                return {
                    ID: response['ID'],
                    NAME: response['NAME'],
                    CLASS: response['CLASS'],
                    MARKS_SUB1: response['MARKS_SUB1'],
                    MARKS_SUB2: response['MARKS_SUB2'],
                    MARKS_SUB3: response['MARKS_SUB3']
                };
            };
            self.parseDept = (response) => {
                return {
                    ID: response['ID'],
                    NAME: response['NAME'],
                    CLASS: response['CLASS'],
                    MARKS_SUB1: response['MARKS_SUB1'],
                    MARKS_SUB2: response['MARKS_SUB2'],
                    MARKS_SUB3: response['MARKS_SUB3']
                };
            };
            self.Department = ojmodel_1.Model.extend({
                urlRoot: self.serviceURL,
                parse: self.parseDept,
                parseSave: self.parseSaveDept,
                idAttribute: 'ID'
            });
            self.myDept = new self.Department();
            self.DeptCollection = ojmodel_1.Collection.extend({
                url: self.serviceURL,
                model: self.myDept,
                comparator: 'ID'
            });
            self.DeptCol(new self.DeptCollection());
            self.datasource(new CollectionDataProvider(self.DeptCol()));
        }
        return TableViewModel;
    }
);
