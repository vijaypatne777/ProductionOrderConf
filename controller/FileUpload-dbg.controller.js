sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function (Controller, MessageToast, Df) {
	"use strict";

	return Controller.extend("Prod_Ord_Conf.Production_Ord_Conf.controller.FileUpload", {

		onInit: function () {

			this._pModel = this.getOwnerComponent().getModel("PORD");
			this._tModel = new sap.ui.model.json.JSONModel();
			this._msgModel = new sap.ui.model.json.JSONModel();
			this._oPromises = [];
			this._msgArr = [];
			this._msgData = {
				"msgs": this._msgArr
			};
		var uBut =	this.byId("cUpload");
		uBut.setEnabled(false);

		},

		handleUploadPress: function () {
			var that = this;
			var data = [];
			var pdata = [];
			var mdata = {
				"prec": pdata
			};

			var oFileUpload = this.byId("fileUploader");

			var oTable = this.byId("prodTable");
			if (!oFileUpload.getValue()) {
				MessageToast.show("Select the file first!");
				return;
			} else {
				var ofile = oFileUpload.getFocusDomRef();
				var file = ofile.files[0];
				if (file && window.FileReader) {
					var reader = new FileReader();
					reader.onload = function (oEvent) {
						var strCSV = oEvent.target.result;
						var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
						var noOfCols = 14;
						var headerRow = arrCSV.splice(0, noOfCols);

						while (arrCSV.length > 0) {
							var obj = {};
							var pobj = {};
							var row = arrCSV.splice(0, noOfCols);
							for (var i = 0; i < row.length; i++) {
								obj[headerRow[i]] = row[i].trim();
								switch (i) {
								case 0:
									pobj["OrdNo"] = obj[headerRow[i]];
									break;
								case 1:
									pobj["OpNo"] = obj[headerRow[i]];
									break;
								case 2:
									pobj["Seq"] = obj[headerRow[i]];
									break;
								case 3:
									pobj["Ctype"] = obj[headerRow[i]];
									break;	
								case 4:
									pobj["Quan"] = obj[headerRow[i]];
									break;
								case 5:
									pobj["Unit"] = obj[headerRow[i]];
									break;
								case 6:
									pobj["CTEXT"] = obj[headerRow[i]];
									break;

								case 7:
									//			var odtf = new Df.getDateTimeInstance();
									//			var vdate = new Date(obj[headerRow[i]]);
									//			odtf.format(vdate);
									var s1 = obj[headerRow[i]];
									pobj["ValidF"] = s1.substr(0, 4) + "-" + s1.substr(4, 2) + "-" + s1.substr(6, 2) + "T00:00:00";

									break;
								case 8:
									var s3 = obj[headerRow[i]];
									pobj["ValidFT"] = "PT" + s3.substr(0, 2) + "H" + s3.substr(2, 2) + "M" + s3.substr(4, 2) + "S";
									break;
								case 9:
									var s2 = obj[headerRow[i]];
									pobj["ValidFE"] = s2.substr(0, 4) + "-" + s2.substr(4, 2) + "-" + s2.substr(6, 2) + "T00:00:00";
									break;
								case 10:
									var s4 = obj[headerRow[i]];
									pobj["ValidFET"] = "PT" + s4.substr(0, 2) + "H" + s4.substr(2, 2) + "M" + s4.substr(4, 2) + "S";
									break;
								case 11:
									var s5 = obj[headerRow[i]];
									pobj["PDATE"] = s5.substr(0, 4) + "-" + s5.substr(4, 2) + "-" + s5.substr(6, 2) + "T00:00:00";
									break;
								case 12:
									pobj["BT"] = obj[headerRow[i]];
									break;
								case 13:
									pobj["PNO"] = obj[headerRow[i]];
									break;
								}
							}
							data.push(obj);
							pdata.push(pobj);
						}
						that._tModel.setData(mdata);
						oTable.setModel(that._tModel);
						var uBut =	that.byId("cUpload");
		                uBut.setEnabled(true);


					};
					reader.readAsBinaryString(file);

				}

			}
		},
		createProdConfPress: function () {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var cdata = this._tModel.getData();
			var pordModel = this._pModel;
			var gID;
			for (var j = 0; j < cdata.prec.length; j++) {
				var obj = {};
				obj.OrderID = cdata.prec[j].OrdNo;
				obj.OrderOperation = cdata.prec[j].OpNo;
				obj.Sequence = cdata.prec[j].Seq;
				if ( cdata.prec[j].Ctype == "Y" )
				{
				obj.FinalConfirmationType = "X";
				}
				obj.ConfirmationYieldQuantity = cdata.prec[j].Quan;
				obj.ConfirmationText = cdata.prec[j].CTEXT;
				obj.ConfirmationUnit = cdata.prec[j].Unit;
				obj.ConfirmedExecutionStartDate = cdata.prec[j].ValidF;
				obj.ConfirmedExecutionStartTime = cdata.prec[j].ValidFT;
				obj.ConfirmedProcessingEndDate = cdata.prec[j].ValidFE;
				obj.ConfirmedProcessingEndTime = cdata.prec[j].ValidFET;
				obj.PostingDate = cdata.prec[j].Pdate;
				obj.ConfirmedBreakDuration = cdata.prec[j].BT;
				obj.Personnel = cdata.prec[j].PNO;
                 gID = "GID" + j;
				var oPromise = new Promise(function (resolve, reject) {
                   
					pordModel.create('/ProdnOrdConf2', obj, {
						success: function (oResponse) {
							var msgObj = {};
				//			msgObj["Pord"] = oResponse.OrderID;
							msgObj["Mtype"] = "Success";
							msgObj["Msg"] = "Production Order Confirmattion created with Confirmation Group " + oResponse.ConfirmationGroup + oResponse.ConfirmationCount;
							that._msgArr.push(msgObj);
							resolve();
							//  MessageToast.show("Production Order Confirmation Creared") ;

						},
						error: function (oError) {
						 
                            var msgObj = {};
				//			msgObj["Pord"] = oError.OrderID;
							msgObj["Mtype"] = "Error";
							msgObj["Msg"] = oError.responseText;
							that._msgArr.push(msgObj);
							reject();
							//	 MessageToast.show("Error while creating the production ordr confirmation") ;	
						},
						groupId: gID
					});
				});
				this._oPromises.push(oPromise);

			}
			return this._oPromises;
		},
		promiseCompleted: function () {
	     this._msgData.msgs = this._msgArr;
	     this._msgModel.setData(this._msgData);
         sap.ui.getCore().setModel(this._msgModel,"mModel");
         
         this.getOwnerComponent().getRouter().navTo("RLog");
     
		},
		handlePost:  function () {
			var that = this;
            var count = 0;
			Promise.allSettled = function (oPromises) {
				/*		let nPromises = Array.from(oPromises).map(p =>
							this.resolve(p).then(
								this.val => ({
									this.state: 'fulfiled'
									this.value: 6
								}),
								err => ({
									this.state: 'rejected'
									this.reason: err
								})
							));*/
                 
				oPromises.forEach(function (r) {
					r.then(function (param) {

						count = count + 1 ;
						if (count === ( that._oPromises.length  ))
						{
				
				        sap.ui.core.BusyIndicator.hide();
						MessageToast.show( count +  "Production Order Confirmation successfully Created");
						that.promiseCompleted();
						}
						return r;
						
					}, function (error) {
                       	count = count + 1 ;
						if (count === ( that._oPromises.length  ))
						{
					
							sap.ui.core.BusyIndicator.hide();
							that.promiseCompleted();
						}
					});

				});
              return oPromises;
			};

			var tPromises = [];

			tPromises = this.createProdConfPress();
			var cPromise = Promise.allSettled(tPromises);
	
		}

	});
});