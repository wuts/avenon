function init() {
	tinyMCEPopup.resizeToInnerSize();
}

function isValidUrl( url )
{
	var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);
}

function insertAudioCode()
{
	// get and check the URL
	urlField = document.forms[0].url;
	url = urlField.value;
	if( url == "" || !isValidUrl( url )) {
		window.alert( tinyMCE.getLang('lang_insertvideo_badurl', 0) );
		return( false );
	}

	css="ltFlashPlayer";
	width=320;
	height=20;
	
	insertFlash( url, css, width, height );
}

function insertFlash( file, css, width, height ) {

	var html      = '';

	html += ''
		+ '<img src="' + (tinyMCE.getParam("theme_href") + "/images/spacer.gif") + '" mce_src="' + (tinyMCE.getParam("theme_href") + "/images/spacer.gif") + '" '
		+ 'width="' + width + '" height="' + height + '" '
		+ 'border="0" alt="' + file + '" title="' + file + '" class="'+css+'" />';

	tinyMCEPopup.execCommand("mceInsertContent", true, html);
	tinyMCE.selectedInstance.repaint();

	tinyMCEPopup.close();
}