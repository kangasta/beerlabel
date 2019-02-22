import React, { Component } from 'react';

import Label from './Label';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className='Add'>
				<Label beerData={require('./APA.json').RECIPES.RECIPE} />
			</div>
		);
	}
}

export default App;
