import React, { Component } from 'react';
import { xml2json } from 'xml-js';

import Label from './Label';

import './App.css';

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

		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragover = this.handleDragover.bind(this);
		this.handleSizeChange = this.handleSizeChange.bind(this);
	}

	handleDragover(event) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	}

	handleDrop(event) {
		event.stopPropagation();
		event.preventDefault();

		const files = event.dataTransfer.files;
		const reader = new FileReader();
		reader.onload = (event) => {
			const data = xml2json(event.target.result, {compact: true});
			this.setState({
				data: JSON.parse(data).RECIPES.RECIPE
			});
		}
		reader.readAsText(files[0]);
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
					<div className='Droparea' onDragOver={this.handleDragover} onDrop={this.handleDrop}>
						<Label beerData={this.state.data}/>
					</div>
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
