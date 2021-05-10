/**    _______       _______
 *    / ____/ |     / /__  /
 *   / /_   | | /| / / /_ <
 *  / __/   | |/ |/ /___/ /
 * /_/      |__/|__//____/
 *
 * Flywheel3: the inertia php framework for old php versions
 *
 * @category    Flywheel3
 * @package     strings
 * @author      akira wakaba <wakabadou@gmail.com>
 * @copyright   Copyright (c) @2020  Wakabadou (http://www.wakabadou.net/) / Project ICKX (https://ickx.jp/). All rights reserved.
 * @license     http://opensource.org/licenses/MIT The MIT License.
 *              This software is released under the MIT License.
 * @version     1.0.0
 */

/**
 * HtmlElementビルダーです。
 */
class HtmlElementBuilder {
	constructor(tag_name, initializer = {}) {
		this.properties	= {
			tagName:			tag_name,
			children:			[],
			attributes:			{},
			classList:			[],
			data:				{},
			events:				[],
			dispatchEvents:		[],
			parentBuilder:		null,
			validators:			[],
			validatCallbacks:	{},
			validatorValues:	[],
		};


		if (typeof initializer == "string" || initializer instanceof String) {
			this.append(initializer);
		} else if (initializer instanceof HtmlElementBuilder) {
			this.append(initializer);
		} else if (Array.isArray(initializer)) {
			this.appends(initializer);
		} else {
			// arrayable
			[
				"classList",
				"children",
				"validators",
				"validatorValues"
			].forEach(function (name) {
				if (name in initializer) {
					this.properties[name]	= Array.isArray(initializer[name]) ? initializer[name] : [initializer[name]];
					delete initializer[name];
				}
			}, this);

			// simple
			[
				"validatCallbacks"
			].forEach(function (name) {
				if (name in initializer) {
					this.properties[name]	= initializer[name];
					delete initializer[name];
				}
			}, this);

			// set attributes
			this.properties.attributes	= initializer;
		}
	}

	static factory(tag_name, initializer = {}) {
		return new this(tag_name, initializer);
	}

	//==============================================
	// factory sugar
	//==============================================
	static br(initializer = {}) {
		return new this("br", initializer);
	}

	static div(initializer = {}) {
		return new this("div", initializer);
	}

	static label(initializer = {}) {
		return new this("label", initializer);
	}

	//----------------------------------------------
	// list
	//----------------------------------------------
	static ol(initializer = {}) {
		return new this("ol", initializer);
	}

	static ul(initializer = {}) {
		return new this("ul", initializer);
	}

	static li(initializer = {}) {
		return new this("li", initializer);
	}

	//----------------------------------------------
	// table
	//----------------------------------------------
	static table(initializer = {}) {
		return new this("table", initializer);
	}

	static tbody(initializer = {}) {
		return new this("tbody", initializer);
	}

	static thead(initializer = {}) {
		return new this("thead", initializer);
	}

	static tr(initializer = {}) {
		return new this("tr", initializer);
	}

	static th(initializer = {}) {
		return new this("th", initializer);
	}

	static td(initializer = {}) {
		return new this("td", initializer);
	}

	//----------------------------------------------
	// form
	//----------------------------------------------
	static button(initializer = {}) {
		return HtmlElementBuilder.factory("button", initializer);
	}

	static input(initializer = {}) {
		return InputElementBuilder.factory("text", initializer);
	}

	static inputText(initializer = {}) {
		return InputElementBuilder.factory("text", initializer);
	}

	static inputHidden(initializer = {}) {
		return InputElementBuilder.factory("hidden", initializer);
	}

	static inputCheckbox(initializer = {}) {
		return InputElementBuilder.factory("checkbox", initializer);
	}

	static inputNumber(initializer = {}) {
		return InputElementBuilder.factory("number", initializer);
	}

	static select(initializer = {}) {
		return SelectElementBuilder.factory(initializer);
	}

	static optGroup(initializer = {}) {
		return OptgroupElementBuilder.factory(initializer);
	}

	static option(initializer = {}) {
		return OptionElementBuilder.factory(initializer);
	}

	//==============================================
	// event
	//==============================================
	static attachEvent(element, types, func) {
		if (!Array.isArray(types)) {
			types	= [types];
		}

		types.forEach(function (type) {
			if (element.addEventListener != undefined) {
				element.addEventListener(type, func, false);
				return true;
			}

			let _type = "on" + type;
			if (element.attachEvent != undefined) {
				element.attachEvent(_type, func);
				return true;
			}

			element[_type] = func;
			return true;
		});
	}

	//==============================================
	// object accessor
	//==============================================
	get parent() {
		return this.properties.parent;
	}

	parent(value) {
		this.parentBuilder	= value;
		return this;
	}

	//==============================================
	// validator
	//==============================================
	get validators() {
		return this.properties.validators;
	}

	validators(value, validatCallbacks = null) {
		this.properties.validators	= value;

		if (arguments.length === 2) {
			this.properties.validatCallbacks	= validatCallbacks;
		}

		return this;
	}

	validate(value) {
		this.validators.push(value);
		return this;
	}

	get validatorValues() {
		return this.properties.validatorValues;
	}

	validatorValues(value) {
		this.properties.validatorValues	= value;
		return this;
	}

	get validatCallbacks() {
		return this.properties.validatCallbacks;
	}

	get preValidCallback() {
		return "pre" in this.properties.validatCallbacks ? this.properties.validatCallbacks.pre : function () {};
	}

	get validCallback() {
		return "valid" in this.properties.validatCallbacks ? this.properties.validatCallbacks.valid : function () {};
	}

	get invalidCallback() {
		return "invalid" in this.properties.validatCallbacks ? this.properties.validatCallbacks.invalid : function () {};
	}

	get postValidCallback() {
		return "post" in this.properties.validatCallbacks ? this.properties.validatCallbacks.post : function () {};
	}

	validatCallbacks(value) {
		this.properties.validatCallbacks	= value;
		return this;
	}

	//==============================================
	// property accessor
	//==============================================
	get tagName() {
		return this.properties.tagName;
	}

	//==============================================
	// attribute accessor
	//==============================================
	get attributes() {
		return this.properties.attributes;
	}

	hasAttr(attribut_name) {
		return attribut_name in this.properties.attributes;
	}

	attr(attribut_name, value = null) {
		if (arguments.length === 1) {
			this.properties.attributes[attribut_name]	= value;
			return this;
		}
		return attribut_name in this.properties.attributes ? this.properties.attributes[attribut_name] : undefined;
	}

	//----------------------------------------------
	// GLOBAL属性
	//----------------------------------------------
	get accesskey() {
		return this.attributes.accesskey;
	}

	accesskey(value) {
		this.attributes.accesskey = value;
		return this;
	}

	get contenteditable() {
		return this.attributes.contenteditable;
	}

	contenteditable(value) {
		this.attributes.contenteditable = value;
		return this;
	}

	get contextmenu() {
		return this.attributes.contextmenu;
	}

	contextmenu(value) {
		this.attributes.contextmenu = value;
		return this;
	}

	get dir() {
		return this.attributes.dir;
	}

	dir(value) {
		this.attributes.dir = value;
		return this;
	}

	get draggable() {
		return this.attributes.draggable;
	}

	draggable(value) {
		this.attributes.draggable = value;
		return this;
	}

	get dropzone() {
		return this.attributes.dropzone;
	}

	dropzone(value) {
		this.attributes.dropzone = value;
		return this;
	}

	get hidden() {
		return this.attributes.hidden;
	}

	hidden(value) {
		this.attributes.hidden = value;
		return this;
	}

	get id() {
		return this.attributes.id;
	}

	id(value) {
		this.attributes.id = value;
		return this;
	}

	get lang() {
		return this.attributes.lang;
	}

	lang(value) {
		this.attributes.lang = value;
		return this;
	}

	get spellcheck() {
		return this.attributes.spellcheck;
	}

	spellcheck(value) {
		this.attributes.spellcheck = value;
		return this;
	}

	get style() {
		return this.attributes.style;
	}

	style(value) {
		this.attributes.style = value;
		return this;
	}

	get tabindex() {
		return this.attributes.tabindex;
	}

	tabindex(value) {
		this.attributes.tabindex = value;
		return this;
	}

	get title() {
		return this.attributes.title;
	}

	title(value) {
		this.attributes.title = value;
		return this;
	}

	get translate() {
		return this.attributes.translate;
	}

	translate(value) {
		this.attributes.translate = value;
		return this;
	}

	//==============================================
	// css class
	//==============================================
	get classList() {
		return this.properties.classList;
	}

	addClass(value) {
		this.classList.push(value);
		return this;
	}

	//==============================================
	// data
	//==============================================
	get data() {
		return this.properties.data;
	}

	datum(name) {
		return "name" in this.data ? this.data[name] : undefined;
	}

	setDatum(name, value) {
		this.properties.data[name] = value;
		return this;
	}

	//==============================================
	// children
	//==============================================
	get children() {
		return this.properties.children;
	}

	append(value) {
		if (value instanceof HtmlElementBuilder) {
			value.parent(this);
		}
		this.properties.children.push(value);
		return this;
	}

	appends(elements) {
		let builder = this;
		elements.forEach(function (element) {
			builder.append(element);
		});
		return this;
	}

	//==============================================
	// event
	//==============================================
	get events() {
		return this.properties.events;
	}

	event(events, callback) {
		this.events.push([events, callback]);
		return this;
	}

	get dispatchEvents() {
		return this.properties.dispatchEvents;
	}

	dispatchEvent(events) {
		if (!Array.isArray(events)) {
			events	= [events];
		}

		let builder	= this;
		events.forEach(function (event) {
			builder.dispatchEvents.push(event);
		});

		return this;
	}

	//==============================================
	// builder
	//==============================================
	build() {
		let element = document.createElement(this.tagName);

		for (let attribute_name in this.attributes) {
			let attribute_value	= this.properties.attributes[attribute_name];
			element[attribute_name]	= attribute_value;
		}

		this.properties.children.forEach(function (node) {
			if (typeof node === "function") {
				if (node.constructor.name === "GeneratorFunction") {
					for (let node_part of node(this)) {
						if (typeof node_part === "function") {
							node_part	= node_part(this);
						}

						if (node_part instanceof HtmlElementBuilder) {
							node_part	= node_part.build();
						} else if (typeof node_part == "string" || node_part instanceof String) {
							node_part	= document.createTextNode(node_part);
						}

						if (typeof node_part !== "undefined") {
							element.appendChild(node_part);
						}
						element.appendChild(node_part);
					}
					return ;
				}

				node	= node(this);
			}

			if (node instanceof HtmlElementBuilder) {
				node	= node.build();
			} else if (typeof node == "string" || node instanceof String) {
				node	= document.createTextNode(node);
			}

			if (typeof node !== "undefined") {
				element.appendChild(node);
			}
		}, this);

		this.events.forEach(function (event) {
			HtmlElementBuilder.attachEvent(element, event[0], event[1]);
		});

		this.classList.forEach(function (css_class) {
			element.classList.add(css_class);
		});

		for (let data_name in this.data) {
			let data_value	= this.data[data_name];
			element["data-" + data_name]	= data_value;
		}

		let elementBuilder	= this;
		this.properties.validators.forEach(function (validate_rule) {
			let target_event	= "blur";
			if ('event' in validate_rule) {
				target_event	= validate_rule.event;
			}

			HtmlElementBuilder.attachEvent(element, target_event, function (event) {
				let target	= event.target;
				let rule	= validate_rule.rule;
				let value	= target.value;
				let result	= true;

				let options			= validate_rule;
				options.attributes	= elementBuilder.attributes;

				elementBuilder.preValidCallback(event);

				let validator	= Validator.createValidator(rule, value, options);

				if (validator.valid()) {
					elementBuilder.validCallback(event);
				} else {
					let message	= validator.detail({
						title: "title" in elementBuilder.validatorValues ? elementBuilder.validatorValues.title : ("title" in options ? validator.title : target.name)
					});

					elementBuilder.invalidCallback(event, message);
				}

				elementBuilder.postValidCallback(event);
			});
		});

		this.dispatchEvents.forEach(function (event) {
			element.dispatchEvent(new Event(event));
		});

		return element;
	}
}

class InputElementBuilder extends HtmlElementBuilder {
	static factory(type, initializer = {}) {
		let element = super.factory("input", initializer).type(type);
		switch (type) {
			case "checkbox":
				if (!("value" in initializer)) {
					element.value("1");
				}
				break;
		}
		return element;
	}

	static text(initializer = {}) {
		return this.factory("text", initializer);
	}

	static number(initializer = {}) {
		return this.factory("number", initializer);
	}

	static checkbox(initializer = {}) {
		return this.factory("checkbox", initializer);
	}

	get accept() {
		return this.attributes.accept;
	}

	accept(value) {
		this.attributes.accept = value;
		return this;
	}

	get alt() {
		return this.attributes.alt;
	}

	alt(value) {
		this.attributes.alt = value;
		return this;
	}

	get autocomplete() {
		return this.attributes.autocomplete;
	}

	autocomplete(value) {
		this.attributes.autocomplete = value;
		return this;
	}

	get autofocus() {
		return this.attributes.autofocus;
	}

	autofocus(value) {
		this.attributes.autofocus = value;
		return this;
	}

	get checked() {
		return this.attributes.checked;
	}

	checked(value) {
		this.attributes.checked = value;
		return this;
	}

	get dirname() {
		return this.attributes.dirname;
	}

	dirname(value) {
		this.attributes.dirname = value;
		return this;
	}

	get disabled() {
		return this.attributes.disabled;
	}

	disabled(value) {
		this.attributes.disabled = value;
		return this;
	}

	get form() {
		return this.attributes.form;
	}

	form(value) {
		this.attributes.form = value;
		return this;
	}

	get formaction() {
		return this.attributes.formaction;
	}

	formaction(value) {
		this.attributes.formaction = value;
		return this;
	}

	get formenctype() {
		return this.attributes.formenctype;
	}

	formenctype(value) {
		this.attributes.formenctype = value;
		return this;
	}

	get formmethod() {
		return this.attributes.formmethod;
	}

	formmethod(value) {
		this.attributes.formmethod = value;
		return this;
	}

	get formnovalidate() {
		return this.attributes.formnovalidate;
	}

	formnovalidate(value) {
		this.attributes.formnovalidate = value;
		return this;
	}

	get formtarget() {
		return this.attributes.formtarget;
	}

	formtarget(value) {
		this.attributes.formtarget = value;
		return this;
	}

	get height() {
		return this.attributes.height;
	}

	height(value) {
		this.attributes.height = value;
		return this;
	}

	get list() {
		return this.attributes.list;
	}

	list(value) {
		this.attributes.list = value;
		return this;
	}

	get max() {
		return this.attributes.max;
	}

	max(value) {
		this.attributes.max = value;
		return this;
	}

	get maxlength() {
		return this.attributes.maxlength;
	}

	maxlength(value) {
		this.attributes.maxlength = value;
		return this;
	}

	get min() {
		return this.attributes.min;
	}

	min(value) {
		this.attributes.min = value;
		return this;
	}

	get minlength() {
		return this.attributes.minlength;
	}

	minlength(value) {
		this.attributes.minlength = value;
		return this;
	}

	get multiple() {
		return this.attributes.multiple;
	}

	multiple(value) {
		this.attributes.multiple = value;
		return this;
	}

	get name() {
		return this.attributes.name;
	}

	name(value) {
		this.attributes.name = value;
		return this;
	}

	get pattern() {
		return this.attributes.pattern;
	}

	pattern(value) {
		this.attributes.pattern = value;
		return this;
	}

	get placeholder() {
		return this.attributes.placeholder;
	}

	placeholder(value) {
		this.attributes.placeholder = value;
		return this;
	}

	get readonly() {
		return this.attributes.readonly;
	}

	readonly(value) {
		this.attributes.readonly = value;
		return this;
	}

	get required() {
		return this.attributes.required;
	}

	required(value) {
		this.attributes.required = value;
		return this;
	}

	get size() {
		return this.attributes.size;
	}

	size(value) {
		this.attributes.size = value;
		return this;
	}

	get src() {
		return this.attributes.src;
	}

	src(value) {
		this.attributes.src = value;
		return this;
	}

	get step() {
		return this.attributes.step;
	}

	step(value) {
		this.attributes.step = value;
		return this;
	}

	get type() {
		return this.attributes.type;
	}

	type(value) {
		this.attributes.type = value;
		return this;
	}

	get value() {
		return this.attributes.value;
	}

	value(value) {
		this.attributes.value = value;
		return this;
	}

	get width() {
		return this.attributes.width;
	}

	width(value) {
		this.attributes.width = value;
		return this;
	}
}

class SelectElementBuilder extends HtmlElementBuilder {
	static factory(initializer = {}) {
		return super.factory("select", initializer);
	}

	get autofocus() {
		return this.attributes.autofocus;
	}

	autofocus(value) {
		this.attributes.autofocus = value;
		return this;
	}

	get disabled() {
		return this.attributes.disabled;
	}

	disabled(value) {
		this.attributes.disabled = value;
		return this;
	}

	get form() {
		return this.attributes.form;
	}

	form(value) {
		this.attributes.form = value;
		return this;
	}

	get multiple() {
		return this.attributes.multiple;
	}

	multiple(value) {
		this.attributes.multiple = value;
		return this;
	}

	get name() {
		return this.attributes.name;
	}

	name(value) {
		this.attributes.name = value;
		return this;
	}

	get required() {
		return this.attributes.required;
	}

	required(value) {
		this.attributes.required = value;
		return this;
	}

	get size() {
		return this.attributes.size;
	}

	size(value) {
		this.attributes.size = value;
		return this;
	}

	createOptGroup(label) {
		let optGroup = HtmlElementBuilder.optGroup({label: label}).selectElement(this);
		this.append(optGroup);
		return optGroup;
	}

	createOption(value, text) {
		let option = HtmlElementBuilder.option({value: value, text: text}).selectElement(this);
		this.append(option);
		return option;
	}
}

class OptgroupElementBuilder extends HtmlElementBuilder {
	static factory(initializer) {
		if (typeof initializer == "string" || initializer instanceof String) {
			return (new this("optgroup")).selectElement(null).label(initializer);
		}

		let element	= (new this("optgroup", initializer)).selectElement(null);;
		if ("lebel" in initializer) {
			element.label(label);
		}
		return element;
	}

	get selectElement() {
		return this.parentSelectElement;
	}

	selectElement(value) {
		this.parentSelectElement = value;
		return this;
	}

	get label() {
		return this.attributes.label;
	}

	label(value) {
		this.attributes.label = value;
		return this;
	}

	get disabled() {
		return this.attributes.disabled;
	}

	disabled(value) {
		this.attributes.disabled = value;
		return this;
	}

	createOption(value, text) {
		let option = HtmlElementBuilder.option({value: value, text: text}).selectElement(this).optGroupElement(this);
		this.append(option);
		return option;
	}

	addOption(value, text) {
		this.append(HtmlElementBuilder.option({value: value, text: text}).selectElement(this).optGroupElement(this));
		return this;
	}
}

class OptionElementBuilder extends HtmlElementBuilder {
	static factory(initializer) {
		if (typeof initializer == "string" || initializer instanceof String) {
			return (new this("option")).selectElement(null).optGroupElement(null).value(initializer).append(initializer);
		}

		let text	= null;
		if ("text" in initializer) {
			text = initializer.text;
			delete initializer.text;
		}

		let element	= (new this("option", initializer)).selectElement(null).optGroupElement(null);
		if (text !== null) {
			element.append(text).label(text);
		}

		return element;
	}

	get selectElement() {
		return this.parentSelectElement;
	}

	selectElement(value) {
		this.parentSelectElement = value;
		return this;
	}

	get optGroupElement() {
		return this.parentOptGroupElement;
	}

	optGroupElement(value) {
		this.parentOptGroupElement = value;
		return this;
	}

	get label() {
		return this.attributes.label;
	}

	label(value) {
		this.attributes.label = value;
		return this;
	}

	get value() {
		return this.attributes.value;
	}

	value(value) {
		this.attributes.value = value;
		return this;
	}

	get disabled() {
		return this.attributes.disabled;
	}

	disabled(value) {
		this.attributes.disabled = value;
		return this;
	}

	get selected() {
		return this.attributes.selected;
	}

	selected(value) {
		this.attributes.selected = value;
		return this;
	}
}
