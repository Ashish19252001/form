define([
    "knockout", 
    "ojs/ojarraydataprovider", 
    // "ojs/ojbufferingdataprovider", 
    "services/ResultsServices",
    "ojs/ojasyncvalidator-regexp",
    // "ojs/ojkeyset", 
    // "ojs/ojconverter-number", 
    // "text!data/departmentData.json", 
    // "ojs/ojknockout", 
    "ojs/ojasyncvalidator-length",
    "ojs/ojinputtext", 
     

    "ojs/ojinputnumber", 
    "ojs/ojlabel", 
    "ojs/ojbutton",
    "ojs/ojvalidationgroup", 
     
    "ojs/ojformlayout",
    'ojs/ojcollapsible', 
    "ojs/ojtoolbar", 
    "ojs/ojmessages", 
    "ojs/ojtable",
    ], 
    function (
        ko, 
        ArrayDataProvider, 
        // BufferingDataProvider, 
        ResultsServices,
        AsyncRegExpValidator,
        AsyncLengthValidator,
        // utils,
        // ojkeyset_1, 
        // NumberConverter, 
        // deptData
    ) 
        {
        function IncidentViewModel() {
            this.__initObservables();
            this.__initComputed();
            this.__initVariables();
            this.__fetchResults();
            this.addRow = this.__addRow.bind(this);
            this.updateRow = this.__updateRow.bind(this);
            this._initValidators();
            this.validatorss = ko.observableArray([
                new AsyncLengthValidator({
                    min: 5,
                    max: 20,})]);
                    this.validators = ko.observableArray([
                        new AsyncLengthValidator({ min: 5, max: 20, countBy: 'codePoint' })
                    ]);
        };



        IncidentViewModel.prototype._initValidators=function(){
           
            this.emailPatternValue = ko.observable('');
            this.emailPatternValidator = ko.observableArray([
              new AsyncRegExpValidator({
                  pattern: "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
                  hint: 'enter a valid email format',
                  messageDetail: 'Not a valid email format'
              })
          ]);}
        IncidentViewModel.prototype.__initObservables = function () {
            this.isLoading = ko.observable(true);
            this.resultsData = ko.observableArray([]);
            
            this.isEmptyTable = ko.observable(false);
            this.messageArray = ko.observableArray();
            this.groupValid = ko.observable();
            this.selectedRow = ko.observable();
            this.disableSubmit = ko.observable(true);
            // intialize the observable values in the forms
            this.inputStudentId = ko.observable();
            this.inputStudentName = ko.observable();
            this.inputClass = ko.observable();
            this.inputMarksSub1 = ko.observable(); 
            this.emailPatternValue=ko.observable();
        };
        
        IncidentViewModel.prototype.__initComputed = function () {
            this.disableCreate = ko.computed(() => {
                return !this.inputStudentId() || this.groupValid() === 'invalidShown';
            });
            // Return true if the Remove and Update buttons should be disabled
            this.disableRemoveUpdate = ko.computed(() => {
                const selectedRow = this.selectedRow();
                return !selectedRow || !selectedRow.key || this.groupValid() === 'invalidShown';
            });
        };

        IncidentViewModel.prototype.__initVariables = function () {
            this.resultsDataProvider = new ArrayDataProvider(this.resultsData, {
                keyAttributes: 'ID'
            });
        };
        
        IncidentViewModel.prototype.__addRow = async function () {
            console.log("called")
            if (this.groupValid() !== 'invalidShown') {
                if (ko.utils.arrayFirst(this.resultsData(), function(item) {
                    return item.ID == this.inputStudentId();
                    }.bind(this))) {
                    this.messageArray([
                        {
                            severity: 'warning',
                            summary: "Result with same ID already exists !!",
                            autoTimeout: 6000
                        }
                    ]);
                    console.log("Result with same data already exist !!");
                }
                else {
                    const result_data = {
                        ID: this.inputStudentId(),
                        NAME: this.inputStudentName(),
                        CLASS: this.inputClass(),
                        MARKS_SUB1: this.inputMarksSub1(), 
                        Email:this.emailPatternValue()
                    };
                    try {
                        console.log(result_data)
                        await ResultsServices.addResult(result_data);
                    } 
                    catch (error) {
                        console.log(error);
                    }
                    this.__fetchResults();
                }
            }
        };
        console.log("called")
        IncidentViewModel.prototype.__updateRow = async function () {
            // console.log("called")
            if (this.groupValid() !== 'invalidShown') {
                const result_data = {
                    ID: this.inputStudentId(),
                    NAME: this.inputStudentName(),
                    CLASS: this.inputClass(),
                    MARKS_SUB1: this.inputMarksSub1(), 
                    Email:this.emailPatternValue()
                };
                console.log(result_data)
                try {
                    const res = await ResultsServices.updateResult(result_data);
                    console.log("hc")
                   console.log(res);
                } 
                catch (error) {

                    console.log(error);
                }

                this.__fetchResults();
            }
            console.log("direct")
        };

        // IncidentViewModel.prototype.__addResult = async function () {
        //     let dataFromService;
        //     try {
        //         dataFromService = await ResultsServices.addResult();
        //     } 
        //     catch (error) {
        //         console.log(error);
        //     }
        //     if (dataFromService) {
        //         console.log("Data: ", dataFromService);
        //         this.resultsData(dataFromService);
        //         this.isLoading(false);
        //     }
        // }

        IncidentViewModel.prototype.__fetchResults = async function () {
            let dataFromService;
            try {
                dataFromService = await ResultsServices.fetchResults();
            } 
            catch (error) {
                console.log(error);
            }
            if (dataFromService) {
                console.log("Data: ", dataFromService);
                this.resultsData(dataFromService);
                // this.resultsDataProvider.containsKeys({ID:2}).then(function (value) {
                    // if (value == 0) {
                        // console.log(ko.utils.arrayFirst(this.resultsData(), function(item) {
                        //     return item.ID == 1;
                        // }));
                        // this.isEmptyTable(true);
                    // }
                // }.bind(this));
                // await this.resultsDataProvider.containsKeys(2);
                this.isLoading(false);
            }
        };

        return IncidentViewModel;
    }
);