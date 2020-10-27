/*global QUnit*/

sap.ui.define([
	"Prod_Ord_Conf/Production_Ord_Conf/controller/FileUpload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FileUpload Controller");

	QUnit.test("I should test the FileUpload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});