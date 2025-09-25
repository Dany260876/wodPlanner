class injectableObject {
	get tagName() { 
		return "object"; 
	}
}

var templateHelper = {
	// Get template raw content by name
	byName: (name) => {
		var result = $.Deferred();
		var templateFile = "html/" + name + ".html";
		$.get(templateFile, function(data) {
		  result.resolve(data);
		}).fail(function() {
		    result.reject(null);
		});
		return result.promise();
	},
	// Build template content by template and object
	buildTemplate: (templateName, objectList) => {	
		var result = $.Deferred();
		templateHelper.byName(templateName)
			.done(function(data) {
				if (data==null) result.reject(null);
				var html = data;
				
				// replace objects properties
				if (objectList!=null) {
					var pos = html.indexOf("[[");
					if (pos>=0) {
						var subHtml = html.substring(pos+2);
						pos = subHtml.indexOf("]]");
						subHtml = subHtml.substring(0, pos);
						html = html.replace(subHtml, "");
						var resultHtml = templateHelper.buildHtmlFromObjects(subHtml, objectList, true);
						html = html.replace("[[]]", resultHtml);	
					}
					else {
						html = templateHelper.buildHtmlFromObjects(html, objectList, false);
					}
				}
				
				// execute methods contents ([{}])
				html = templateHelper.executeMethodsContent(html);
				
				result.resolve(html);
			});
		return result.promise();
	},
	// Build html from objects props
	buildHtmlFromObjects: (html, objectList, concat) => {
		var resultHtml = "";
		var tempHtml = html;
		for (n=0;n<objectList.length;n++) {
			
			// Replace values with object properties
			var props = Object.getOwnPropertyNames(objectList[n]);
			for (i=0; i<props.length; i++) {
				var replaceString = "[" + objectList[n].tagName + "." + props[i] + "]";
				var value = objectList[n][props[i]];
				tempHtml = tempHtml.replaceAll(replaceString, value);
			}
			
			// Replace methods with object method calls values (no parameters)
			let iPosEnd = tempHtml.indexOf('()]');
			while (iPosEnd>0) {
				let iPosStart = iPosEnd;
				let found = false;
				while(iPosStart>0 && !found) {
					if (tempHtml[iPosStart]=='[') 
						found = true;
					else
						iPosStart--;
				}
				if (iPosStart>0) {
					let objectMethod = tempHtml.substr(iPosStart+1, iPosEnd-iPosStart-1);
					let arrayMethod = objectMethod.split('.');
					let methodName = '';
					if (arrayMethod.length==1) methodName = arrayMethod[0];
					if (arrayMethod.length==2) methodName = arrayMethod[1];
					let returnValue = objectList[n][methodName]();
					tempHtml = tempHtml.replaceAll('[' + objectMethod + '()]', returnValue);
				}
				else {
					tempHtml = tempHtml.replace('()]', '');
				}
				iPosEnd = tempHtml.indexOf('()]');
			}

			// Concat final result
			if (concat) {
				resultHtml = resultHtml + tempHtml;
				tempHtml = html;
			}
			else
				resultHtml = tempHtml;
		}
		return resultHtml;
	},
	executeMethodsContent:(html) => {
		var iPosFuncStart = html.indexOf('[{');
		while(iPosFuncStart>-1) {
			// Get function name & params
			var funcName = html.substring(iPosFuncStart+2);
			var iPosFuncEnd = funcName.indexOf('}]');
			funcName = funcName.substring(0, iPosFuncEnd);
			var iPosParamStart = funcName.indexOf('(');
			var paramName = funcName.substring(iPosParamStart+1);
			var iPosParamEnd = paramName.indexOf(')');
			paramName = paramName.substring(0, iPosParamEnd);
			funcName = funcName.substring(0, iPosParamStart);
			
			// execute function
			var arrayFuncName = funcName.split('.');
			var resultHtml = '';
			if (arrayFuncName.length==1) resultHtml = window[arrayFuncName[0]](paramName);
			if (arrayFuncName.length==2) resultHtml = window[arrayFuncName[0]][arrayFuncName[1]](paramName);
	
			// replace content with result value
			html = html.replace("[{" + funcName + '(' + paramName + ')}]', resultHtml);
	
			// try again
			iPosFuncStart = html.indexOf('[{');
		}
		return html;
	}
};
