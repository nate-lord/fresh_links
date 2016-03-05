if( !window.jQuery ){
	function makeScript(){
		//alert('here');
		var jQ = document.querySelectorAll( 'script' ),
		    src,
				newSrc;
		for( var i = 0, l = jQ.length; i < l; i++ ){
		  src = jQ[i].getAttribute( 'src' );
			if( src.indexOf('/fresh-links/scripts') !== -1 ){
				newSrc = '"' + src.substring(0, src.indexOf('/fresh-links/scripts') + 21) + 'jquery.min.js"';
				document.write('<script src=' + newSrc + '><\/script>');
				break;
			}
	  }
	}
	makeScript();
}
//window.jQuery || document.write('<script src="jquery.min.js"><\/script>');