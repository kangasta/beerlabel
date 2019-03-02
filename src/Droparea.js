import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Droparea extends Component {
	constructor(props) {
		super(props);

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
			const data = event.target.result;
			this.props.callback(data);
		};
		switch(this.props.type) {
		case 'DataURL':
			reader.readAsDataURL(files[0]);
			break;
		case 'Text':
			reader.readAsText(files[0]);
			break;
		}
	}

	render() {
		return (
			<div
				className={this.props.className + ' Droparea'}
				onDragOver={this.handleDragover}
				onDrop={this.handleDrop}
			>
				{this.props.children}
			</div>
		);
	}
}

Droparea.defaultProps = {
	callback: () => undefined,
	className: '',
	type: 'Text',
};

Droparea.propTypes = {
	callback: PropTypes.func,
	children: PropTypes.node,
	className: PropTypes.string,
	type: PropTypes.string,
};

export default Droparea;
