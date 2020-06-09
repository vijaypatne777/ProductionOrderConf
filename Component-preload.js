//@ui5-bundle Prod_Ord_Conf/Production_Ord_Conf/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"Prod_Ord_Conf/Production_Ord_Conf/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","Prod_Ord_Conf/Production_Ord_Conf/model/models"],function(e,o,t){"use strict";return e.extend("Prod_Ord_Conf.Production_Ord_Conf.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")},destroy:function(){sap.ui.core.UIComponent.prototype.destroy.apply(this,arguments)}})});
},
	"Prod_Ord_Conf/Production_Ord_Conf/controller/FileUpload.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/MessagePopover","sap/m/MessageItem","sap/ui/core/format/DateFormat","sap/m/Button","sap/ui/model/FilterOperator","sap/ui/model/Filter"],function(e,r,t,s,a,o,i,n){"use strict";var u;return e.extend("Prod_Ord_Conf.Production_Ord_Conf.controller.FileUpload",{onInit:function(){this._pModel=this.getOwnerComponent().getModel("PORD");this._pstockModel=this.getOwnerComponent().getModel("PORDSTOCK");this._tModel=new sap.ui.model.json.JSONModel;this._msgModel=new sap.ui.model.json.JSONModel;this._oPromises=[];this._cPromises=[];this._msgArr=[];this._sCount=0;this._msgData={msgs:this._msgArr};var e=this.byId("cUpload");e.setEnabled(false)},handleUploadPress:function(){function e(e,r){var t=parseInt(r.OrdNo);var s=parseInt(e.OrdNo);var a=parseInt(e.OpNo);var o=parseInt(r.OpNo);if(s<t){return-1}if(t==s){if(a<o)return-1}}var t=this;var s=[];var a=[];var o={prec:a};var i=this.byId("fileUploader");var n=this.byId("prodTable");if(!i.getValue()){r.show("Select the file first!");return}else{var u=i.getFocusDomRef();var l=u.files[0];if(l&&window.FileReader){var d=new FileReader;d.onload=function(r){var i=r.target.result;var u=i.replace(/\n/g,",").split(",");var l=11;var d=u.splice(0,l);while(u.length-1>0){var c={};var p={};var v=u.splice(0,l);for(var h=0;h<v.length;h++){c[d[h]]=v[h].trim();switch(h){case 0:p["OrdNo"]=c[d[h]];break;case 1:p["OpNo"]=c[d[h]];break;case 2:p["Quan"]=c[d[h]];break;case 3:p["CTEXT"]=c[d[h]];break;case 4:var g=c[d[h]];p["ValidF"]=g.substr(0,4)+"-"+g.substr(4,2)+"-"+g.substr(6,2)+"T00:00:00";break;case 5:var f=c[d[h]];p["ValidFT"]="PT"+f.substr(0,2)+"H"+f.substr(2,2)+"M"+f.substr(4,2)+"S";break;case 6:var b=c[d[h]];p["ValidFE"]=b.substr(0,4)+"-"+b.substr(4,2)+"-"+b.substr(6,2)+"T00:00:00";break;case 7:var m=c[d[h]];p["ValidFET"]="PT"+m.substr(0,2)+"H"+m.substr(2,2)+"M"+m.substr(4,2)+"S";break;case 8:var M=c[d[h]];p["PDATE"]=M.substr(0,4)+"-"+M.substr(4,2)+"-"+M.substr(6,2)+"T00:00:00";break;case 9:p["BT"]=c[d[h]];break;case 10:p["PNO"]=c[d[h]];break}}s.push(c);a.push(p)}a.sort(e);t._tModel.setData(o);n.setModel(t._tModel);var y=t.validateFileData();if(y){var E=t.byId("cUpload");E.setEnabled(true);t.byId("fileUploader").setEnabled(false);t.byId("tUpload").setEnabled(false)}};d.readAsBinaryString(l)}}},createProdConfPress:function(){function e(e,r){var t=(e.getTime()-r.getTime())/1e3;var s=t/(60*60);return Number(Math.round(s+"e2")+"e-2").toFixed(2)}var r=this;var t=this._tModel.getData();var s=this._pModel;var a;var o;var i;for(var n=0;n<t.prec.length;n++){if(t.prec[n].Error===" "){var u={};u.OrderID=t.prec[n].OrdNo;u.OrderOperation=t.prec[n].OpNo;u.Sequence="0";u.ConfirmationYieldQuantity=t.prec[n].Quan;u.ConfirmedExecutionStartDate=t.prec[n].ValidF;u.ConfirmedExecutionStartTime=t.prec[n].ValidFT;u.ConfirmedProcessingEndDate=t.prec[n].ValidFE;u.ConfirmedProcessingEndTime=t.prec[n].ValidFET;var l=u.ConfirmedExecutionStartDate;var d=u.ConfirmedProcessingEndDate;var c=u.ConfirmedExecutionStartTime;var p=u.ConfirmedProcessingEndTime;var v=l.substr(0,4)+"/"+l.substr(5,2)+"/"+l.substr(8,2)+" "+c.substr(2,2)+":"+c.substr(5,2)+":"+c.substr(8,2);var h=d.substr(0,4)+"/"+d.substr(5,2)+"/"+d.substr(8,2)+" "+p.substr(2,2)+":"+p.substr(5,2)+":"+p.substr(8,2);var g=new Date(v);var f=new Date(h);var b=e(f,g);var m=b.split(".");var M=m[0];var y;if(M.toString().length==1){y="00"+b}if(M.toString().length==2){y="0"+b}if(M.toString().length==3){y=b}u.OpConfirmedWorkQuantity1=b;u.OpWorkQuantityUnit1="HR";u.ConfirmationText=t.prec[n].CTEXT;u.PostingDate=t.prec[n].PDATE;u.ConfirmedBreakDuration=t.prec[n].BT;u.BreakDurationUnit="MIN";u.Personnel=t.prec[n].PNO;if(n==0){i=0;a="GID"+i;o=u.OrderID}if(o!==u.OrderID){i=i+1;o=u.OrderID;a="GID"+i}var E=new Promise(function(e,t){s.create("/ProdnOrdConf2",u,{success:function(t){var s={};s["Mtype"]="Success";s["Ordno"]=u.OrderID;s["Msg"]="Production Order Confirmattion created with Confirmation Group "+t.ConfirmationGroup+t.ConfirmationCount;r._msgArr.push(s);e()},error:function(e){var s={};s["Mtype"]="Error";s["Ordno"]=u.OrderID;s["Msg"]=e.responseText;r._msgArr.push(s);t()},groupId:a})});this._oPromises.push(E)}}return this._oPromises},displayLog:function(){this._msgData.msgs=this._msgArr;this._msgModel.setData(this._msgData);sap.ui.getCore().setModel(this._msgModel,"mModel");var e=new s({type:"{type}",title:"{title}",activeTitle:"{active}",description:"{description}",subtitle:"{subtitle}",counter:"{counter}"});u=new t({items:{path:"/",template:e},activeTitlePress:function(){}});var r=0;var a=0;var i=[];for(var n=0;n<this._msgArr.length;n++){var l={};if(this._msgArr[n].Mtype=="Success"){l["type"]=this._msgArr[n].Mtype;l["title"]="Success Message";l["active"]=false;l["description"]=this._msgArr[n].Msg;l["subtitle"]="Production Order Confirmaiton Created for"+" "+this._msgArr[n].Ordno+" "+"Order";r=r+1;l["conunter"]=r}else{l["type"]=this._msgArr[n].Mtype;l["title"]="Error Message";l["active"]=true;l["description"]=this._msgArr[n].Msg;l["subtitle"]="Production Order Confirmaiton for"+" "+this._msgArr[n].Ordno+" "+"Creation Failed";a=a+1;l["conunter"]=r}i.push(l)}var d=new sap.ui.model.json.JSONModel;d.setData(i);this.getView().setModel(d);var c=new o({id:"logBut",text:"Log",type:"Emphasized",width:"6rem",formter:function(){}});c.addDependent(u);c.attachPress(this.handleMessagePopoverPress);var p=this.getView().byId("oToolBar");p.addContent(c);this.byId("cUpload").setEnabled(false);this.byId("tUpload").setEnabled(false);this.byId("fileUploader").setEnabled(false)},handlePost:function(){if(this._sCount>0){var e=this;var r=0;Promise.allSettled=function(t){t.forEach(function(t){t.then(function(s){r=r+1;if(r===e._oPromises.length){sap.ui.core.BusyIndicator.hide();e.displayLog()}return t},function(t){r=r+1;if(r===e._oPromises.length){sap.ui.core.BusyIndicator.hide();e.displayLog()}})});return t};var t=[];t=this.createProdConfPress();var s=Promise.allSettled(t)}else{sap.ui.core.BusyIndicator.hide();this.displayLog()}},buttonTypeFormatter:function(){var e;var r=this.getView().getModel().oData;r.forEach(function(r){switch(r.type){case"Error":e="Negative";break;case"Warning":e=e!=="Negative"?"Critical":e;break;case"Success":e=e!=="Negative"&&e!=="Critical"?"Success":e;break;default:e=!e?"Neutral":e;break}});return e},buttonIconFormatter:function(){var e;var r=this.getView().getModel().oData;r.forEach(function(r){switch(r.type){case"Error":e="sap-icon://message-error";break;case"Warning":e=e!=="sap-icon://message-error"?"sap-icon://message-warning":e;break;case"Success":e="sap-icon://message-error"&&e!=="sap-icon://message-warning"?"sap-icon://message-success":e;break;default:e=!e?"sap-icon://message-information":e;break}});return e},handleMessagePopoverPress:function(e){u.toggle(e.getSource())},handleRefresh:function(){this._tModel.setData();this._msgArr=[];this._oPromises=[];this._cPromises=[];this._sCount=0;this._msgModel.setData();this.byId("tUpload").setEnabled(true);this.byId("fileUploader").setEnabled(true);this.byId("fileUploader").clear();this.byId("cUpload").setEnabled(false);var e=sap.ui.getCore().byId("logBut");e.destroy()},validateFileData:function(){var e=this._tModel.getData();var r=0;var a=[];for(var i=0;i<e.prec.length;i++){var n=e.prec[i].ValidFT;var l=e.prec[i].ValidFET;var d=n.substr(2,2);var c=n.substr(5,2);var p=n.substr(8,2);var v=l.substr(2,2);var h=l.substr(5,2);var g=l.substr(8,2);var f=e.prec[i].ValidF;var b=e.prec[i].ValidFE;var m=e.prec[i].ValidFT;var M=e.prec[i].ValidFET;var y=f.substr(0,4)+"/"+f.substr(5,2)+"/"+f.substr(8,2)+" "+m.substr(2,2)+":"+m.substr(5,2)+":"+m.substr(8,2);var E=b.substr(0,4)+"/"+b.substr(5,2)+"/"+b.substr(8,2)+" "+M.substr(2,2)+":"+M.substr(5,2)+":"+M.substr(8,2);var P=new Date(y);var C=new Date(E);if(P>C){var O={};e.prec[i]["SDColorCode"]="Red";e.prec[i]["EDColorCode"]="Red";O["type"]="Error";O["title"]="Error Message";O["active"]=true;O["description"]="Execution Start Date Time is greator than Execution End Date Time  !";O["subtitle"]="Start Date Time is beyoud End Date Time ! ";r=r+1;O["conunter"]=r;a.push(O)}var _=e.prec[i].BT;if(isNaN(_)){var T={};e.prec[i]["BTColorCode"]="Red";T["type"]="Error";T["title"]="Error Message";T["active"]=true;T["description"]="Break Time should be numeric value!";T["subtitle"]="Break Time is not number ! ";r=r+1;T["conunter"]=r;a.push(T)}else{}if(e.prec[i].BT==""){var S={};e.prec[i]["BTColorCode"]="Red";S["type"]="Error";S["title"]="Error Message";S["active"]=true;S["description"]="Break Time can not be blank !";S["subtitle"]="Break Time is wrong ! ";r=r+1;S["conunter"]=r;a.push(S)}if(d>23){e.prec[i]["FTColorCode"]="Red";var D={};D["type"]="Error";D["title"]="Error Message";D["active"]=true;D["description"]="Hours can not be greator than 23";D["subtitle"]="Hours are wrong ! ";r=r+1;D["conunter"]=r;a.push(D)}if(c>59){e.prec[i]["FTColorCode"]="Red";var k={};k["type"]="Error";k["title"]="Error Message";k["active"]=true;k["description"]="Minutes can not be greator than 59";k["subtitle"]="Minutes are wrong ! ";r=r+1;k["conunter"]=r;a.push(k)}if(p>59){e.prec[i]["FTColorCode"]="Red";var w={};w["type"]="Error";w["title"]="Error Message";w["active"]=true;w["description"]="Seconds can not be greator than 59";w["subtitle"]="Seconds are wrong ! ";r=r+1;w["conunter"]=r;a.push(w)}if(v>23){e.prec[i]["FETColorCode"]="Red";var I={};I["type"]="Error";I["title"]="Error Message";I["active"]=true;I["description"]="Hours can not be greator than 23";I["subtitle"]="Hours are wrong ! ";r=r+1;I["conunter"]=r;a.push(I)}if(h>59){e.prec[i]["FETColorCode"]="Red";var F={};F["type"]="Error";F["title"]="Error Message";F["active"]=true;F["description"]="Minutes can not be greator than 59";F["subtitle"]="Minutes are wrong ! ";r=r+1;F["conunter"]=r;a.push(F)}if(g>59){e.prec[i]["FETColorCode"]="Red";var N={};N["type"]="Error";N["title"]="Error Message";N["active"]=true;N["description"]="Seconds can not be greator than 59";N["subtitle"]="Seconds are wrong ! ";r=r+1;w["conunter"]=r;a.push(N)}}this._tModel.setData(e);var B=new s({type:"{type}",title:"{title}",activeTitle:"{active}",description:"{description}",subtitle:"{subtitle}",counter:"{counter}"});if(a.length>0){u=new t({items:{path:"/",template:B},activeTitlePress:function(){}});var Q=new sap.ui.model.json.JSONModel;Q.setData(a);this.getView().setModel(Q);var U=new o({id:"logBut",text:"Log",type:"Emphasized",width:"6rem",formter:function(){}});U.addDependent(u);U.attachPress(this.handleMessagePopoverPress);var V=this.getView().byId("oToolBar");V.addContent(U);this.byId("cUpload").setEnabled(false);this.byId("tUpload").setEnabled(false);this.byId("fileUploader").setEnabled(false);return false}else{return true}},checkProdOrdConf:function(){var e=0;var r=this;sap.ui.core.BusyIndicator.show();Promise.allSettled=function(t){t.forEach(function(t){t.then(function(s){e=e+1;if(e===r._cPromises.length){r.handlePost();return true}return t},function(t){e=e+1;if(e===r._cPromises.length){r.handlePost();return true}})});return t};var t=this.checkProdOrd();var s=Promise.allSettled(t)},checkProdOrd:function(){var e=this._tModel.getData();for(var r=0;r<e.prec.length;r++){var t=this.checkProdOrdStock(e.prec[r].OrdNo,e.prec[r].OpNo,e.prec[r].Quan);this._cPromises.push(t)}return this._cPromises},checkProdOrdStock:function(e,r,t){var s=this;var a=this._pstockModel;var o=new Promise(function(o,u){var l={};var d=[];d.push(new n("ManufacturingOrder",i.EQ,e));d.push(new n("ManufacturingOrderOperation",i.EQ,r));a.read("/YY1_Prod_Ord_Comp_Stock",{filters:d,success:function(a){var i=" ";var n=" ";var u={};var l=s._tModel.getData();var d=[];for(var c=0;c<a.results.length;c++){var p=parseFloat(t);var v=parseFloat(a.results[c].MfgOrderPlannedTotalQty);if(p>v){n="X";break}var h={};var g=a.results[c].RequiredQuantity/a.results[c].MfgOrderPlannedTotalQty;var f;f=g*t;if(c===0){h["Material"]=a.results[c].Material;h["Plant"]=a.results[c].ProductionPlant;h["StorageLocation"]=a.results[c].StorageLocation;h["CQuantity"]=f;h["StockQuantity"]=a.results[c].MatlWrhsStkQtyInMatlBaseUnit;d.push(h)}else{var b=d.findIndex(function(e,r){return e.Material===a.results[c].Material&&e.Plant===a.results[c].ProductionPlant&&e.StorageLocation===a.results[c].StorageLocation});if(b!==-1){d[b].StockQuantity=parseFloat(d[b].StockQuantity)+parseFloat(a.results[c].MatlWrhsStkQtyInMatlBaseUnit)}else{h["Material"]=a.results[c].Material;h["Plant"]=a.results[c].ProductionPlant;h["StorageLocation"]=a.results[c].StorageLocation;h["CQuantity"]=f;h["StockQuantity"]=a.results[c].MatlWrhsStkQtyInMatlBaseUnit;d.push(h)}}}if(n===" "){for(var m=0;m<d.length;m++){var M=parseFloat(d[m].StockQuantity);var y=parseFloat(d[m].CQuantity);if(M<y){i="X";var E=d[m].Material;var P=d[m].StorageLocation;u["Mtype"]="Error";u["Ordno"]=e;u["Msg"]="Material Component"+" "+E+"has less quantity in"+" "+P+"Storage Location.";s._msgArr.push(u);break}}var C=l.prec.findIndex(function(t,s){return t.OrdNo===e&&t.OpNo===r});var h=l.prec[C];if(i==="X"){h["Error"]="X"}else{h["Error"]=" ";s._sCount=s._sCount+1}}else{var C=l.prec.findIndex(function(t,s){return t.OrdNo===e&&t.OpNo===r});var h=l.prec[C];h["Error"]="X";u["Mtype"]="Error";u["Ordno"]=e;u["Msg"]="Confirmation quantity"+" "+t+" "+"is more than"+" "+a.results[c].MfgOrderPlannedTotalQty+"production order quanity";s._msgArr.push(u)}o()},error:function(t){var a=s._tModel.getData();var o={};var i=a.prec.findIndex(function(t,s){return t.OrdNo===e&&t.OpNo===r});var n=a.prec[i];n["Error"]="X";o["Mtype"]="Error";o["Ordno"]=e;o["Msg"]=t.responseText;s._msgArr.push(o);u()}})});return o}})});
},
	"Prod_Ord_Conf/Production_Ord_Conf/controller/Log.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(t,o){"use strict";return t.extend("Prod_Ord_Conf.Production_Ord_Conf.controller.Log",{onInit:function(){this.getOwnerComponent().getRouter().getRoute("RLog").attachPatternMatched(this.displayLog,this)},displayLog:function(){var t=sap.ui.getCore().getModel("mModel");this.getView().setModel(t)},onNavBack:function(){var t=true;this.getOwnerComponent().getRouter().navTo("RouteFileUpload",{},t)}})});
},
	"Prod_Ord_Conf/Production_Ord_Conf/i18n/i18n.properties":'title=Production Order Confirmation Upload\nappTitle=Upload Production Order Confirmation\nappDescription=App Description',
	"Prod_Ord_Conf/Production_Ord_Conf/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"Prod_Ord_Conf.Production_Ord_Conf","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"ui5template.basicSAPUI5ApplicationProject","version":"1.40.12"},"dataSources":{"PDSRC":{"uri":"/destinations/S4HC/sap/opu/odata/sap/API_PROD_ORDER_CONFIRMATION_2_SRV/","type":"OData","settings":{"odataVersion":"2.0"}},"PSDSRC":{"uri":"/destinations/S4HC/sap/opu/odata/sap/YY1_PROD_ORD_COMP_STOCK_CDS/","type":"OData","settings":{"odataVersion":"2.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"Prod_Ord_Conf.Production_Ord_Conf.view.FileUpload","type":"XML","async":true,"id":"FileUpload"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"Prod_Ord_Conf.Production_Ord_Conf.i18n.i18n"}},"PORD":{"dataSource":"PDSRC"},"PORDSTOCK":{"dataSource":"PSDSRC"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"Prod_Ord_Conf.Production_Ord_Conf.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteFileUpload","pattern":"RouteFileUpload","target":["TargetFileUpload"]},{"name":"RLog","pattern":"RLog","target":"Log"}],"targets":{"TargetFileUpload":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"FileUpload","viewName":"FileUpload","viewLevel":1},"Log":{"viewType":"XML","viewId":"vLog","viewName":"Log","viewLevel":2}}}},"sap.platform.hcp":{"uri":"webapp","_version":"1.1.0"}}',
	"Prod_Ord_Conf/Production_Ord_Conf/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"Prod_Ord_Conf/Production_Ord_Conf/view/FileUpload.view.xml":'<mvc:View controllerName="Prod_Ord_Conf.Production_Ord_Conf.controller.FileUpload" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n\txmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:u="sap.ui.unified"\n\txmlns:c="sap.ui.core"\n\txmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"><Shell id="shell"><App id="app"><pages><Page id="page" title="{i18n>title}"><content><Panel><FlexBox height="50px" alignItems="Center" justifyContent="Center"><items><Text text="Upload File" width="5rem"></Text><l:HorizontalLayout><u:FileUploader width="16rem" id="fileUploader" name="myFileUpload" uploadUrl="upload/" tooltip="Upload your file to the local server"\n\t\t\t\t\t\t\t\t\t\t\tuploadComplete="handleUploadComplete"/><ToolbarSpacer/><Button width="5rem" id="tUpload" icon="sap-icon://upload" press="handleUploadPress" type="Emphasized"/><Button width="5rem" id="cUpload" icon="sap-icon://upload-to-cloud" press="checkProdOrdConf" type="Emphasized"/><Button width="5rem" id="rclear" icon="sap-icon://refresh" press="handleRefresh" type="Emphasized"/></l:HorizontalLayout></items></FlexBox></Panel><Table id="prodTable" items="{ path: \'/prec\'}" growing="true"><headerToolbar><Toolbar><Title text="Production Order Data" level="H2"/></Toolbar></headerToolbar><columns><Column width="5rem"><Text text="Prodcution Order"/></Column><Column width="5rem"><Text text="Order Operation"/></Column><Column width="3rem"><Text text="Yield"/></Column><Column width="6rem"><Text text="ConfirmationText"/></Column><Column width="6rem"><Text text="Exec Start Date"/></Column><Column width="6rem"><Text text="Exec Start Time"/></Column><Column width="6rem"><Text text="Exec End Date"/></Column><Column width="6rem"><Text text="Exec End Time"/></Column><Column width="6rem"><Text text="Posting Date"/></Column><Column width="3rem"><Text text="Break Time"/></Column><Column width="6rem"><Text text="Personal Number"/></Column></columns><items><ColumnListItem><cells><Text text="{OrdNo}"/><Text text="{OpNo}"/><Text text="{Quan}"/><Text text="{CTEXT}"/><Text text="{ValidF}" ><customData><c:CustomData key="color" value="{SDColorCode}" writeToDom="true"/></customData></Text><Text text="{ValidFT}"><customData><c:CustomData key="color" value="{FTColorCode}" writeToDom="true"/></customData></Text><Text text="{ValidFE}"><customData><c:CustomData key="color" value="{EDColorCode}" writeToDom="true"/></customData></Text><Text text="{ValidFET}"><customData><c:CustomData key="color" value="{FETColorCode}" writeToDom="true"/></customData></Text><Text text="{PDATE}"/><Text text="{BT}"><customData><c:CustomData key="color" value="{BTColorCode}" writeToDom="true"/></customData></Text><Text text="{PNO}"/></cells></ColumnListItem></items></Table></content><footer><OverflowToolbar id="oToolBar"></OverflowToolbar></footer></Page></pages></App></Shell></mvc:View>',
	"Prod_Ord_Conf/Production_Ord_Conf/view/Log.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\n\tcontrollerName="Prod_Ord_Conf.Production_Ord_Conf.controller.Log" xmlns:html="http://www.w3.org/1999/xhtml"\n\tid="vLog"><Page navButtonPress="onNavBack"\n\t      showNavButton="true"><Table id="msgTable" items="{ path: \'/msgs\'}" growing="true"><headerToolbar><Toolbar><Title text="Log- Upload Prodction Order Confirmation" level="H2"/></Toolbar></headerToolbar><columns><Column width="1rem"><Text text="Message Type"/></Column><Column width="12rem"><Text text="Message"/></Column></columns><items><ColumnListItem><cells><Text text="{Mtype}"/><Text text="{Msg}"/></cells></ColumnListItem></items></Table></Page></mvc:View>'
}});
