/**
 * SCEditor
 * http://www.sceditor.com/
 *
 * Copyright (C) 2014, Sam Clarke (samclarke.com)
 *
 * SCEditor is licensed under the MIT license:
 *	http://www.opensource.org/licenses/mit-license.php
 *
 * @fileoverview SCEditor - A lightweight WYSIWYG BBCode and HTML editor
 * @author Sam Clarke
 * @requires jQuery
 */

import $ from 'jquery';
import SCEditor from './lib/SCEditor.js';
import PluginManager from './lib/PluginManager.js';
import * as escape from './lib/escape.js';
import * as browser from './lib/browser.js';
import * as dom from './lib/dom.js';
import RangeHelper from './lib/RangeHelper.js';
import defaultCommands from './lib/defaultCommands.js';
import defaultOptions from './lib/defaultOptions.js';


// For backwards compatibility
$.sceditor = SCEditor;

SCEditor.commands       = defaultCommands;
SCEditor.defaultOptions = defaultOptions;
SCEditor.RangeHelper    = RangeHelper;
// Legacy support, don't expose new methods
SCEditor.dom            = {
	traverse: dom.traverse,
	rTraverse: dom.rTraverse,
	parseHTML: dom.parseHTML,
	hasStyling: dom.hasStyling,
	convertElement: dom.convertElement,
	blockLevelList: dom.blockLevelList,
	canHaveChildren: dom.canHaveChildren,
	isInline: dom.isInline,
	copyCSS: dom.copyCSS,
	fixNesting: dom.fixNesting,
	findCommonAncestor: dom.findCommonAncestor,
	getSibling: dom.getSibling,
	removeWhiteSpace: dom.removeWhiteSpace,
	extractContents: dom.extractContents,
	getOffset: dom.getOffset,
	getStyle: dom.getStyle,
	hasStyle: dom.hasStyle
};

SCEditor.ie                 = browser.ie;
SCEditor.ios                = browser.ios;
SCEditor.isWysiwygSupported = browser.isWysiwygSupported;

SCEditor.regexEscape     = escape.regex;
SCEditor.escapeEntities  = escape.entities;
SCEditor.escapeUriScheme = escape.uriScheme;

SCEditor.PluginManager = PluginManager;
SCEditor.plugins       = PluginManager.plugins;


/**
 * Creates an instance of sceditor on all textareas
 * matched by the jQuery selector.
 *
 * If options is set to "state" it will return bool value
 * indicating if the editor has been initialised on the
 * matched textarea(s). If there is only one textarea
 * it will return the bool value for that textarea.
 * If more than one textarea is matched it will
 * return an array of bool values for each textarea.
 *
 * If options is set to "instance" it will return the
 * current editor instance for the textarea(s). Like the
 * state option, if only one textarea is matched this will
 * return just the instance for that textarea. If more than
 * one textarea is matched it will return an array of
 * instances each textarea.
 *
 * @param  {Object|String} options Should either be an Object of options or
 *                                 the strings "state" or "instance"
 * @return {this|Array|jQuery.sceditor|Bool}
 */
$.fn.sceditor = function (options) {
	var	$this, instance,
		ret = [];

	options = options || {};

	if (!options.runWithoutWysiwygSupport && !browser.isWysiwygSupported) {
		return;
	}

	this.each(function () {
		$this = this.jquery ? this : $(this);
		instance = $this.data('sceditor');

		// Don't allow the editor to be initialised
		// on it's own source editor
		if ($this.parents('.sceditor-container').length > 0) {
			return;
		}

		// Add state of instance to ret if that is what options is set to
		if (options === 'state') {
			ret.push(!!instance);
		} else if (options === 'instance') {
			ret.push(instance);
		} else if (!instance) {
			/*eslint no-new: off*/
			(new SCEditor(this, options));
		}
	});

	// If nothing in the ret array then must be init so return this
	if (!ret.length) {
		return this;
	}

	return ret.length === 1 ? ret[0] : $(ret);
};
