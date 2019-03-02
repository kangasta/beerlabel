import React, { Component } from 'react';
import { xml2json } from 'xml-js';

import Label from './Label';

import './App.css';
import Droparea from './Droparea';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			size: {
				h: 90,
				w: 180
			},
			container: {
				size: 33,
				unit: 'cl'
			}
		};

		this.handleInputFile = this.handleInputFile.bind(this);
		this.handleControlChange = this.handleControlChange.bind(this);
	}

	handleInputFile(data) {
		const data_json_str = xml2json(data, {compact: true});
		this.setState({
			data: JSON.parse(data_json_str).RECIPES.RECIPE
		});
	}

	handleControlChange(event) {
		const dimension = event.target.name;
		const value = event.target.value;

		var property;
		switch(dimension) {
		case 'h':
		case 'w':
			property = 'size';
			break;
		case 'size':
		case 'unit':
			property = 'container';
			break;
		default:
			return;
		}

		this.setState(old => {
			old[property][dimension] = value;
			return old;
		});
	}

	render() {
		// https://www.html5rocks.com/en/tutorials/file/dndfiles/
		return (
			<div className='App'>
				<div className='Main AppComponent' style={{
					height: this.state.size.h.toString() + 'mm',
					width: this.state.size.w.toString() + 'mm'
				}}>
					<Droparea type='Text' callback={this.handleInputFile}>
						{!this.state.data ? <div className='Label Placeholder'>Drop beerxml here</div> : <Label
							beerData={this.state.data}
							container={this.state.container}
							size={this.state.size}
						/>}
					</Droparea>
				</div>
				<div className='Controls'>
					<div className='AppLogo'>
						<img src='/favicon512.png'></img>
					</div>
					<h2>Dimension</h2>
					<div className='Field'>
						<label htmlFor='control-h'>Height:</label>
						<input type='number' id='control-h' name='h' min='0' max='600' value={this.state.size.h} onChange={this.handleControlChange}/>
						<span className='Unit'>mm</span>
					</div>
					<div className='Field'>
						<label htmlFor='control-w'>Width:</label>
						<input type='number' id='control-w' name='w' min='0' max='600' value={this.state.size.w} onChange={this.handleControlChange}/>
						<span className='Unit'>mm</span>
					</div>
					<h2>Details</h2>
					<div className='Field'>
						<label htmlFor='control-size'>Container:</label>
						<input type='number' id='control-size' name='size' min='0' max='600' value={this.state.container.size} onChange={this.handleControlChange}/>
						<input type='text' name='unit' value={this.state.container.unit} onChange={this.handleControlChange}/>
					</div>
					<div className='Button'>
						<input type='button' name='reset' value='Reset' onClick={() => {this.setState({data: null})}}/>
					</div>
				</div>
				<div className='Background'/>
			</div>
		);
	}
}

export default App;
