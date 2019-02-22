import React, { Component } from 'react';

import Label from './Label';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {data: undefined};

		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragover = this.handleDragover.bind(this);
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
			this.setState({
				data: JSON.parse(event.target.result).RECIPES.RECIPE
			});
		}
		reader.readAsText(files[0]);
	}

	render() {
		// https://www.html5rocks.com/en/tutorials/file/dndfiles/
		return (
			<div className='App'>
				<div className='Droparea' onDragOver={this.handleDragover} onDrop={this.handleDrop}></div>
				<Label beerData={this.state.data} />
			</div>
		);
	}
}

export default App;
