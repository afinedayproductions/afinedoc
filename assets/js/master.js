var searchHandler = {
	
	init: function(documentXML) {

		this._input = document.querySelector('#search');
		this._input.addEventListener('keyup', this.onSearchChange.bind(this));

		// XML document loaded
		this.documentXML = documentXML;

		// init the itemHandler
		itemHandler.init();

	}, // end searchHandler.init()

	onSearchChange: function() {

		var search = this._input.value.toLowerCase();
		var cachedItemHandler = [];

		// If search is empty, we clear all articles
		if(search.length < 1) {
			viewRenderer.clearRenderer();
			return false;
		}
		
		[].forEach.call(this.documentXML.querySelectorAll('item'), function(item) {
			// current value of the input
			var itemSearch = item.attributes.search.value;

			// If the search is part of the available searches for the item
			if(itemSearch.search(search) > -1) {
				// Add it to the cached itemHandler
				cachedItemHandler.push(item);
			}
		});

		// We compare cached items & the current items
		if(!itemHandler.compareArrays(cachedItemHandler)) {

			console.log('Cached items DO NOT fit the current research');

			// We affect the cached itemHandler to the main itemHandler
			itemHandler.items = cachedItemHandler;

			// We clear all current article elements
			viewRenderer.clearRenderer();

			// We create the article element for each item
			itemHandler.items.forEach(function(item) {

				viewRenderer.createArticle(item);

			});

		} // end if cached items do not fit the current research
		else console.log('Cached items fit the current research');
		// end if chached items fit the current research


		//alert(itemHandler.items[0].attributes.search.value);


	} // end searchHandler.onSearchChange()

};
/* END SEARCHHANDLER */

var itemHandler = {

	add: function(item) {
		this.items.push(item);
	},

	clearHandler: function() {
		this.items = [];
	},

	compareArrays: function(array) {
		var aINb = true, bINa = true;

		// We compare if Array array is in Array this.items
		this.items.forEach(function(key) {
			if(array.indexOf(key) === -1) aINb = false;
		});

		// We compare if Array this.items is in Array array
		array.forEach(function(key) {
			if(this.items.indexOf(key) === -1) bINa = false;
		}, this);

		if(aINb && bINa) return true;
		else return false;
	},

	init: function() {
		this.items = [];
	}

};
/* END ITEMHANDLER */

/* VIEWRENDERER */
// What we can do later :
// add a .toHide class to make css transition / animation to disapear
// set a timeout to the [].forEach.call to wait the animation to complete
// set a timeout to createArticle to wait animation to complete 
// (maybe a second argument BOOL to know if we wait an animtion to complete or if there's no animation to wait and create article directly)
var viewRenderer = {

	clearRenderer: function() {

		[].forEach.call(document.querySelectorAll('article'), function(article) {

			article.parentNode.removeChild(article);

		});

	},

	createArticle: function(item) {

		// creating article
		this._article = document.createElement('article');
		this._article.className = item.querySelector('tech').innerHTML.toLowerCase();

		// creating .tech
		this._tech = document.createElement('div');
		this._tech.className = 'tech';
		this._techLink = document.createElement('a');
		this._techLink.href ='#LINK';
		this._techLink.innerHTML = item.querySelector('tech').innerHTML;
		this._tech.appendChild(this._techLink);

		// creating .title
		this._title = document.createElement('div');
		this._title.className = 'title';
		this._titleLink = document.createElement('a');
		this._titleLink.className = 'link-title';
		this._titleLink.href = '#LINK';
		this._titleLink.innerHTML = item.querySelector('name').innerHTML;
		this._titleSpan = document.createElement('span');
		this._titleSpan.className = 'subtitle';
		this._titleSpan.innerHTML = item.querySelector('resume').innerHTML;
		this._title.appendChild(this._titleLink);
		this._title.appendChild(this._titleSpan);

		this._article.appendChild(this._tech);
		this._article.appendChild(this._title);
		document.querySelector('#content').appendChild(this._article);

	}

};
/* END VIEWRENDERER */

/* DATAXMLLOADER */
var dataXMLLoader = {

	load: function() {

		// GET XML DATA
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'assets/xml/data.xml');
		//xhr.responseType = 'document';
		xhr.onreadystatechange = function(event) {

			// IF NO RESPONSE
			if (xhr.readyState != XMLHttpRequest.DONE) return false;

			// XML DOCUMENT
			var xml = xhr.responseXML;

			var parser = new DOMParser();
			var xml = parser.parseFromString(xhr.responseText, "text/xml");

			console.log('XML document loaded');

			// Once we got the XML data, we can init handling searches
			searchHandler.init(xml);

		};
		xhr.send();
	}

};
/* END DATAXMLLOADER */

/* ITEMDATAXML */
var ItemDataXML = {

	// Max items returned by the XML doc & showed to the user
	MAX_ITEMS: 10,

	cachedSearch: {},

};
/* END ITEMDATAXML */

/* LOADINGSCREEN */
var LoadingScreen = {

	// Show for minimum 1 second
	MINI_SHOWTIME: 1000,

	// Effective creation of the screen
	createScreen: function() {

		// Loading screen background
		this._el = document.createElement('div');
		this._el.id = 'loading-screen';
		this._el.className = 'hidden';

		// Loader
		//! FOR NOW AN IMAGE, WILL BE 100%CSS/JS AFTER
		var loader = document.createElement('img');
		loader.className = 'vertical-aligned';
		loader.height = '48';
		loader.width = '48';
		loader.src = 'http://www.globedrivein.com/wp-content/plugins/nice-login-register-widget/images/loading_transparent.gif';
		this._el.appendChild(loader);

	},
	
	init: function() {

		// If the loading screen does not exist, we create it
		if(!this._el) this.createScreen();
		else return false;

		this.hideTimeout = Date.now() + this.MINI_SHOWTIME;
		document.body.appendChild(this._el);

	},

	over: function() {
		if(!this._el) return false;
		this._el.parentNode.removeChild(this._el);
	}

};
/* END LOADINGSCREEN */


/* AFINEDOC */
window.Afinedoc = {

	init: function() {

		// Wait 100ms showing the loading screen
		// It will not be showed for short loads
		var loadingTimeout = window.setTimeout(function() {

			LoadingScreen.init();

		}, 100);

		// We create the article's wrapper
		//Afinedoc.pageHandler.wrapper();
		dataXMLLoader.load();

		//! WHEN THE PAGE IS FULLY LOADED, HIDE THE LOADING-SCREEN
		//! WILL BE REPLACE IN Afinedoc.init() WHEN INTERFACE ITEMS WOULD BE LOADED
		window.addEventListener('load', function() {

			// We don't need the loading screen's timeout
			window.clearTimeout(loadingTimeout);
			LoadingScreen.over();

		}, false);

	}

};
/* END AFINEDOC */


/* MAIN */
document.addEventListener('DOMContentLoaded', function() {
	Afinedoc.init();
});
/* END MAIN FUCNTION */