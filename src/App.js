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
			}
		};

		this.handleInputFile = this.handleInputFile.bind(this);
		this.handleSizeChange = this.handleSizeChange.bind(this);
	}

	handleInputFile(data) {
		const data_json_str = xml2json(data, {compact: true});
		this.setState({
			data: JSON.parse(data_json_str).RECIPES.RECIPE
		});
	}

	handleSizeChange(event) {
		const dimension = event.target.name;
		const value = event.target.value;
		if (dimension !== 'h' && dimension !== 'w') return;

		this.setState(old => {
			old.size[dimension] = value;
			return old;
		})
	}

	render() {
		// https://www.html5rocks.com/en/tutorials/file/dndfiles/
		return (
			<div className='App'>
				<div className='Main' style={{
					height: this.state.size.h.toString() + 'mm',
					width: this.state.size.w.toString() + 'mm'
				}}>
					<Droparea type='Text' callback={this.handleInputFile}>
						<Label beerData={this.state.data}/>
					</Droparea>
				</div>
				<span className='Controls'>
					<span className='Field'>
						<label htmlFor='control-h'>Height:</label>
						<input type='number' id='control-h' name='h' min='0' max='600' value={this.state.size.h} onChange={this.handleSizeChange}/>
						<span className='Unit'>mm</span>
					</span>
					<span className='Field'>
						<label htmlFor='control-w'>Width:</label>
						<input type='number' id='control-w' name='w' min='0' max='600' value={this.state.size.w} onChange={this.handleSizeChange}/>
						<span className='Unit'>mm</span>
					</span>
					<input type='button' name='reset' value='Reset' onClick={() => {this.setState({data: null})}}/>
				</span>
			</div>
		);
	}
}

export default App;
