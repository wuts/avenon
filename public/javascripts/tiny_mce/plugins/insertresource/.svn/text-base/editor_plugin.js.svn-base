/**
 * $RCSfile: editor_plugin_src.js,v $
 * $Revision: 1.12 $
 * $Date: 2006/02/22 20:06:23 $
 *
 * @author Moxiecode
 * @copyright Copyright ?2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('insertresource', 'en,tr,he,nb,ru,ru_KOI8-R,ru_UTF-8,nn,fi,cy,es,is,pl'); // <- Add a comma separated list of all supported languages

// Singleton class
var TinyMCE_insertresourcePlugin = {
	getInfo : function() {
		return {
			longname : 'insertresource plugin',
			author : 'Mark Wu',
			authorurl : 'http://blog.markplace.net',
			infourl : 'http://blog.markplace.net',
			version : "1.0"
		};
	},

	initInstance : function(inst) {
		tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/insertresource/css/content.css");		
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "insertresource":
				return tinyMCE.getButtonHTML(cn, 'lang_insertresource_desc', '{$pluginurl}/images/insertresource.gif', 'mceinsertresource', true);
		}

		return "";
	},

	/**
	 * Executes a specific command, this function handles plugin commands.
	 *
	 * @param {string} editor_id TinyMCE editor instance id that issued the command.
	 * @param {HTMLElement} element Body or root element for the editor instance.
	 * @param {string} command Command name to be executed.
	 * @param {string} user_interface True/false if a user interface should be presented.
	 * @param {mixed} value Custom value argument, can be anything.
	 * @return true/false if the command was executed by this plugin or not.
	 * @type
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			// Remember to have the "mce" prefix for commands so they don't intersect with built in ones in the browser.
			case "mceinsertresource":
				// Show UI/Popup
				if (user_interface) {
					// Open a popup window and send in some custom data in a window argument
					var insertresource = new Array();

					insertresource['file'] = '../../../../admin.php?op=resourceList&mode=1'; // Relative to theme
					insertresource['width'] = 500;
					insertresource['height'] = 450;

					tinyMCE.openWindow(insertresource, {editor_id : editor_id, resizable : "yes", scrollbars : "yes"});

					// Let TinyMCE know that something was modified
					tinyMCE.triggerNodeChange(false);
				} else {
					// Do a command this gets called from the insertresource popup
					alert("execCommand: mceinsertresource gets called from popup.");
				}

				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	cleanup : function(type, content) {
		switch (type) {
			case "insert_to_editor_dom":
				// Force relative/absolute
				if (tinyMCE.getParam('convert_urls')) {
					var imgs = content.getElementsByTagName("img");
					for (var i=0; i<imgs.length; i++) {
						if (tinyMCE.getAttrib(imgs[i], "class") == "ltFlashPlayer") {
							var src = tinyMCE.getAttrib(imgs[i], "alt");

							if (tinyMCE.getParam('convert_urls'))
								src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

							imgs[i].setAttribute('alt', src);
							imgs[i].setAttribute('title', src);
						}
					}
				}
				break;

			case "get_from_editor_dom":
				var imgs = content.getElementsByTagName("img");
				for (var i=0; i<imgs.length; i++) {
						if (tinyMCE.getAttrib(imgs[i], "class")== "ltFlashPlayer") {
							var src = tinyMCE.getAttrib(imgs[i], "alt");

							if (tinyMCE.getParam('convert_urls'))
								src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

								imgs[i].setAttribute('alt', src);
								imgs[i].setAttribute('title', src);
					}
				}
				break;

			case "insert_to_editor":
				var startPos = 0;
				var embedList = new Array();			

				// Fix the embed and object elements
				content = content.replace(new RegExp('<[ ]*object','gi'),'<object');
				content = content.replace(new RegExp('<[ ]*/object[ ]*>','gi'),'</object>');			
				
				// Parse all object tags and replace them with images from the embed data
				var index = 0;
				while ((startPos = content.indexOf('<object', startPos)) != -1) {

					// Find end of object
					endPos = content.indexOf('</object>', startPos);
					endPos += 9;
					
					objectTag = content.substring(startPos,endPos);
					
					/**
					 * NOTE: this method call relies in a bug of the _parseAttributes method.
					 * This method parses a tag and returns a list of its attributes. It works fine
					 * when presented with a single tag but now that we're passing a whole <object>...</object>
					 * block, it will also parse any other tags in the block. This means that it will return the
					 * value we're looking for as long as "FlashVars" is passed as the last parameter
					 * in the <object> block.
					 */
					attribs = TinyMCE_insertresourcePlugin._parseAttributes( objectTag );
					
					var cssClass = "";					
					if( attribs["value"] == undefined || attribs["class"] != "ltPlayer" ) {
						startPos++;
						continue;
					}
					
					// find the value in "file=XXX"
					var regexp = /.*file=([a-zA-Z0-9\-\/:._]*)/i;
					result = regexp.exec( attribs["value"] );
					var fileUrl = "";
					if( result ) {
						fileUrl = result[1];
					}			
					//window.alert("val = " + attribs["value"] + " - " + fileUrl);		
					
					// default values for height and width in case they were not defined (for some reason)
					if( attribs["height"] == undefined )
						attribs["height"] = 20;
					if( attribs["width"] == undefined )
						attribs["width"] = 320;
					// Insert image						
					var contentAfter = content.substring(endPos);
					content = content.substring(0, startPos);
					content += '<img width="' + attribs["width"] + '" height="' + attribs["height"] + '"';
					content += ' src="' + (tinyMCE.getParam("theme_href") + '/images/spacer.gif') + '" title="' + fileUrl + '"';
					content += ' alt="' + fileUrl + '" class="ltFlashPlayer" />' + content.substring(endPos);
					content += contentAfter;
					
					index++;

					startPos++;
				}
				
				break;

			case "get_from_editor":
				// Parse all img tags and replace them with object+embed
				var startPos = -1;

				while ((startPos = content.indexOf('<img', startPos+1)) != -1) {
					var endPos = content.indexOf('/>', startPos);
					var attribs = TinyMCE_insertresourcePlugin._parseAttributes(content.substring(startPos + 4, endPos));

					// If not flash, skip it
					if (attribs['class'] != "ltFlashPlayer" )
						continue;					

					type = attribs['class'];

					endPos += 2;

					var embedHTML = '';
					
					if( attribs["height"] == undefined )
						attribs["height"] = 20;
					if( attribs["width"] == undefined )
						attribs["width"] = 320;			
						
					embedHTML = Lifetype.Media.getFlashPlayerHTML( attribs["alt"], attribs["height"], attribs["width"] );

					// Insert embed/object chunk
					chunkBefore = content.substring(0, startPos);
					chunkAfter = content.substring(endPos);
					content = chunkBefore + embedHTML + chunkAfter;
				}
				break;
		}

		// Pass through to next handler in chain
		return content;
	},

	// Private plugin internal functions

	_parseAttributes : function(attribute_string) {
		var attributeName = "";
		var attributeValue = "";
		var withInName;
		var withInValue;
		var attributes = new Array();
		var whiteSpaceRegExp = new RegExp('^[ \n\r\t]+', 'g');

		if (attribute_string == null || attribute_string.length < 2)
			return null;

		withInName = withInValue = false;

		for (var i=0; i<attribute_string.length; i++) {
			var chr = attribute_string.charAt(i);

			if ((chr == '"' ) && !withInValue)
				withInValue = true;
			else if ((chr == '"' ) && withInValue) {
				withInValue = false;

				var pos = attributeName.lastIndexOf(' ');
				if (pos != -1)
					attributeName = attributeName.substring(pos+1);

				attributes[attributeName.toLowerCase()] = attributeValue.substring(1);

				attributeName = "";
				attributeValue = "";
			} else if (!whiteSpaceRegExp.test(chr) && !withInName && !withInValue)
				withInName = true;

			if (chr == '=' && withInName)
				withInName = false;

			if (withInName)
				attributeName += chr;

			if (withInValue)
				attributeValue += chr;
		}

		return attributes;
	}
};

tinyMCE.addPlugin("insertresource", TinyMCE_insertresourcePlugin);