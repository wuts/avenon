/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('insertvideo', 'en,fr'); // <- Add a comma separated list of all supported languages

// Singleton class
var TinyMCE_insertvideoPlugin = {
	getInfo : function() {
		return {
			longname : 'insertvideo plugin',
			author : 'The LifeType Project',
			authorurl : 'http://www.lifetype.net',
			infourl : 'http://www.lifetype.net',
			version : "1.1"
		};
	},

	initInstance : function(inst) {
		tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/insertvideo/css/content.css");	
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "insertvideo":
				return tinyMCE.getButtonHTML(cn, 'lang_insertvideo_desc', '{$pluginurl}/images/youtube.png', 'mceinsertvideo', true);
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
			case "mceinsertvideo":
				// Show UI/Popup
				if (user_interface) {
					// Open a popup window and send in some custom data in a window argument
					var insertvideo = new Array();

					insertvideo['file'] = '../../plugins/insertvideo/videoinput.html'; // Relative to theme
					insertvideo['width'] = 500;
					insertvideo['height'] = 260;

					tinyMCE.openWindow(insertvideo, {editor_id : editor_id, resizable : "no", scrollbars : "no", inline : "yes"});
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
						//if (tinyMCE.getAttrib(imgs[i], "class")== "ltVideoYouTube") {
						if (tinyMCE.getAttrib(imgs[i], "class").substr(0,6) == "ltVideo") {							
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
					if (tinyMCE.getAttrib(imgs[i], "class").substr(0,6) == "ltVideo") {
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
					attribs = TinyMCE_insertvideoPlugin._parseAttributes( objectTag );
					
					var cssClass = "";					
					if( attribs["data"] == undefined ) {
						startPos++;
						continue;
					}
					else {
						var videoType = getVideoType( attribs["data"] );
						if( videoType == 1 ) {
							cssClass = "ltVideoGoogleVideo";
						}
						else if( videoType == 2 ) {
							cssClass = "ltVideoYouTube";
						}
						else if( videoType == 3 ) {
							cssClass = "ltVideoMetacafe";
						}
						else if( videoType == 4 ) {
							cssClass = "ltVideoIfilm";
						}
						else if( videoType == 5 ) {
							cssClass = "ltVideoGoear";
						}
						else if( videoType == 6 ) {
							cssClass = "ltVideoGrouper";
						}
						else if( videoType == 7 ) {
							cssClass = "ltVideoDailymot";
						}
						else {
							// ignore it, it's not a youtube or googlevideo video
							startPos++;
							continue;
						}
					}
					

					// Insert image
					var contentAfter = content.substring(endPos);
					content = content.substring(0, startPos);
					content += '<img width="' + attribs["width"] + '" height="' + attribs["height"] + '"';
					content += ' src="' + (tinyMCE.getParam("theme_href") + '/images/spacer.gif') + '" title="' + attribs["data"] + '"';
					content += ' alt="' + attribs["data"] + '" class="'+cssClass+'" />' + content.substring(endPos);
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
					var attribs = TinyMCE_insertvideoPlugin._parseAttributes(content.substring(startPos + 4, endPos));

					// Is not flash, skip it
					if (attribs['class'] != "ltVideoYouTube" && attribs['class'] != "ltVideoGoogleVideo" && attribs['class'] != "ltVideoMetacafe" && attribs['class'] != "ltVideoIfilm" && attribs['class'] != "ltVideoGoear" && attribs['class'] != "ltVideoGrouper" && attribs['class'] != "ltVideoDailymot")
						continue;

					type = attribs['class'];

					endPos += 2;

					var embedHTML = '';
					var wmode = tinyMCE.getParam("flash_wmode", "transparent");
					var quality = tinyMCE.getParam("flash_quality", "high");
					var menu = tinyMCE.getParam("flash_menu", "false");
					
					embedHTML = getVideoFlashHTML( attribs["title"], attribs["width"], attribs["height"] , type );

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

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		do {
			if (node.nodeName == "IMG" && tinyMCE.getAttrib(node, 'class').indexOf('ltVideo') == 0) {
				tinyMCE.switchClass(editor_id + '_flash', 'mceButtonSelected');
				return true;
			}
		} while ((node = node.parentNode));

		tinyMCE.switchClass(editor_id + '_flash', 'mceButtonNormal');

		return true;
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

			if ((chr == '"' || chr == "'") && !withInValue)
				withInValue = true;
			else if ((chr == '"' || chr == "'") && withInValue) {
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

function getVideoFlashHTML( url, width, height , type )
{
	html = "<object type=\"application/x-shockwave-flash\" width=\""+width+"\" height=\""+height+"\" data=\""+url+"\" id=\""+type+"\">"+
		"<param name=\"movie\" value=\""+url+"\" />"+
		"<param name=\"wmode\" value=\"transparent\" />"+
		"<param name=\"allowScriptAcess\" value=\"sameDomain\" />"+
		"<param name=\"quality\" value=\"best\" />"+
		"<param name=\"bgcolor\" value=\"#FFFFFF\" />";
//		"<param name=\"scale\" value=\"noScale\" />";
  if (type=='ltVideoGoear') {
		html= html + "<param name=\"FlashVars\" value=\""+url.substring( 43, url.length ) + "\" />";
	}	else {
	   html = html + "<param name=\"FlashVars\" value=\"playerMode=embedded\" />";
	}
	
	html = html + "</object>";
	
	return( html );
}

function getVideoType( url )
{
	/**
	 * this method now uses regular expressions for more precise matching, please
	 * remember to escape strings properly for their usage as regular expressions
	 * when attempting to add new sites
	 */
	var sites = {
		1: /^http:\/\/video\.google\.com\//,
		2: /^http:\/\/.{2,3}\.youtube\.com\//,
		3: /^http:\/\/www\.metacafe\.com\//,
		4: /^http:\/\/www\.ifilm\.com\//,
		5: /^http:\/\/www\.goear.com\//,
		6: /^http:\/\/www\.grouper\.com\//,
		7: /^http:\/\/www\.dailymotion\.com\//
	};

	var found = false;
	var siteId = 0;
	for( var id in sites ) {
		if( url.match( sites[id] )) {
			found = true;
			siteId = id;
			break;
		}
	}
	
	return( siteId );
}

tinyMCE.addPlugin("insertvideo", TinyMCE_insertvideoPlugin );
