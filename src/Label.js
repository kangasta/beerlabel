import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ebc2color } from './ColorUtils';
import Droparea from './Droparea';

import './Label.css';

class Label extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mainImageSrc: '',
			breweryLogoSrc: ''
		};
	}

	static toArray(a) {
		return (Array.isArray(a) ? a : [a]);
	}

	getGravity(type='OG') {
		if (this.props.beerData.hasOwnProperty(type)) {
			return this.props.beerData[type]._text;
		} else if (this.props.beerData.hasOwnProperty('EST_' + type)) {
			return this.props.beerData['EST_' + type]._text;
		} else {
			return undefined;
		}
	}

	getProperty(property_str) {
		const property_arr = property_str.split('.');
		try {
			return property_arr.reduce((prev, curr) => prev[curr], this.props.beerData);
		} catch(e) {
			return undefined;
		}
	}

	getMetricsComponent(name, value, unit='') {
		return (
			<div className='Metric'>
				<div className={'Value ' + (!name ? 'Big' : '')}>{value}<span className='Unit'>{unit}</span></div>
				<div className='Name'>{name}</div>
			</div>
		);
	}

	static getMaltType(malt_name) {
		if (malt_name.toLowerCase().match(/wheat/)) {
			return 'Wheat malt';
		} else if (malt_name.toLowerCase().match(/rye/)) {
			return 'Rye malt';
		} else if (malt_name.toLowerCase().match(/oat/)) {
			return 'Oat malt';
		} else if (malt_name.toLowerCase().match(/rice/)) {
			return 'Rice malt';
		} else if (malt_name.toLowerCase().match(/corn/)) {
			return 'Corn malt';
		} else {
			return 'Barley malt';
		}
	}

	getIngredients() {
		var ing = ['Water'];
		Label.toArray(this.props.beerData.FERMENTABLES.FERMENTABLE)
			.forEach(fermentable => {
				/*
				if (!fermentable.NAME._text.toLowerCase().match(/malt/)) {
					ing.push(fermentable.NAME._text);
				} else {
				*/
				const malt = Label.getMaltType(fermentable.NAME._text);
				if (!ing.includes(malt)) ing.push(malt);
				//}
			});
		ing.push('Hops', 'Yeast');
		return ing.join(', ');
	}

	getFullHeightStyle() {
		var full_height;
		try {
			full_height = {
				height: (this.props.size.h).toString() + 'mm'
			};
		} catch(e) {
			full_height = {};
		}
		return full_height;
	}

	getDetails() {
		const description = this.props.description || this.getProperty('DESCRIPTION._text') || null;
		return (
			<div className='Details MiddleOf' style={this.getFullHeightStyle()}>
				<div className={'Middle' + (!description ? ' NoDescription' : '')}>
					{!description ? null : description.split('\n\n').map(p => (<p key={p} className='Description'>{p}</p>))}
					<p className='Ingredients'><span className='Title'>Ingredients:</span> {this.getIngredients()}</p>
					<div className='Logo'>
						<Droparea className={'Image' + ( this.state.breweryLogoSrc ? '' : ' Placeholder')} type='DataURL' callback={(result) => {this.setState({breweryLogoSrc: result});}}>
							<img alt='Logo placeholder' src={this.state.breweryLogoSrc}/>
						</Droparea>
					</div>
				</div>
			</div>
		);
	}

	getRecipe() {
		return (
			<div className='Recipe'>
				<h1>Ingredients</h1>
				<h2>Fermentables</h2>
				<ul>
					{Label.toArray(this.props.beerData.FERMENTABLES.FERMENTABLE).map(fermentable => (
						<li key={fermentable.NAME._text}>{fermentable.NAME._text}: {Math.round(fermentable.AMOUNT._text*10)/10 + ' kg'}</li>
					))}
				</ul>
				<h2>Hops</h2>
				<ul>
					{Label.toArray(this.props.beerData.HOPS.HOP).map(hop => (
						<li key={hop.NAME._text + hop.TIME._text}>{hop.NAME._text}: {hop.AMOUNT._text * 1e3} g, { hop.USE._text.toLowerCase().match(/dry.*hop/) ? 'Dry-hop' : Math.round(hop.TIME._text).toString() + ' min'}</li>
					))}
				</ul>
				<h2>Yeasts</h2>
				<ul>
					{Label.toArray(this.props.beerData.YEASTS.YEAST).map(yeast => (
						<li key={yeast.NAME._text}>{yeast.NAME._text}: {yeast.AMOUNT._text * 1e3} g</li>
					))}
				</ul>
			</div>
		);
	}

	render() {
		if (!this.props.beerData) {
			return null;
		}

		const abv = Math.round((Number(this.getGravity('OG'))-Number(this.getGravity('FG'))) * 131.25 * 10)/10;
		const IBU = (alpha, amount, time, batch_size, gravity) => {
			// http://www.realbeer.com/hops/research.html
			const added_alpha = Number(alpha) * Number(amount) * 1000 / Number(batch_size);

			const bigness = 1.65 * Math.pow(125e-6, (Number(gravity) - 1));
			const boil_time = (1 - Math.exp(-0.04 * Number(time))) / 4.15;

			return bigness * boil_time * added_alpha;
		};

		const ibu = Label.toArray(this.props.beerData.HOPS.HOP)
			.filter(a => !a.USE._text.toLowerCase().match(/dry.*hop/))
			.map(a => IBU(a.ALPHA._text/100, a.AMOUNT._text*1000, a.TIME._text, this.props.beerData.BATCH_SIZE._text, this.getGravity('OG')))
			.reduce((a,b) => Math.round(a + b));

		//http://brewwiki.com/index.php/Estimating_Color
		const MCU = (grain_color, weigth, volume) => (grain_color * weigth * 2.2046 / (volume / 3.7854));
		const EBC = (sum_MCUs) => 1.97/* SRM to EBC */ * 1.4922 * Math.pow(sum_MCUs, 0.6859);

		const ebc = Math.round(
			EBC(Label.toArray(this.props.beerData.FERMENTABLES.FERMENTABLE)
				.map(a => MCU(a.COLOR._text, a.AMOUNT._text, this.props.beerData.BATCH_SIZE._text))
				.reduce((a,b) => Math.round(a+b))));

		var ebc_backgroud;
		try {
			ebc_backgroud = {
				backgroundColor: ebc2color(ebc),
				color: ebc > 25 ? '#ddd' : '#333'
			};
		} catch(e) {
			ebc_backgroud = {};
		}

		return (
			<div className='Label'>
				<div className='Metrics MiddleOf' style={Object.assign({}, this.getFullHeightStyle(), ebc_backgroud)}>
					<div className='Middle'>
						{this.getMetricsComponent('ABV', abv, '%')}
						{this.getMetricsComponent('IBU', ibu)}
						{this.getMetricsComponent('EBC', ebc)}
						{this.getMetricsComponent(null, this.props.container.size, this.props.container.unit)}
					</div>
				</div>
				<div className='SideNote' style={this.getFullHeightStyle()}>
					Label automatically generated
				</div>
				{this.getDetails()}
				{this.getRecipe()}
				<div className='Front'>
					<Droparea className={'Image' + ( this.state.mainImageSrc ? '' : ' Placeholder')} type='DataURL' callback={(result) => {this.setState({mainImageSrc: result});}}>
						<img alt='Logo placeholder' src={this.state.mainImageSrc}/>
					</Droparea>
					<div className='Title'>
						<div className='Name'>{this.getProperty('NAME._text')}</div>
						<div className='Style'>{this.getProperty('STYLE.NAME._text')}</div>
					</div>
				</div>
			</div>
		);
	}
}

Label.defaultProps = {
	container: {
		size: 33,
		unit: 'cl'
	}
};

Label.propTypes = {
	beerData: PropTypes.object,
	description: PropTypes.string,
	container: PropTypes.shape({
		size: PropTypes.number,
		unit: PropTypes.string
	}),
	size: PropTypes.shape({
		h: PropTypes.number,
		w: PropTypes.number
	})
};

export default Label;
