import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Label extends Component {
	getGravity(type='OG') {
		if (this.props.beerData.hasOwnProperty(type)) {
			return this.props.beerData[type]._text;
		} else if (this.props.beerData.hasOwnProperty('EST_' + type)) {
			return this.props.beerData['EST_' + type]._text;
		} else {
			return undefined;
		}
	}

	render() {
		if (!this.props.beerData) {
			return null;
		}

		const toArray = a => (Array.isArray(a) ? a : [a]);
		const abv = Math.round((Number(this.getGravity('OG'))-Number(this.getGravity('FG'))) * 131.25 * 10)/10
		const IBU = (alpha, amount, time, batch_size, gravity) => {
			// http://www.realbeer.com/hops/research.html
			const added_alpha = Number(alpha) * Number(amount) * 1000 / Number(batch_size);

			const bigness = 1.65 * Math.pow(125e-6, (Number(gravity) - 1));
			const boil_time = (1 - Math.exp(-0.04 * Number(time))) / 4.15;

			return bigness * boil_time * added_alpha;
		}

		const ibu = toArray(this.props.beerData.HOPS.HOP)
			.filter(a => !a.USE._text.toLowerCase().match(/dry.*hop/))
			.map(a => IBU(a.ALPHA._text/100, a.AMOUNT._text*1000, a.TIME._text, this.props.beerData.BATCH_SIZE._text, this.getGravity('OG')))
			.reduce((a,b) => Math.round((a+b) * 10) / 10);

		//http://brewwiki.com/index.php/Estimating_Color
		const MCU = (grain_color, weigth, volume) => (grain_color * weigth * 2.2046 / (volume / 3.7854))
		const EBC = (sum_MCUs) => 1.97/* SRM to EBC */ * 1.4922 * Math.pow(sum_MCUs, 0.6859)

		const ebc = Math.round(
			EBC(toArray(this.props.beerData.FERMENTABLES.FERMENTABLE)
			.map(a => MCU(a.COLOR._text, a.AMOUNT._text, this.props.beerData.BATCH_SIZE._text))
			.reduce((a,b) => Math.round(a+b))))

		return (
			<div className="App">
				<div className='Center'>
					<h1>{this.props.beerData.NAME._text}</h1>
					<h2>Metrics</h2>
					<ul>
						<li>ABV: {abv}</li>
						<li>IBU: {ibu}</li>
						<li>EBC: {ebc}</li>
					</ul>
					<h2>Fermentables</h2>
					<ul>
						{toArray(this.props.beerData.FERMENTABLES.FERMENTABLE).map(fermentable => (
							<li key={fermentable.NAME._text}>{fermentable.NAME._text}: {Math.round(fermentable.AMOUNT._text*10)/10 + ' kg'}</li>
						))}
					</ul>
					<h2>Hops</h2>
					<ul>
						{toArray(this.props.beerData.HOPS.HOP).map(hop => (
							<li key={hop.NAME._text + hop.TIME._text}>{hop.NAME._text}: {hop.AMOUNT._text * 1e3} g, {Math.round(hop.TIME._text)} min</li>
						))}
					</ul>
					<h2>Yeasts</h2>
					<ul>
						{toArray(this.props.beerData.YEASTS.YEAST).map(yeast => (
							<li key={yeast.NAME._text}>{yeast.NAME._text}: {yeast.AMOUNT._text * 1e3} g</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
}

Label.defaultProps = {
}

Label.propTypes = {
	beerData: PropTypes.object
}

export default Label;
