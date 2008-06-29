Lifetype.UI.Pages.ResourceChooser = function() {}

/**
 * Adds some text where the cursor is.
 *
 * Works in IE and Mozilla 1.3b+
 * In other browsers, it simply adds the text at the end of the current text
 */
Lifetype.UI.Pages.ResourceChooser.addText = function( input, insText ) 
{
	input.focus();
	if( input.createTextRange ) {
		parent.opener.document.selection.createRange().text += insText;
	} 
	else if( input.setSelectionRange ) {
		var len = input.selectionEnd;
		input.value = input.value.substr( 0, len ) + insText + input.value.substr( len );
		input.setSelectionRange(len+insText.length,len+insText.length);
	} 
	else { 
		input.value += insText; 
	}
}



/*
 * Insert resource related javascript functions
 */

function _generateResourceLink( resourceId, resourceLink, targetLink, resourceName, resourceDesc, resourceType, resourceMimeType )
{
    var htmlCode = '';

    if( resourceType == 1 ) {
		if( targetLink != '' ) {
		    htmlCode = '<a id="res_'+resourceId+ '" href="'+targetLink+'" type="'+resourceMimeType+'">';
		    htmlCode += '<img style="margin: 5px;" border="0" alt="'+resourceDesc+'" src="'+resourceLink+'" />';
		    htmlCode += '</a>';
	    } 
	    else {
		    htmlCode = '<img style="margin: 5px;" alt="'+resourceDesc+'" src="'+resourceLink+'" />';
	    }
    }
    else {
	    // if not an image, there is not much we can do
	    htmlCode = '<a id="res_'+resourceId+'" title="'+resourceDesc+'" href="'+resourceLink+'" type="'+resourceMimeType+'">'+resourceName+'</a>';
    }
  
    return htmlCode;

}

function addHtmlareaLink( resourceId, resourceLink, targetLink, resourceName, resourceDesc, resourceType, resourceMimeType ) {
    var htmlCode = _generateResourceLink( resourceId, resourceLink, targetLink, resourceName, resourceDesc, resourceType, resourceMimeType );
    
    tinyMCE.execCommand("mceInsertContent",true,htmlCode);
	tinyMCE.selectedInstance.repaint();

	// Close the dialog
	tinyMCE.closeWindow(window);
};

function addResourceLink( resourceId, resourceLink, targetLink, resourceName, resourceDesc, resourceType, resourceMimeType ) 
{
    // generate the link
    var htmlCode = _generateResourceLink( resourceId, resourceLink, targetLink, resourceName, resourceDesc, resourceType, resourceMimeType );

    Lifetype.UI.Pages.ResourceChooser.addText( parent.opener.document.newPost.postText, htmlCode );
}

/*
 * Insert album related javascript functions
 */
 
function _generateAlbumLink( albumLink, albumName, albumDesc ) 
{
    var htmlCode = '';
    htmlCode = '<a title="'+albumDesc+'" href="'+albumLink+'">'+albumName+'</a>';
	
    return htmlCode;      
}

function addHtmlareaAlbumLink( albumLink, albumName, albumDesc ) 
{
    var htmlCode = _generateAlbumLink( albumLink, albumName, albumDesc );

    tinyMCE.execCommand("mceInsertContent",true,htmlCode);
	tinyMCE.selectedInstance.repaint();

	// Close the dialog
	tinyMCE.closeWindow(window);
}

function addAlbumLink( albumLink, albumName, albumDesc ) 
{
    var htmlCode = _generateAlbumLink( albumLink, albumName, albumDesc );

    Lifetype.UI.Pages.ResourceChooser.addText( parent.opener.document.newPost.postText, htmlCode );
}

function onCancel() {
	tinyMCE.closeWindow(window);
};

/**
 * Generates the correct markup code for the Flash MP3 and video player
 * depending on whether TinyMCE is enabled or not
 *
 * @param url
 * @param tinyMCE
 */
function insertMediaPlayer( url, tinyMCEEnabled, height, width )
{
	if( tinyMCEEnabled ) {
		var htmlCode = '<img src="' + (tinyMCE.getParam("theme_href") + "/images/spacer.gif") + '" mce_src="' + (tinyMCE.getParam("theme_href") + "/images/spacer.gif") + '" ' + 'width="' + width + '" height="' + height + '" ' + 'border="0" alt="' + url + '" title="' + url + '" class="ltFlashPlayer" />';

	   	tinyMCE.execCommand( "mceInsertContent", true, htmlCode );
		tinyMCE.selectedInstance.repaint();	

		// Close the dialog
		tinyMCE.closeWindow(window);
	}
	else {
		Lifetype.UI.Pages.ResourceChooser.addText( parent.opener.document.newPost.postText, Lifetype.Media.getFlashPlayerHTML( url, height, width ));
	}
}