function num2rgbval(n) {
	n = Math.round(n);
	n = Math.min(255, n);
	n = Math.max(0, n);
	return n;
}

function polynomial(coeffs, x) {
	var r = 0;
	var max = coeffs.length - 1;
	for (var i = max; i >= 0; i--) {
		r += coeffs[max - i]*Math.pow(x, i);
	}
	return r;
}

function ebc2rgb(ebc) {
	if (ebc > 56) return {"r": 0, "g": 0, "b": 0}
	
	const r = [-0.03666201, -2.467356497, 256.5915566];
	const g = [0.058661176, -8.013965521, 273.5627425];
	const b = [0.000249081, -0.032194991, 1.390501896, -23.81644649, 184.73482850];
	
	return {
		"r": num2rgbval(polynomial(r, ebc)),
		"g": num2rgbval(polynomial(g, ebc)),
		"b": num2rgbval(polynomial(b, ebc))
	};
}

function num2hex(n) {
	return n > 0xF ? n.toString(16) : "0" + n.toString(16);
}

function rgb2str(r,g,b) {
	return "#" + num2hex(r) + num2hex(g) + num2hex(b);
}

function ebc2color(ebc) {
	const rgb = ebc2rgb(ebc);
	return rgb2str(rgb.r, rgb.g, rgb.b);
}

export {
	ebc2color
};