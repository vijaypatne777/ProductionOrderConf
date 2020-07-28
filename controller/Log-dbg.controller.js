sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"sap/ui/core/routing/History"
		], function (Controller, History) {
			"use strict";

			return Controller.extend("Prod_Ord_Conf.Production_Ord_Conf.controller.Log", {

					/**
					 * Called when a controller is instantiated and its View controls (if available) are already created.
					 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
					 * @memberOf Prod_Ord_Conf.Production_Ord_Conf.view.Log
					 */
					onInit: function () {
						this.getOwnerComponent().getRouter().getRoute("RLog").attachPatternMatched(this.displayLog, this);
					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
					 * (NOT before the first rendering! onInit() is used for that one!).
					 * @memberOf Prod_Ord_Conf.Production_Ord_Conf.view.Log
					 */
					//	onBeforeRendering: function() {
					//
					//	},

					/**
					 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
					 * This hook is the same one that SAPUI5 controls get after being rendered.
					 * @memberOf Prod_Ord_Conf.Production_Ord_Conf.view.Log
					 */
					//	onAfterRendering: function() {
					//
					//	},

					/**
					 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
					 * @memberOf Prod_Ord_Conf.Production_Ord_Conf.view.Log
					 */
					//	onExit: function() {
					//
					//	}
					displayLog: function () {
						var msgModel = sap.ui.getCore().getModel("mModel");
						this.getView().setModel(msgModel);
						//  var oTable =   this.byID("msgTable");
						//  oTable.setModel(msgModel);

					},
					onNavBack: function () {
						    var breplace = true;
							this.getOwnerComponent().getRouter().navTo("RouteFileUpload",{},breplace);
				/*		var oHistory = History.getInstance();
						var sPreviousHash = oHistory.getPreviousHash();
						if (sPreviousHash !== undefined) {
							history.go(-1);
						} else
						{
						   var breplace = true;
							this.getOwnerComponent().getRouter().navTo("RouteFileUpload",{},breplace);
						}*/
					}
					});

			});