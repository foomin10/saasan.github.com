var Storage=function(a,c){if("undefined"===typeof localStorage)throw Error("Web Storage is not available");0===arguments.length&&(a=!0);if(2>arguments.length||"string"!==typeof c)c="";this._storage=a?localStorage:sessionStorage;this._namespace=c+"_"};
Storage.prototype={_namespace:"",get:function(a,c,b){1==arguments.length&&(c=null);var d=this._storage.getItem(this._namespace+a);return null!==d?2<arguments.length&&"function"===typeof b?JSON.parse(d,b):JSON.parse(d):c},set:function(a,c){var b=JSON.stringify(c);this._storage.setItem(this._namespace+a,b)},remove:function(a){this._storage.removeItem(this._namespace+a)},getRawData:function(a){return this._storage.getItem(this._namespace+a)},setRawData:function(a,c){JSON.parse(c);this._storage.setItem(this._namespace+
a,c)}};var Config=function(a,c,b,d){for(var e in this)this._initialKeys[e]=!0;1<=arguments.length&&(this._defaultValues=this._cloneObject(a),this._importValues(a));this._storage=new Storage(!0,c);3<=arguments.length&&(this.storageKey=b);4<=arguments.length&&(this._reviver=d)};
Config.prototype={_storage:null,_reviver:null,_initialKeys:{},_defaultValues:{},_copyConfigValues:function(a,c){for(var b in a)if("undefined"===typeof this._initialKeys[b])if(a[b]instanceof Date)c[b]=new Date,c[b].setTime(a[b].getTime());else if(a[b]instanceof Array){c[b]=[];for(var d=0;d<a[b].length;d++)c[b][d]=this._cloneObject(a[b][d])}else c[b]=a[b]&&"object"===typeof a[b]?this._cloneObject(a[b]):a[b]},_importValues:function(a){for(var c in this._initialKeys)if("undefined"!==typeof a[c])throw Error("The key name already exists : "+
c);this._copyConfigValues(a,this)},_cloneObject:function(a){var c={},b;for(b in a)if(a[b]instanceof Date)c[b]=new Date,c[b].setTime(a[b].getTime());else if(a[b]instanceof Array){c[b]=[];for(var d=0;d<a[b].length;d++)c[b][d]=this._cloneObject(a[b][d])}else c[b]=a[b]&&"object"===typeof a[b]?this._cloneObject(a[b]):a[b];return c},storageKey:"config",clear:function(){for(var a in this)this._initialKeys[a]||delete this[a]},reset:function(){this.clear();this._importValues(this._defaultValues)},save:function(){var a=
{};this._copyConfigValues(this,a);this._storage.set(this.storageKey,a)},load:function(a){var c=this._storage.get(this.storageKey,{},this._reviver);a&&this.clear();this._importValues(c)},getRawData:function(){return this._storage.getRawData(this.storageKey)},setRawData:function(a){this._storage.setRawData(this.storageKey,a)}};var Toast=function(){};
Toast.prototype={_id:null,show:function(a,c,b){var d=this;if($("#alertContainer").is(":hidden")||null===this._id){$("#alertText").text(a);var e=$("#alert");e.removeClass("alert-success alert-error alert-danger alert-info");1<arguments.length&&e.addClass(c);$("#alertContainer").show();2<arguments.length&&"number"===typeof b&&(this._id=setTimeout(function(){$("#alertContainer").hide();d._id=null},b))}else $("#alertContainer").hide(),clearTimeout(this._id),this._id=setTimeout(function(){d.show(a,c,b)},
300)}};var MobamasDojo=function(){};
MobamasDojo.prototype={_RESET_HOUR:5,_RESET_MINUTE:0,_TOAST_TIME:3E3,_toast:null,_config:null,_dateReviver:function(a,c){var b;return"lastTime"===a&&"string"===typeof c&&(b=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(c))?new Date(Date.UTC(+b[1],+b[2]-1,+b[3],+b[4],+b[5],+b[6])):c},init:function(){this._toast=new Toast;this._config=new Config({visited:{},hide:{},sameTab:!1,visitedMax:1,autoHide:!1,keepLastVisited:!1,lastVisited:null,infoClosed:!1,lastTime:new Date},"mobamas-dojo",
"config",this._dateReviver);this._config.load();var a=new Date,c=this.getResetTime(),b=new Date(a.getTime());b.setDate(b.getDate()-1);c=this._config.lastTime<c&&c<=a;if(this._config.lastTime<b||c)this._config.visited={};this._config.lastTime=a;this.updateUI();this._config.save()},onclickDojoLink:function(a){a=a.attr("id");var c=this._config.lastVisited;"undefined"===typeof this._config.visited[a]?this._config.visited[a]=1:this._config.visited[a]++;this._config.lastVisited=a;this._config.keepLastVisited&&
null!==c&&c!==a&&this.updateButtonState(c);this._config.save();this.updateButtonState(a)},onclickHideDojo:function(a){a=a.data("id");this._config.hide[a]=!0;this._config.save();this.updateButtonState(a)},onclickConfigOK:function(a){this._config.sameTab=$("#sameTab").is(":checked");this._config.visitedMax=$("#visitedMax").val();this._config.autoHide=$("#autoHide").is(":checked");this._config.keepLastVisited=$("#keepLastVisited").is(":checked");this._config.save();this.updateUI();$("#sectionConfig").hide();
this._toast.show("\u8a2d\u5b9a\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002","alert-success",this._TOAST_TIME)},onclickConfigResetVisited:function(a){this._config.visited={};this._config.lastVisited=null;this._config.save();this.updateUI();this._toast.show("\u8a2a\u554f\u56de\u6570\u3092\u521d\u671f\u5316\u3057\u307e\u3057\u305f\u3002","alert-success",this._TOAST_TIME)},onclickConfigResetHide:function(a){this._config.hide={};this._config.save();this.updateUI();this._toast.show("\u9053\u5834\u306e\u975e\u8868\u793a\u8a2d\u5b9a\u3092\u521d\u671f\u5316\u3057\u307e\u3057\u305f\u3002",
"alert-success",this._TOAST_TIME)},onclickConfigReset:function(a){this._config.reset();this._config.save();this.updateUI();this._toast.show("\u5168\u3066\u306e\u8a2d\u5b9a\u3092\u521d\u671f\u5316\u3057\u307e\u3057\u305f\u3002","alert-success",this._TOAST_TIME)},onclickCloseInfo:function(){this._config.infoClosed=!0;this._config.save();$("#info").hide()},onclickCloseAlert:function(){$("#alertContainer").hide()},onclickOpenConfig:function(){this.updateConfigUI();$("#sectionConfig").show()},onclickDataInput:function(){try{this._config.setRawData($("#dataOutput").val())}catch(a){this._toast.show(a.message,
"alert-error");return}this._config.load();this.updateUI();this._toast.show("\u30c7\u30fc\u30bf\u3092\u5165\u529b\u3057\u307e\u3057\u305f\u3002","alert-success",this._TOAST_TIME)},getResetTime:function(){var a=new Date;a.setHours(this._RESET_HOUR);a.setMinutes(this._RESET_MINUTE);a.setSeconds(0);a.setMilliseconds(0);return a},updateButtonState:function(a){var c=this._config.visitedMax,b=this._config.visited[a],d={1:["btn-primary","btn-danger"],3:["btn-primary","btn-success","btn-warning","btn-danger"]};
b>c&&(b=c);var e=this._config.autoHide&&b>=c,f=this._config.autoHide&&this._config.keepLastVisited&&this._config.lastVisited===a;this._config.hide[a]||e&&!f?$("#d"+a).hide():($("#"+a).removeClass("btn-primary btn-success btn-warning btn-danger").addClass(d[c][b]),$("#h"+a).removeClass("btn-primary btn-success btn-warning btn-danger").addClass(d[c][b]),$("#d"+a).show())},updateButtonStateAll:function(){var a,c,b=["btn-success","btn-warning","btn-danger"];for(a=0;a<b.length;a++)$("a."+b[a]).removeClass(b[a]).addClass("btn-primary"),
$("button."+b[a]).removeClass(b[a]).addClass("btn-primary");for(c in this._config.visited)this.updateButtonState(c);for(c in this._config.hide)this.updateButtonState(c)},updateConfigUI:function(){$("#sameTab").prop("checked",this._config.sameTab);$("#visitedMax").val(this._config.visitedMax);$("#autoHide").prop("checked",this._config.autoHide);$("#keepLastVisited").prop("checked",this._config.keepLastVisited);$("#dataOutput").val(this._config.getRawData())},updateUI:function(){$("div.dojo").show();
this.updateButtonStateAll();this._config.sameTab?$("a[target].dojo-link").removeAttr("target"):$("a:not([target]).dojo-link").attr("target","_blank");this.updateConfigUI();this._config.infoClosed?$("#info").hide():$("#info").show()}};$(function(){try{var a=new MobamasDojo;$("a.dojo-link").click(function(){a.onclickDojoLink($(this))});$("button.hide-dojo").click(function(){a.onclickHideDojo($(this))});$("#configOK").click(function(){a.onclickConfigOK($(this))});$("#configResetVisited").click(function(){a.onclickConfigResetVisited($(this))});$("#configResetHide").click(function(){a.onclickConfigResetHide($(this))});$("#configReset").click(function(){a.onclickConfigReset($(this))});$("#closeInfo").click(function(){a.onclickCloseInfo()});
$("#closeAlert").click(function(){a.onclickCloseAlert()});$("#openConfig").click(function(){a.onclickOpenConfig()});$("#closeConfig").click(function(){$("#sectionConfig").hide()});$("#configCancel").click(function(){$("#sectionConfig").hide()});$("#dataInput").click(function(){a.onclickDataInput()});a.init()}catch(c){$("#alertText").text(c.message),$("#alert").removeClass("alert-success alert-danger alert-info").addClass("alert-error"),$("#alertContainer").show()}});
