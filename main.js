/**
 * \copyright (c) 2018 Josh Klodnicki
 */

'use strict';

const path = require('path');

/** \name Private Members
 * These functions are not exposed in the class.
 * They must be called with:
 *     <func>.call(this, <args...>)
 *
 * @{
 */

function submit (text) {
	if (this.echo) this.appendLine(text);
	if (typeof this.callback === 'function') this.callback(text);
}

function keydown (event) {
	switch (event.key) {
		case 'Enter':
			submit.call(this, event.target.value);
			event.target.value = "";
			break;
		case 'Escape':
			this.inputField.blur();
			break;
		case 'Tab':
			if (this.literalTab) {
				event.preventDefault();
				/// \todo This does not insert tab at cursor posision
				event.target.value += '\t';
			}
			break;
	}
}

///@}

module.exports = class DumbTerm {
	constructor (element) {
		this.element    = element;
		this.outputDiv  = document.createElement('div');
		this.inputField = document.createElement('input');
		this._callback  = null;
		this.echo       = true;
		this.scrollLock = false;
		this.literalTab = false;

		const inputLine = document.createElement('div');
		inputLine.appendChild(this.inputField);

		this.element.appendChild(this.outputDiv);
		this.element.appendChild(inputLine);

		this.element.classList.add('dumb-terminal');
		inputLine.className       = 'dumb-term-line';
		this.inputField.className = 'dumb-term-input';

		this.element.addEventListener('click',   this.focus.bind(this));
		this.element.addEventListener('keydown', keydown.bind(this));

		this.inputField.setAttribute('type', 'text');
	}

	set callback (callback) {
		if (typeof callback === 'function')
			this._callback = callback;
		else
			throw new Error('Callback is not a function');
	}
	get callback () { return this._callback }

	appendLine (text) {
		const newLine = document.createElement('div');
		newLine.className = 'dumb-term-line';
		newLine.textContent = text;
		this.outputDiv.appendChild(newLine);
		if (!this.scrollLock)
			this.element.scrollTop = this.element.scrollHeight;
	}

	focus () {
		this.inputField.focus();
	}
}

const link = document.createElement('link');
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", path.join(__dirname, 'style.css'));
document.head.insertBefore(link, document.head.firstChild);

// vim: ft=javascript.doxygen
