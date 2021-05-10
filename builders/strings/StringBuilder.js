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
 * 変数展開が可能な文字列ビルダーです。
 */
class StringBuilder
{
	//==============================================
	// factory
	//==============================================
	constructor(message, values, substiture) {
		this.properties	= {
			values:			values,
			enclosureBegin:	"{:",
			enclosureEnd:	"}",
			nameSeparator:	":",
			substitute:		null,
			message:		message
		};
	}

	static factory(message = "", values = {}, substiture = null) {
		return new this(message, values, substiture);
	}

	//==============================================
	// property accessors
	//==============================================
	get values() {
		return this.properties.values;
	}

	values(value) {
		this.properties.values  = value;
		return this;
	}

	get enclosureBegin() {
		return this.properties.enclosureBegin;
	}

	enclosureBegin(value) {
		this.properties.enclosureBegin  = value;
		return this;
	}

	get enclosureEnd() {
		return this.properties.enclosureEnd;
	}

	enclosureEnd(value) {
		this.properties.enclosureEnd    = value;
		return this;
	}

	get nameSeparator() {
		return this.properties.nameSeparator;
	}

	nameSeparator(value) {
		this.properties.nameSeparator   = value;
		return this;
	}

	get substitute() {
		return this.properties.substitute;
	}

	substitute(value) {
		this.properties.substitute  = value;
		return this;
	}

	get message() {
		return this.properties.substitute;
	}

	message(value) {
		this.properties.message = value;
		return this;
	}

	//==============================================
	// builder
	//==============================================
	build(values = {}) {
		return this.buildMessage(this.properties.message, values);
	}

	buildMessage(message, values = {}) {
		if (!(typeof message == "string" || message instanceof String)) {
			return "";
		}

		let tmp_values  = this.properties.values;
		for(let key in values) {
			tmp_values[key] = values[key];
		}

		let pos				= message.length;
		let name			= "";
		let before_message	= "";
		let before_pos		= 0;

		let begin			= 0;
		let end				= 0;

		for (;-1 !== (begin = message.lastIndexOf(this.properties.enclosureBegin, pos)) && -1 !== (end = message.indexOf(this.properties.enclosureEnd, begin));) {
			if (before_message === message) {
				pos = begin - message.length - 1;
				if (pos + message.length < 0) {
					pos = -message.length;
				}

				if (before_pos	=== pos) {
					break;
				}

				before_pos	= pos;

				before_message	= "";
				continue;
			}

			before_pos	= pos;

			let name_begin	= begin + this.properties.enclosureBegin.length;
			let name_end	= name_begin + end - begin - this.properties.enclosureBegin.length;

			let tag_begin	= begin;
			let tag_end		= tag_begin + end - begin + this.properties.enclosureEnd.length;

			let name		= message.slice(name_begin, name_end);
			let search	= message.slice(tag_begin, tag_end);

			if (-1 !== name.indexOf(this.properties.enclosureBegin, 0)) {
				before_message	= message;
				message			= message.replaceAll(search, this.properties.buildMessage(name, tmp_values));
				continue;
			}

			let replacement = this.properties.substitute === null ? search : this.properties.substitute;
			let names		= name.split(this.properties.nameSeparator);
			for (let name of names) {
				if (name in tmp_values) {
					replacement = tmp_values[name];
					break;
				}
			}

			before_message	= message;
			message			= message.replaceAll(search, replacement);
		}

		return message;
	}
}
