sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/core/format/DateFormat",
	"sap/m/Button",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter",
], function (Controller, MessageToast, MessagePopover, MessageItem, Df, Button, FO, Filter) {
	"use strict";
	var oMessagePopover;
	return Controller.extend("Prod_Ord_Conf.Production_Ord_Conf.controller.FileUpload", {

			onInit: function () {

				this._pModel = this.getOwnerComponent().getModel("PORD");
				this._pstockModel = this.getOwnerComponent().getModel("PORDSTOCK");
				this._tModel = new sap.ui.model.json.JSONModel();
				this._msgModel = new sap.ui.model.json.JSONModel();
				this._oPromises = [];
				this._cPromises = [];
				this._msgArr = [];
				this._sCount = 0;
				this._msgData = {
					"msgs": this._msgArr
				};
				var uBut = this.byId("cUpload");
				uBut.setEnabled(false);

			},

			handleUploadPress: function () {
				function sortelements(a, b) {
					var num1 = parseInt(b.OrdNo);
					var num2 = parseInt(a.OrdNo);
					var num3 = parseInt(a.OpNo);
					var num4 = parseInt(b.OpNo);
					if (num2 < num1) {
						return -1;
					}
					if (num1 == num2) {
						if (num3 < num4)
							return -1;
					}

				}

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
							//		var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
							var arrCSV = strCSV.replace(/\n/g, ",").split(",");
							var noOfCols = 11;
							var headerRow = arrCSV.splice(0, noOfCols);
							// arrCSV.length 

							while ((arrCSV.length - 1) > 0) {
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
										/*								case 2:
																			pobj["Seq"] = obj[headerRow[i]];
																			break; */
										/*					case 2:
																pobj["Ctype"] = obj[headerRow[i]];
																break; */
									case 2:
										pobj["Quan"] = obj[headerRow[i]];
										break;
										/*								case :
																			pobj["Unit"] = obj[headerRow[i]];
																			break; */
									case 3:
										pobj["CTEXT"] = obj[headerRow[i]];
										break;

									case 4:
										//			var odtf = new Df.getDateTimeInstance();
										//			var vdate = new Date(obj[headerRow[i]]);
										//			odtf.format(vdate);
										var s1 = obj[headerRow[i]];

										pobj["ValidF"] = s1.substr(0, 4) + "-" + s1.substr(4, 2) + "-" + s1.substr(6, 2) + "T00:00:00";

										break;
									case 5:
										var s3 = obj[headerRow[i]];
										pobj["ValidFT"] = "PT" + s3.substr(0, 2) + "H" + s3.substr(2, 2) + "M" + s3.substr(4, 2) + "S";
										break;
									case 6:
										var s2 = obj[headerRow[i]];
										pobj["ValidFE"] = s2.substr(0, 4) + "-" + s2.substr(4, 2) + "-" + s2.substr(6, 2) + "T00:00:00";
										break;
									case 7:
										var s4 = obj[headerRow[i]];
										pobj["ValidFET"] = "PT" + s4.substr(0, 2) + "H" + s4.substr(2, 2) + "M" + s4.substr(4, 2) + "S";
										break;
									case 8:
										var s5 = obj[headerRow[i]];
										pobj["PDATE"] = s5.substr(0, 4) + "-" + s5.substr(4, 2) + "-" + s5.substr(6, 2) + "T00:00:00";
										break;
									case 9:
										pobj["BT"] = obj[headerRow[i]];
										break;
									case 10:
										pobj["PNO"] = obj[headerRow[i]];
										break;
									}
								}
								data.push(obj);
								pdata.push(pobj);
							}

							pdata.sort(sortelements);
							that._tModel.setData(mdata);
							oTable.setModel(that._tModel);
							var sData = that.validateFileData();

							if (sData) {
								var uBut = that.byId("cUpload");
								uBut.setEnabled(true);
								that.byId("fileUploader").setEnabled(false);
								that.byId("tUpload").setEnabled(false);
							}
						};
						reader.readAsBinaryString(file);

					}

				}
			},
			createProdConfPress: function () {

				function calculateDateDiff(tDate, fDate) {

					var sec = (tDate.getTime() - fDate.getTime()) / 1000;
					var hrs = sec / (60 * 60);
					return Number((Math.round(hrs + "e2") + "e-2")).toFixed(2);
				}

				//			sap.ui.core.BusyIndicator.show();
				var that = this;
				var cdata = this._tModel.getData();
				var pordModel = this._pModel;
				var gID;
				var oldOrdNo;
				var k;
				for (var j = 0; j < cdata.prec.length; j++) {
                    if ( cdata.prec[j].Error === " ")
                    {
					var obj = {};
					obj.OrderID = cdata.prec[j].OrdNo;
					obj.OrderOperation = cdata.prec[j].OpNo;
					obj.Sequence = "0"; //cdata.prec[j].Seq;
					/*				if (cdata.prec[j].Ctype == "Y") {
										obj.FinalConfirmationType = "X";
									} */
					obj.ConfirmationYieldQuantity = cdata.prec[j].Quan;

					//		obj.ConfirmationUnit = cdata.prec[j].Unit;
					obj.ConfirmedExecutionStartDate = cdata.prec[j].ValidF;
					obj.ConfirmedExecutionStartTime = cdata.prec[j].ValidFT;
					obj.ConfirmedProcessingEndDate = cdata.prec[j].ValidFE;
					obj.ConfirmedProcessingEndTime = cdata.prec[j].ValidFET;
					var d1 = obj.ConfirmedExecutionStartDate;
					var d2 = obj.ConfirmedProcessingEndDate;
					var t1 = obj.ConfirmedExecutionStartTime;
					var t2 = obj.ConfirmedProcessingEndTime;
					var nfdate = d1.substr(0, 4) + "/" + d1.substr(5, 2) + "/" + d1.substr(8, 2) + " " +
						t1.substr(2, 2) + ":" + t1.substr(5, 2) + ":" + t1.substr(8, 2);
					var ntdate = d2.substr(0, 4) + "/" + d2.substr(5, 2) + "/" + d2.substr(8, 2) + " " +
						t2.substr(2, 2) + ":" + t2.substr(5, 2) + ":" + t2.substr(8, 2);

					var fDate = new Date(nfdate);
					var tDate = new Date(ntdate);
					var lHrs = calculateDateDiff(tDate, fDate);
					var aHrs = lHrs.split(".");
					var num = aHrs[0];
					var sHrs;

					if (num.toString().length == 1) {
						sHrs = "00" + lHrs;
					}
					if (num.toString().length == 2) {
						sHrs = "0" + lHrs;
					}
					if (num.toString().length == 3) {
						sHrs = lHrs;
					}

					obj.OpConfirmedWorkQuantity1 = lHrs;
					obj.OpWorkQuantityUnit1 = "HR";
					//	obj.ConfirmationText = "Production Hours=" +  sHrs + "HR" + " " + cdata.prec[j].CTEXT ;
					obj.ConfirmationText = cdata.prec[j].CTEXT;
					obj.PostingDate = cdata.prec[j].PDATE;
					obj.ConfirmedBreakDuration = cdata.prec[j].BT;
					obj.BreakDurationUnit = "MIN";
					obj.Personnel = cdata.prec[j].PNO;
					if (j == 0) {
						k = 0;
						gID = "GID" + k;
						oldOrdNo = obj.OrderID;
					}
					if (oldOrdNo !== obj.OrderID) {
						k = k + 1;
						oldOrdNo = obj.OrderID;
						gID = "GID" + k;
					}

					var oPromise = new Promise(function (resolve, reject) {

						pordModel.create('/ProdnOrdConf2', obj, {
							success: function (oResponse) {
								var msgObj = {};
								//			msgObj["Pord"] = oResponse.OrderID;
								msgObj["Mtype"] = "Success";
								msgObj["Ordno"] = obj.OrderID;
								msgObj["Msg"] = "Production Order Confirmattion created with Confirmation Group " + oResponse.ConfirmationGroup +
									oResponse.ConfirmationCount;
								that._msgArr.push(msgObj);
								resolve();
								//  MessageToast.show("Production Order Confirmation Creared") ;

							},
							error: function (oError) {

								var msgObj = {};
								//			msgObj["Pord"] = oError.OrderID;
								msgObj["Mtype"] = "Error";
								msgObj["Ordno"] = obj.OrderID;
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
				}
				return this._oPromises;
			},
			displayLog: function () {
				this._msgData.msgs = this._msgArr;
				this._msgModel.setData(this._msgData);
				sap.ui.getCore().setModel(this._msgModel, "mModel");

				var oMessageTemplate = new MessageItem({
					type: "{type}",
					title: "{title}",
					activeTitle: "{active}",
					description: "{description}",
					subtitle: "{subtitle}",
					counter: "{counter}",

				});

				oMessagePopover = new MessagePopover({
					items: {
						path: '/',
						template: oMessageTemplate
					},
					activeTitlePress: function () {

					}
				});

				var scount = 0;
				var ecount = 0;
				var aMockMessages = [];
				for (var k = 0; k < this._msgArr.length; k++) {
					var mobj = {};
					if (this._msgArr[k].Mtype == "Success") {
						mobj["type"] = this._msgArr[k].Mtype;
						mobj["title"] = "Success Message";
						mobj["active"] = false;
						mobj["description"] = this._msgArr[k].Msg;
						mobj["subtitle"] = "Production Order Confirmaiton Created for" + " " + this._msgArr[k].Ordno + " " + "Order";
						scount = scount + 1;
						mobj["conunter"] = scount;
					} else {

						mobj["type"] = this._msgArr[k].Mtype;
						mobj["title"] = "Error Message";
						mobj["active"] = true;
						mobj["description"] = this._msgArr[k].Msg;
						mobj["subtitle"] = "Production Order Confirmaiton for" + " " + this._msgArr[k].Ordno + " " + "Creation Failed";
						ecount = ecount + 1;
						mobj["conunter"] = scount;
					}
					aMockMessages.push(mobj);
				}

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(aMockMessages);
				this.getView().setModel(oModel);
				var oButton = new Button({
					id: "logBut",
					text: "Log",
					type: "Emphasized",
					width: "6rem",
					formter: function () {

					}

				});
				//			oButton.addStyleClass("sapUiMediumMarginTop");
				oButton.addDependent(oMessagePopover);
				oButton.attachPress(this.handleMessagePopoverPress);
				var oTool = this.getView().byId("oToolBar");
				oTool.addContent(oButton);
				this.byId("cUpload").setEnabled(false);
				this.byId("tUpload").setEnabled(false);
				this.byId("fileUploader").setEnabled(false);

				//		this.byId("messagePopoverBtn").addDependent(oMessagePopover);

				//  this.getOwnerComponent().getRouter().navTo("RLog");

			},
			handlePost: function () {
				if (this._sCount > 0) {
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

								count = count + 1;
								if (count === (that._oPromises.length)) {

									sap.ui.core.BusyIndicator.hide();
									//							MessageToast.show(count + "Production Order Confirmation successfully Created");
									that.displayLog();
								}
								return r;

							}, function (error) {
								count = count + 1;
								if (count === (that._oPromises.length)) {

									sap.ui.core.BusyIndicator.hide();
									that.displayLog();
								}
							});

						});
						return oPromises;
					};

					var tPromises = [];

					tPromises = this.createProdConfPress();
					var cPromise = Promise.allSettled(tPromises);

				} else {
					sap.ui.core.BusyIndicator.hide();
					this.displayLog();
				}

			},
			buttonTypeFormatter: function () {
				var sHighestSeverity;
				var aMessages = this.getView().getModel().oData;

				aMessages.forEach(function (sMessage) {
					switch (sMessage.type) {
					case "Error":
						sHighestSeverity = "Negative";
						break;
					case "Warning":
						sHighestSeverity = sHighestSeverity !== "Negative" ? "Critical" : sHighestSeverity;
						break;
					case "Success":
						sHighestSeverity = sHighestSeverity !== "Negative" && sHighestSeverity !== "Critical" ? "Success" : sHighestSeverity;
						break;
					default:
						sHighestSeverity = !sHighestSeverity ? "Neutral" : sHighestSeverity;
						break;
					}
				});

				return sHighestSeverity;
			},
			buttonIconFormatter: function () {
				var sIcon;
				var aMessages = this.getView().getModel().oData;

				aMessages.forEach(function (sMessage) {
					switch (sMessage.type) {
					case "Error":
						sIcon = "sap-icon://message-error";
						break;
					case "Warning":
						sIcon = sIcon !== "sap-icon://message-error" ? "sap-icon://message-warning" : sIcon;
						break;
					case "Success":
						sIcon = "sap-icon://message-error" && sIcon !== "sap-icon://message-warning" ? "sap-icon://message-success" : sIcon;
						break;
					default:
						sIcon = !sIcon ? "sap-icon://message-information" : sIcon;
						break;
					}
				});

				return sIcon;
			},
			handleMessagePopoverPress: function (oEvent) {
				oMessagePopover.toggle(oEvent.getSource());
			},
			handleRefresh: function () {
				this._tModel.setData();
				this._msgArr = [];
				this._oPromises = [];
				this._cPromises = [];
				this._sCount = 0;
				this._msgModel.setData();
				this.byId("tUpload").setEnabled(true);
				this.byId("fileUploader").setEnabled(true);
				this.byId("fileUploader").clear();
				this.byId("cUpload").setEnabled(false);
				var oBut = sap.ui.getCore().byId("logBut");
				oBut.destroy();
				//      oBut.destroy();

			},
			validateFileData: function () {
				var fData = this._tModel.getData();
				var ecount = 0;
				var aMockMessages = [];
				for (var i = 0; i < fData.prec.length; i++) {

					var fTime = fData.prec[i].ValidFT;
					var tTime = fData.prec[i].ValidFET;
					var fHrs = fTime.substr(2, 2);
					var fMin = fTime.substr(5, 2);
					var fSec = fTime.substr(8, 2);
					var tHrs = tTime.substr(2, 2);
					var tMin = tTime.substr(5, 2);
					var tSec = tTime.substr(8, 2);

					var d1 = fData.prec[i].ValidF;
					var d2 = fData.prec[i].ValidFE;
					var t1 = fData.prec[i].ValidFT;
					var t2 = fData.prec[i].ValidFET;
					var nfdate = d1.substr(0, 4) + "/" + d1.substr(5, 2) + "/" + d1.substr(8, 2) + " " +
						t1.substr(2, 2) + ":" + t1.substr(5, 2) + ":" + t1.substr(8, 2);
					var ntdate = d2.substr(0, 4) + "/" + d2.substr(5, 2) + "/" + d2.substr(8, 2) + " " +
						t2.substr(2, 2) + ":" + t2.substr(5, 2) + ":" + t2.substr(8, 2);

					var fDate = new Date(nfdate);
					var tDate = new Date(ntdate);
					if (fDate > tDate) {
						var tobj = {};
						fData.prec[i]["SDColorCode"] = "Red";
						fData.prec[i]["EDColorCode"] = "Red";
						tobj["type"] = "Error";
						tobj["title"] = "Error Message";
						tobj["active"] = true;
						tobj["description"] = "Execution Start Date Time is greator than Execution End Date Time  !";
						tobj["subtitle"] = "Start Date Time is beyoud End Date Time ! ";
						ecount = ecount + 1;
						tobj["conunter"] = ecount;
						aMockMessages.push(tobj);
					}
					var bTime = fData.prec[i].BT;
					if (isNaN(bTime)) {
						var nobj = {};
						fData.prec[i]["BTColorCode"] = "Red";
						nobj["type"] = "Error";
						nobj["title"] = "Error Message";
						nobj["active"] = true;
						nobj["description"] = "Break Time should be numeric value!";
						nobj["subtitle"] = "Break Time is not number ! ";
						ecount = ecount + 1;
						nobj["conunter"] = ecount;
						aMockMessages.push(nobj);

					} else {

					}
					if (fData.prec[i].BT == "") {

						var bobj = {};
						fData.prec[i]["BTColorCode"] = "Red";
						bobj["type"] = "Error";
						bobj["title"] = "Error Message";
						bobj["active"] = true;
						bobj["description"] = "Break Time can not be blank !";
						bobj["subtitle"] = "Break Time is wrong ! ";
						ecount = ecount + 1;
						bobj["conunter"] = ecount;
						aMockMessages.push(bobj);

					}
					if (fHrs > 23) {
						fData.prec[i]["FTColorCode"] = "Red";
						var mobj = {};
						mobj["type"] = "Error";
						mobj["title"] = "Error Message";
						mobj["active"] = true;
						mobj["description"] = "Hours can not be greator than 23";
						mobj["subtitle"] = "Hours are wrong ! ";
						ecount = ecount + 1;
						mobj["conunter"] = ecount;
						aMockMessages.push(mobj);
					}

					if (fMin > 59) {
						fData.prec[i]["FTColorCode"] = "Red";
						var mmobj = {};
						mmobj["type"] = "Error";
						mmobj["title"] = "Error Message";
						mmobj["active"] = true;
						mmobj["description"] = "Minutes can not be greator than 59";
						mmobj["subtitle"] = "Minutes are wrong ! ";
						ecount = ecount + 1;
						mmobj["conunter"] = ecount;
						aMockMessages.push(mmobj);
					}

					if (fSec > 59) {
						fData.prec[i]["FTColorCode"] = "Red";
						var msobj = {};
						msobj["type"] = "Error";
						msobj["title"] = "Error Message";
						msobj["active"] = true;
						msobj["description"] = "Seconds can not be greator than 59";
						msobj["subtitle"] = "Seconds are wrong ! ";
						ecount = ecount + 1;
						msobj["conunter"] = ecount;
						aMockMessages.push(msobj);
					}
					if (tHrs > 23) {
						fData.prec[i]["FETColorCode"] = "Red";
						var tmobj = {};
						tmobj["type"] = "Error";
						tmobj["title"] = "Error Message";
						tmobj["active"] = true;
						tmobj["description"] = "Hours can not be greator than 23";
						tmobj["subtitle"] = "Hours are wrong ! ";
						ecount = ecount + 1;
						tmobj["conunter"] = ecount;
						aMockMessages.push(tmobj);
					}

					if (tMin > 59) {
						fData.prec[i]["FETColorCode"] = "Red";
						var tmmobj = {};
						tmmobj["type"] = "Error";
						tmmobj["title"] = "Error Message";
						tmmobj["active"] = true;
						tmmobj["description"] = "Minutes can not be greator than 59";
						tmmobj["subtitle"] = "Minutes are wrong ! ";
						ecount = ecount + 1;
						tmmobj["conunter"] = ecount;
						aMockMessages.push(tmmobj);
					}

					if (tSec > 59) {
						fData.prec[i]["FETColorCode"] = "Red";
						var tmsobj = {};
						tmsobj["type"] = "Error";
						tmsobj["title"] = "Error Message";
						tmsobj["active"] = true;
						tmsobj["description"] = "Seconds can not be greator than 59";
						tmsobj["subtitle"] = "Seconds are wrong ! ";
						ecount = ecount + 1;
						msobj["conunter"] = ecount;
						aMockMessages.push(tmsobj);
					}

				}
				this._tModel.setData(fData);
				var oMessageTemplate = new MessageItem({
					type: "{type}",
					title: "{title}",
					activeTitle: "{active}",
					description: "{description}",
					subtitle: "{subtitle}",
					counter: "{counter}",

				});

				if (aMockMessages.length > 0) {
					oMessagePopover = new MessagePopover({
						items: {
							path: '/',
							template: oMessageTemplate
						},
						activeTitlePress: function () {

						}
					});

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aMockMessages);
					this.getView().setModel(oModel);
					var oButton = new Button({
						id: "logBut",
						text: "Log",
						type: "Emphasized",
						width: "6rem",
						formter: function () {

						}

					});
					//			oButton.addStyleClass("sapUiMediumMarginTop");
					oButton.addDependent(oMessagePopover);
					oButton.attachPress(this.handleMessagePopoverPress);
					var oTool = this.getView().byId("oToolBar");
					oTool.addContent(oButton);
					//			oTool.addStyleClass("myPadd");
					this.byId("cUpload").setEnabled(false);
					this.byId("tUpload").setEnabled(false);
					this.byId("fileUploader").setEnabled(false);
					return false;

				} else {
					return true;
				}

			},
			checkProdOrdConf: function () {

				var cCount = 0;

				var that = this;
				sap.ui.core.BusyIndicator.show();
				Promise.allSettled = function (oPromises) {

					oPromises.forEach(function (r) {
						r.then(function (param) {

							cCount = cCount + 1;
							if (cCount === (that._cPromises.length)) {

								//			sap.ui.core.BusyIndicator.hide();
								that.handlePost();
								return true;

							}
							return r;

						}, function (error) {
							cCount = cCount + 1;
							if (cCount === (that._cPromises.length)) {

								//			sap.ui.core.BusyIndicator.hide();
								that.handlePost();
								return true;

							}
						});

					});
					return oPromises;
				};

				var lPromises = this.checkProdOrd();
				var lPromise = Promise.allSettled(lPromises);

			},
			checkProdOrd: function () {

				var fData = this._tModel.getData();

				for (var i = 0; i < fData.prec.length; i++) {
					var lPromise = this.checkProdOrdStock(fData.prec[i].OrdNo, fData.prec[i].OpNo, fData.prec[i].Quan);
					this._cPromises.push(lPromise);
				}
				return this._cPromises;

			},
			checkProdOrdStock: function (Ordno, Opno, Quan) {
				var that = this;
				var psModel = this._pstockModel;
				var lPromise = new Promise(function (resolve, reject) {
						var obj = {};
						var oFltr = [];
						oFltr.push(new Filter("ManufacturingOrder", FO.EQ, Ordno));
						oFltr.push(new Filter("ManufacturingOrderOperation", FO.EQ, Opno));
						psModel.read('/YY1_Prod_Ord_Comp_Stock', {
								filters: oFltr,
								success: function (oResponse) {

									var eFlag = " ";
									var msgObj = {};
									var fData = that._tModel.getData();
									var cObj = [];
									for (var j = 0; j < oResponse.results.length; j++) {
										var Obj = {};
										var qratio = oResponse.results[j].RequiredQuantity / oResponse.results[j].MfgOrderPlannedTotalQty;
										var rQuan;
										rQuan = qratio * Quan;
										if (j === 0) {
											Obj["Material"] = oResponse.results[j].Material;
											Obj["Plant"] = oResponse.results[j].ProductionPlant;
											Obj["StorageLocation"] = oResponse.results[j].StorageLocation;
											Obj["CQuantity"] = rQuan;
											Obj["StockQuantity"] = oResponse.results[j].MatlWrhsStkQtyInMatlBaseUnit;
											cObj.push(Obj);
										} else {
											var aIndex = cObj.findIndex(function (oArr, ind) {

											return oArr.Material === oResponse.results[j].Material && oArr.Plant === oResponse.results[j].ProductionPlant && oArr.StorageLocation ===
													oResponse.results[j].StorageLocation;
											});
											if(aIndex !== -1) {
												cObj[aIndex].StockQuantity = parseFloat(cObj[aIndex].StockQuantity) + parseFloat(oResponse.results[j].MatlWrhsStkQtyInMatlBaseUnit);

											} else {
												Obj["Material"] = oResponse.results[j].Material;
												Obj["Plant"] = oResponse.results[j].ProductionPlant;
												Obj["StorageLocation"] = oResponse.results[j].StorageLocation;
												Obj["CQuantity"] = rQuan;
												Obj["StockQuantity"] = oResponse.results[j].MatlWrhsStkQtyInMatlBaseUnit;
												cObj.push(Obj);
											}

										}
									}
                                    for ( var k = 0;k<cObj.length;k++ )
                                    {
                                    	var StockQuantity = parseFloat(cObj[k].StockQuantity);
                                    	var CQuantity = parseFloat( cObj[k].CQuantity );
                                    	if (StockQuantity < CQuantity ) {
										eFlag = "X";
										var Mat = cObj[k].Material;
										var Sloc = cObj[k].StorageLocation;
										msgObj["Mtype"] = "Error";
										msgObj["Ordno"] = Ordno;
										msgObj["Msg"] = "Material Component" + " " + Mat + " " + "has less quantity in" + " " + Sloc + "Storage Location.";
										that._msgArr.push(msgObj);
										break;
									}
                                    }

									var cind = fData.prec.findIndex(function (cEle, ind) {
									return cEle.OrdNo === Ordno && cEle.OpNo === Opno;

								});
								var Obj = fData.prec[cind];
								if (eFlag === "X") {
									Obj["Error"] = "X";
								} else {
									Obj["Error"] = " ";
									that._sCount = that._sCount + 1;
								}

								resolve();

							},
							error: function (oError) {
								var fData = that._tModel.getData();
								var msgObj = {};
								//			msgObj["Pord"] = oError.OrderID;
								var cind = fData.prec.findIndex(function (cEle, ind) {
									return cEle.OrdNo === Ordno && cEle.OpNo === Opno;

								});

								var Obj = fData.prec[cind];
								Obj["Error"] = "X";
								msgObj["Mtype"] = "Error";
								msgObj["Ordno"] = Ordno;
								msgObj["Msg"] = oError.responseText;
								that._msgArr.push(msgObj);

								reject();
								//	 MessageToast.show("Error while creating the production ordr confirmation") ;	
							}

						});

				});
			return lPromise;
		}

	});
});