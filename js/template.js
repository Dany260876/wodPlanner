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
				if (objectList!=null) {
					var pos = html.indexOf("[[");
					if (pos>=0) {
						var subHtml = html.substring(pos+2);
						pos = subHtml.indexOf("]]");
						subHtml = subHtml.substring(0, pos);
						html = html.replace(subHtml, "");
						var resultHtml = templateHelper.BuildHtmlFromObjects(subHtml, objectList, true);
						html = html.replace("[[]]", resultHtml);	
					}
					else {
						html = templateHelper.BuildHtmlFromObjects(html, objectList, false);
					}
				}
				result.resolve(html);
			});
		return result.promise();
	},
	// Build html from objects props
	BuildHtmlFromObjects: (html, objectList, concat) => {
		var resultHtml = "";
		var tempHtml = html;
		for (n=0;n<objectList.length;n++) {
			var props = Object.getOwnPropertyNames(objectList[n]);
			for (i=0; i<props.length; i++) {
				var replaceString = "[" + objectList[n].tagName + "." + props[i]+ "]";
				var value = objectList[n][props[i]];
				tempHtml = tempHtml.replace(replaceString, value);
			}
			if (concat) {
				resultHtml = resultHtml + tempHtml;
				tempHtml = html;
			}
			else
				resultHtml = tempHtml;
		}
		return resultHtml;
	}
};
