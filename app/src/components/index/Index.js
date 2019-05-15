import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Body from "./Body";

function Index(props) {
	return (
		<div>
			<Header />
			<Body />
		</div>
	);
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Index);
