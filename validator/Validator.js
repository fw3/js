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

class Validator {
	constructor(value, options) {
		this.properties	= {
			value:		value,
			options:	options,
			message:	"message" in options ? options.message : this.defaultMessageFormat
		};
	}

	static factory(value, options) {
		return new this(value, options);
	}

	static createValidator(rule_name, value, options) {
		const RULE_MAP	={
			range:			function (value, options) {return RangeValidator.factory(value, options);},
			regex:			function (value, options) {return RegexValidator.factory(value, options);},
			datetime_range:	function (value, options) {return DatetimeRangeValidator.factory(value, options);},
		};

		return RULE_MAP[rule_name](value, options);
	}

	get defaultMessageFormat() {
		return "";
	}

	message(value) {
		this.properties.message	= value;
		return this;
	}

	get message() {
		return this.properties.message;
	}

	detail(message_values = {}) {
		return this.buildDetail(this.message, message_values);
	}

	buildDetail(message, message_values = {}) {
		return StringBuilder.factory(message, this.properties.options).build(message_values);
	}

	getOptionValue(name, default_value = null) {
		return name in this.properties.options ? this.properties.options[name] : ("name" in this.properties.options.attributes ? this.properties.options.attributes[name] : default_value);
	}
}

class RangeValidator extends Validator {
	valid() {
		return this.getOptionValue("min") <= this.properties.value && this.properties.value <= this.getOptionValue("max");
	}

	get defaultMessageFormat() {
		return "{:title}は{:mix}から{:max}まで入力できます。";
	}
}

class RegexValidator extends Validator {
	valid() {
		let regexp	= this.getOptionValue("pattern");
		if (typeof regexp == "string" || regexp instanceof String) {
			regexp	= new RegExp(this.properties.options.pattern);
		}
		return !regexp.test();
	}

	get defaultMessageFormat() {
		return "{:title}は{:pattern}の形式である必要があります。";
	}
}

class DatetimeRangeValidator extends Validator {
	valid() {
		let date	= (new Date(this.properties.value)).getTime();
		let min		= (new Date(this.getOptionValue("min"))).getTime();
		let max		= (new Date(this.getOptionValue("max"))).getTime();
		return	min <= date && date <= max;
	}

	get defaultMessageFormat() {
		return "{:title}は{:min}から{:max}の間で入力してください。";
	}
}
