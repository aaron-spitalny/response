import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Body from "./Body";
import jsonData from "../../../../../processed-cdaad.json";

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
