var searchHandler = {

	findItem: function(tech, name) {

		var returnedItem = false;

		[].forEach.call(this.documentXML.querySelectorAll('item'), function(item) {

			// Value of the search attribute of the item
			var itemSearch = item.attributes.search.value;

			// If the search is part of the available searches for the item
			if(itemSearch.search(tech + ' ' + name) > -1) {
				// Return the item
				if(!returnedItem) returnedItem = item;
			}

		});

		return returnedItem;

	}, // end searchHandler.findItem()
	
	init: function(documentXML) {

		this._input = document.querySelector('#search');
		this._input.addEventListener('keyup', this.onSearchChange.bind(this));

		// XML document loaded
		this.documentXML = documentXML;

		// Set cache to true
		this._cache = true;

		// We handle the selected technology
		this.selectTechnology();

		// init the itemHandler
		itemHandler.init();

	}, // end searchHandler.init()

	onSearchChange: function() {

		var search = this._input.value.toLowerCase();
		var cachedItemHandler = [];

		// If search is empty, we clear all articles
		if(search.length < 1) {
			this._cache = false;
			viewRenderer.clearRenderer();
			return false;
		}
		
		[].forEach.call(this.documentXML.querySelectorAll('item'), function(item) {
			// Value of the search attribute of the item
			var itemSearch = item.attributes.search.value;
			// Technology of the item
			var tech = item.querySelector('tech').textContent.toLowerCase();

			// If the search is part of the available searches for the item
			// && corresponds to the selected technology OR there is not selected tech
			if(itemSearch.search(search) > -1 && (tech == searchHandler.selectedTechnology || !searchHandler.selectedTechnology)) {
				// Add it to the cached itemHandler
				cachedItemHandler.push(item);
			}
		});

		// We compare cached items & the current items
		if(this._cache == false || !itemHandler.compareArrays(cachedItemHandler)) {

			//! LOG
			console.log('Create new articles');

			// We affect the cached itemHandler to the main itemHandler
			itemHandler.items = cachedItemHandler;
			this._cache = true;

			// We clear all current article elements
			viewRenderer.clearRenderer();

			// We create the article element for each item
			itemHandler.items.forEach(function(item) {

				viewRenderer.createArticle(item);

			});

			// We call the detailHandler to be able to show the full article
			detailHandler.init();

		} // end if cached items do not fit the current research
		else console.log('Keep cached articles'); //! LOG
		// end if chached items fit the current research

	}, // end searchHandler.onSearchChange()

	// Handle the selectedTechnology + the radio inputs
	selectTechnology: function() {

		[].forEach.call(document.querySelectorAll('menu input'), function(input) {

			input.addEventListener('click', function() {

				// If input.value == the selected tech
				// (because it's always input.checked)
				if(input.value == this.selectedTechnology) {
					// We unchecked the radio input
					input.checked = false;
					// We set the selectedTechnology to default
					this.selectedTechnology = false;
				}
				// If we select a technology, we affect the value
				else
					this.selectedTechnology = input.value;

				// In both case, we throw searchHandler.onSearchChange
				this.onSearchChange();

				//! LOG
				console.log('Display only ' + this.selectedTechnology + ' articles');

			}.bind(this));

		}.bind(this));

	}, // end selecTechnology

	selectedTechnology: false

};
/* END SEARCHHANDLER */

/* ITEMHANDLER */
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

		// Create resume article
		this.createResumeArticle(item);

		// Add every part in the article
		this._article.appendChild(this._tech);
		this._article.appendChild(this._title);
		document.querySelector('#content').appendChild(this._article);

	},

	createFullArticle: function(item) {

		// Create resume article
		this.createResumeArticle(item);

		this._description = document.createElement('div');
		this._description.className = 'description';
		this._description.innerHTML = item.querySelector('description').textContent;
		this._titleNote = document.createElement('div');
		this._titleNote.className = 'note';
		var textNote = item.querySelector('note').textContent;
		this._titleNote.innerHTML = textNote;


		// Add every part in the article
		this._article.appendChild(this._tech);
		this._article.appendChild(this._title);
		this._article.appendChild(this._description);
		if(textNote.length > 0)
			this._description.appendChild(this._titleNote);

		// We clear all articles
		this.clearRenderer();

		// We show the article
		document.querySelector('#content').appendChild(this._article);

		// We declare cache as false for any search changes
		searchHandler._cache = false;

	},

	createResumeArticle: function(item) {

		// creating article
		this._article = document.createElement('article');
		this._article.className = item.querySelector('tech').textContent.toLowerCase();

		// creating .tech
		var tech = item.querySelector('tech').textContent;
		this._tech = document.createElement('div');
		this._tech.className = 'tech';
		this._techLink = document.createElement('span');
		this._techLink.innerHTML = tech;
		this._tech.appendChild(this._techLink);

		// creating .title
		var name = item.querySelector('name').textContent;
		this._title = document.createElement('div');
		this._title.className = 'title';
		this._titleLink = document.createElement('a');
		this._titleLink.className = 'link-title';
		this._titleLink.href = '#' + tech.toLowerCase() + '-' + name.toLowerCase();
		this._titleLink.innerHTML = name;
		this._titleType = document.createElement('span');
		this._titleType.className = 'type';
		this._titleType.innerHTML = item.querySelector('type').textContent;
		this._titleSubtitle = document.createElement('span');
		this._titleSubtitle.className = 'subtitle';
		this._titleSubtitle.innerHTML = item.querySelector('resume').textContent;
		this._title.appendChild(this._titleLink);
		this._title.appendChild(this._titleType);
		this._title.appendChild(this._titleSubtitle);
	}

};
/* END VIEWRENDERER */

/* DETAILHANDLER */
var detailHandler = {

	init: function() {

		[].forEach.call(document.querySelectorAll('article .title a'), function(link) {
			link.addEventListener('click', function(e) {

				// With the tech and the name, we can find again what was the clicked article
				var tech = this.parentNode.parentNode.querySelector('.tech span').textContent.toLowerCase();
				var name = this.textContent.toLowerCase();

				// We search for the item
				var item = searchHandler.findItem(tech, name);	

				// We create the full render
				viewRenderer.createFullArticle(item);			

			}, false);
		});

	}

};
/* END DETAILHANDLER */

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

			//! LOG
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

		// Loader
		var loader = document.createElement('div');
		loader.className = 'loader';
		this._el.appendChild(loader);

	},
	
	init: function() {

		// timeOut
		this.hideTimeout = Date.now() + this.MINI_SHOWTIME;

		// If the loading screen does not exist, we create it
		if(!this._el) {
			this.createScreen();
			document.body.appendChild(this._el);
		}
		else { this._el.className = 'loader'; }
		

	},

	over: function() {
		if(!this._el) return false;

		// If we have to wait for the minimum showtime, we replay the function after a timeout
		var timeToWait = Date.now() - this.hideTimeout;
		if(timeToWait < 0) {
			window.setTimeout(function() {
				this.over()
			}.bind(this), -timeToWait);
		}
		else {
			// Hide the loading screen
			this._el.classList.add('hidden');
		}
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

		}, 0);

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