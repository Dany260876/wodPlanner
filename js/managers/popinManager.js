/*
* Popin Manager : display popin
*/
var popinManager = {
	load: (type) => {
		var popinName = '';
		if (type=='OK') popinName = 'popinElementOK';
		if (type=='OKCancel') popinName = 'popinElementOKCancel';		
		return pageManager.renderElement(popinName, null, 'divPopin');
	},
	hide: () => {
		$("#divPopin").hide();
		$(".tblContent").show();
	},
	show: () => {
		$("#divPopin").show();
        $(".tblContent").hide();
	},
	validate: () => {
		// get keys & values and build result
		var keyObj = $('.keyForm');
		var valueObj = $('.valueForm');
		var result = "";
		for (i=0;i<keyObj.length;i++) {
			if (result!='') result += "|";
			result += $(keyObj[i]).attr('field') + "=" + $(valueObj[i]).val();
		}
		// Call callback function
		var callbackFunc = sessionStorage.getItem('popinCallbackFunction');
		if (callbackFunc && callbackFunc!='') {
			callbackFunc = callbackFunc.replace('(','').replace(')','');
			var arrayCF = callbackFunc.split('.');
			if (arrayCF.length==2) window[arrayCF[0]][arrayCF[1]](result);
			if (arrayCF.length==1) window[arrayCF[0]](result);
		}
		// reset callback function
		popinManager.setCallbackFunction('');
		// hide popin
		popinManager.hide();
	},
	setCallbackFunction: (funcName) => {
		sessionStorage.setItem('popinCallbackFunction', funcName);
	},
	showConfirmation: (text) => {
		var params = [];
		params.push({
			'tagName':'object',
			'text':text
		});
		pageManager.renderElement('popinYesNo', params, 'divPopin').done(() => {
		});
	},
	validateYesNo: () => {
		// Call callback function
		var callbackFunc = sessionStorage.getItem('popinCallbackFunction');
		if (callbackFunc && callbackFunc!='') {
			var iPos = callbackFunc.indexOf('(');
			var params = callbackFunc.substr(iPos);
			params = params.replace('(','').replace(')','');
			callbackFunc = callbackFunc.substr(0, iPos);
			var arrayCF = callbackFunc.split('.');
			if (arrayCF.length==2) window[arrayCF[0]][arrayCF[1]](params);
			if (arrayCF.length==1) window[arrayCF[0]](result);
		}
		// reset callback function
		popinManager.setCallbackFunction('');
		// hide popin
		popinManager.hide();
	},
};