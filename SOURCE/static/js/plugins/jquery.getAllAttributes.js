(function ($) {
	$.fn.getAllAttributes = function () {
		var
			elem = this,
			attr = {};

		if (elem && elem.length) $.each(elem.get(0).attributes, function (v, n) {
			n = n.nodeName || n.name;
			v = elem.attr(n); // relay on $.fn.attr, it makes some filtering and checks
			if (v != undefined && v !== false) attr[n] = v
		})

		return attr;
	}
})(jQuery);
