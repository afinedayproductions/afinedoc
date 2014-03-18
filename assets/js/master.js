/* MARKDOWNHANDLER */
var markdownHandler = {

	//! Showdown.js must be already loaded

	init: function() {
		this.showdown = new Showdown.converter();
	},

	setHTML: function(item, selector) {
		return this.showdown.makeHtml(item.querySelector(selector).textContent);
	}
	
};
/* END MARKDOWNHANDLER*/

/* SEARCHHANDLER */
var searchHandler = {

	findItem: function(tech, name) {

		var returnedItem = false;
		name = name.replace('$', '\\$');

		[].forEach.call(this.documentXML.querySelectorAll('item'), function(item) {

			// Value of the search attribute of the item
			var itemSearch = item.attributes.search.value;

			// If the search is part of the available searches for the item
			if(!returnedItem && item.querySelector('tech').textContent.toLowerCase() === tech && (itemSearch.search(name) > -1)) {
				// Return the item
				returnedItem = item;
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

		var search = this._input.value.toLowerCase().replace('$', '\\$');
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
			if((search == '*' || itemSearch.search(search) > -1) && (tech == searchHandler.selectedTechnology || !searchHandler.selectedTechnology)) {
				// Add it to the cached itemHandler
				cachedItemHandler.push(item);
			}
		});

		// We compare cached items & the current items
		if(this._cache === false || !itemHandler.compareArrays(cachedItemHandler)) {

			//! LOG
			window.console.log('Create new articles');

			// We affect the cached itemHandler to the main itemHandler
			itemHandler.items = cachedItemHandler;
			this._cache = true;

			// We clear all current article elements
			viewRenderer.clearRenderer();

			// We create the article element for each item
			viewRenderer.init(itemHandler.items);
			viewRenderer.vanish();

			// We call the detailHandler to be able to show the full article
			detailHandler.init();

		} // end if cached items do not fit the current research
		else window.console.log('Keep cached articles'); //! LOG
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
				window.console.log('Display only ' + this.selectedTechnology + ' articles');

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
var viewRenderer = {

	clearRenderer: function() {

		[].forEach.call(document.querySelectorAll('article'), function(article) {

			article.parentNode.remove();

		});

	},

	init: function(items) {

		items.forEach(function(item) {

			// Create resume article
			this.createResumeArticle(item);

			//  We create a wrapping <a>
			this._a = document.createElement('a');
			this._a.href = this._link; // create in createResumeArticle
			this._a.className = 'article-link';
			this._a.innerHTML = ' ';
			this._a.appendChild(this._article);

			// Add every part in the article
			this._article.appendChild(this._tech);
			this._article.appendChild(this._title);
			this._article.classList.add('vanish');
			document.querySelector('#content').appendChild(this._a);

		}.bind(this));

	},

	initFullArticle: function(item) {

		// Create resume article
		this.createResumeArticle(item);
		this._article.classList.add('alone');

		this._description = document.createElement('div');
		this._description.className = 'description';
		this._description.innerHTML = markdownHandler.setHTML(item, 'description');
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
		var tech = item.querySelector('tech').textContent;
		var name = item.querySelector('name').textContent;
		var nameHTML = markdownHandler.setHTML(item, 'name');
		this._article = document.createElement('article');
		this._article.className = item.querySelector('tech').textContent.toLowerCase();
		this._link = '#' + tech.toLowerCase() + '-' + name.toLowerCase();

		// creating .tech
		this._tech = document.createElement('div');
		this._tech.className = 'tech';
		this._techLink = document.createElement('span');
		this._techLink.innerHTML = tech;
		this._tech.appendChild(this._techLink);

		// creating .title
		this._title = document.createElement('div');
		this._title.className = 'title';
		this._titleSpan = document.createElement('span');
		this._titleSpan.innerHTML = nameHTML;
		this._titleType = document.createElement('span');
		this._titleType.className = 'type';
		this._titleType.innerHTML = item.querySelector('type').textContent;
		this._titleSubtitle = document.createElement('span');
		this._titleSubtitle.className = 'subtitle';
		this._titleSubtitle.innerHTML = markdownHandler.setHTML(item, 'resume');
		this._title.appendChild(this._titleSpan);
		this._title.appendChild(this._titleType);
		this._title.appendChild(this._titleSubtitle);
	},

	vanish: function() {
		window.setTimeout(function() {
			[].forEach.call(document.querySelectorAll('article'), function(article) {
				article.classList.remove('vanish');
			});
		}, 0);
	}

};
/* END VIEWRENDERER */

/* DETAILHANDLER */
var detailHandler = {

	init: function() {

		[].forEach.call(document.querySelectorAll('.article-link'), function(link) {
			link.addEventListener('click', function() {

				// With the tech and the name, we can find again what was the clicked article
				var tech = this.querySelector('.tech span').textContent.toLowerCase();
				var name = this.querySelector('.title span').textContent.toLowerCase();

				// We search for the item
				var item = searchHandler.findItem(tech, name);

				// We create the full render
				viewRenderer.initFullArticle(item);

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
		xhr.onreadystatechange = function() {

			// IF NO RESPONSE
			if (xhr.readyState != XMLHttpRequest.DONE) return false;

			// XML DOCUMENT
			var xml = xhr.responseXML;

			var parser = new DOMParser();
			xml = parser.parseFromString(xhr.responseText, 'text/xml');

			//! LOG
			window.console.log('XML document loaded');

			// Once we got the XML data, we can init handling searches
			searchHandler.init(xml);

		};
		xhr.send();
	}

};
/* END DATAXMLLOADER */


/* LOADINGSCREEN */
var LoadingScreen = {

	// Show for minimum 1 second
	MINI_SHOWTIME: 1000,
	
	init: function() {

		// We select the loading screen
		this._el = document.querySelector('#loading-screen');

		// timeOut before we can hide #loading-screen
		this.hideTimeout = Date.now() + this.MINI_SHOWTIME;

	},

	over: function() {

		// If we have to wait for the minimum showtime, we replay the function after a timeout
		var timeToWait = Date.now() - this.hideTimeout;
		if(timeToWait < 0) {
			window.setTimeout(function() {
				this.over();
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

		// First, we init the loading screen
		LoadingScreen.init();

		// We load XML document
		dataXMLLoader.load();

		// markdownHandler
		markdownHandler.init();

		// When the page is fully loaded, hide the loading screen
		window.addEventListener('load', function() {

			LoadingScreen.over();

		}, false);

	}

};
/* END AFINEDOC */


/* MAIN */
document.addEventListener('DOMContentLoaded', function() {
	window.Afinedoc.init();
});
/* END MAIN FUCNTION */