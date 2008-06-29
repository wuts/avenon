/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('more');

var TinyMCE_MorePlugin = {
	getInfo : function() {
		return {
			longname : 'More',
			author : 'Jon Daley (based on the WordPress plugin with the same name)',
			authorurl : 'http://jon.limedaley.com',
			infourl : 'N/A',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

    initInstance : function(inst) {
        if (!tinyMCE.settings['more_skip_plugin_css']){
            tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL +  
                              "/plugins/more/more.css");
        }
    },

    getControlHTML : function(control_name) {
        switch (control_name) {
            case "more":
              return tinyMCE.getButtonHTML(control_name, 
                                         'lang_more_more_button', 
                                         '{$pluginurl}/images/more.gif', 
                                         'mcemoremore');
        }

        return '';
    },

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

                attributes[attributeName.toLowerCase()] = 
                    attributeValue.substring(1).toLowerCase();

                attributeName = "";
                attributeValue = "";
            } else if (!whiteSpaceRegExp.test(chr) && 
                       !withInName && !withInValue)
                withInName = true;

            if (chr == '=' && withInName)
                withInName = false;

            if (withInName)
                attributeName += chr;

            if (withInValue)
                attributeValue += chr;
        }

        return attributes;
    },

    _getMoreTag : function(){ 
       return "[@more@]";
    },

    execCommand : function(editor_id, element, command, user_interface, value){
            // Handle commands
        switch (command) {
          case "mcemoremore":
            var content = tinyMCE.getContent(editor_id);
            var bFound = 0;
			var startPos = 0;
              // Parse all img tags and remove any 'more' tags
			while((startPos = content.indexOf(this._getMoreTag(),
                                              startPos)) != -1)
            {
              var contentAfter = content.substring(startPos + 
                                                   this._getMoreTag().length);
              content = content.substring(0, startPos) + contentAfter;
              startPos++;
              bFound = 1;
			}

            if(bFound){
              tinyMCE.execCommand("mceSetContent", true, content);
              tinyMCE.switchClass(editor_id + '_more', 'mceButtonNormal');
            }
            else{
              var altMore = tinyMCE.getLang('lang_more_more_alt');
              html = '<img src="'
                     + (tinyMCE.getParam("theme_href")
                     + "/images/spacer.gif") + '" '
                     + ' width="100%" height="10px" '
                     + 'alt="'+altMore+'" title="'+altMore+'" '
                     + 'class="mce_plugin_more_more" '
                     + 'name="mce_plugin_more_more" />';
              tinyMCE.execCommand("mceInsertRawHTML", false, html);
              tinyMCE.switchClass(editor_id + '_more', 
                                  'mceButtonSelected');
           }

           tinyMCE.selectedInstance.repaint();
           return true;
        }

            // Pass to next handler in chain
        return false;
    },

    cleanup : function(type, content) {
        var bFound = 0;

        switch (type) {
                // move from html editor to wysiwyg editor
          case "insert_to_editor":
			var startPos = 0;
			var altMore = tinyMCE.getLang('lang_more_more_alt');

                // Parse all tags and replace them with images
			while((startPos=content.indexOf(this._getMoreTag(),startPos)) != -1)
            {
              var contentAfter = content.substring(startPos + 
                                                   this._getMoreTag().length);
              content = content.substring(0, startPos);
              if(!bFound){
                    // Insert image
				content += '<img src="' + (tinyMCE.getParam("theme_href") + 
                                           "/images/spacer.gif") + '" ';
				content += ' width="100%" height="10px" ';
				content += 'alt="'+altMore+'" title="'+altMore+'" ';
                content += 'class="mce_plugin_more_more" />';
              }
              content += contentAfter;
              startPos++;
              bFound = 1;
			}
			break;

                // move from wysiwyg editor to html editor
          case "get_from_editor":
              // Parse all img tags and replace the
              // first "more" image with tag
            var startPos = -1;
            while((startPos = content.indexOf('<img', startPos+1)) != -1)
            {
				var endPos = content.indexOf('/>', startPos);
				var attribs = this._parseAttributes(
                    content.substring(startPos + 4, endPos));

				if (attribs['class'] == "mce_plugin_more_more") {
                    endPos += 2;
	
                        // Insert embed/object chunk
					chunkBefore = content.substring(0, startPos);
					chunkAfter = content.substring(endPos);

                    content = chunkBefore;
					if(!bFound)
                      content += this._getMoreTag();
                    content += chunkAfter;
                    bFound = 1;
				}
			}
			break;
        }

            // Pass through to next handler in chain
        return content;
    }
};

tinyMCE.addPlugin("more", TinyMCE_MorePlugin);
