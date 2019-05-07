import React, { Component } from "react";
import {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	MarkSeries,
	MarkSeriesCanvas,
	Hint,
	Highlight
} from "react-vis";
import { connect } from "react-redux";
var moment = require("moment");
import { changeDrawLocation } from "../../redux/actions/indexActions";

function getData(data) {
	return data.map(event => ({
		x: new Date(event["Activity Time"]).getTime(),
		y: event["Agent Name"].substring(0, event["Agent Name"].indexOf(",")),
		size: 5,
		color: event["Activity Type"] == "State" ? "#00ffff" : "#ffb939",
		activityType: event["Activity Type"],
		activityDetail: event["Activity Detail"],
		
	}));
}

class ScatterPlotActivity extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			originalData: null,
			data: null,
			value: false,
			mouseDown: false
		};
	}

	componentWillReceiveProps(newProp) {
		if (!this.props.activities && newProp.activities) {
			let data = getData(
				newProp.activities.slice(0, newProp.activities.length - 3)
			);
			this.setState({
				data: data,
				originalData: data
			});
		}
		if (
			newProp.selectionStart &&
			newProp.selectionEnd &&
			this.props.activities
		) {
			this.setState({
				data: this.state.originalData.filter(event => {
					return moment(
						moment(event.x).format("YYYY/MM/DD"),
						"YYYY/MM/DD"
					).isSameOrAfter(
						moment(
							moment(newProp.selectionStart).format("YYYY/MM/DD"),
							"YYYY/MM/DD"
						)
					) &&
						moment(
							moment(event.x).format("YYYY/MM/DD"),
							"YYYY/MM/DD"
						).isSameOrBefore(
							moment(
								moment(newProp.selectionEnd).format(
									"YYYY/MM/DD"
								),
								"YYYY/MM/DD"
							)
						)
						? true
						: false;
				})
			});
		}
	}

	render() {
		const { data } = this.state;
		const markSeriesProps = {
			animation: true,
			className: "mark-series-example",
			sizeType: "literal",
			seriesId: "my-example-scatterplot",
			colorType: "literal",
			data,
			onSeriesMouseOut: d =>
				this.setState({
					value: false
				}),
			onNearestXY: value =>
				this.setState({
					value: this.state.mouseDown ? false : value
				})
		};
		return (
			<div
				className="canvas-wrapper"
				onMouseDown={e =>
					this.setState({
						mouseDown: true
					})
				}
				onMouseUp={e =>
					this.setState({
						mouseDown: false
					})
				}>
				<XYPlot
					animation
					xDomain={
						this.props.drawLocation && [
							this.props.drawLocation.left,
							this.props.drawLocation.right
						]
					}
					margin={{
						top: 40,
						bottom: 50,
						left: 40,
						right: 20
					}}
					xType="time"
					yType="ordinal"
					onMouseLeave={() =>
						this.setState({
							value: false
						})
					}
					width={600}
					height={600}>
					<VerticalGridLines />
					<HorizontalGridLines />
					<XAxis
						style={{
							title: {
								fill: "#031e20"
							}
						}}
						title="Date"
					/>
					<YAxis
						style={{
							title: {
								fill: "#031e20"
							}
						}}
						title="Agents"
						orientation="left"
						position="start"
					/>
					<MarkSeries {...markSeriesProps} />
					{this.state.value ? (
						<Hint
							value={this.state.value}
							align={{
								vertical: "top",
								horizontal: "left"
							}}>
							<div className="rv-hint__content">
								<div> Agent: {this.state.value.y} </div>
								<div>
									Date:{" "}
									{new Date(
										this.state.value.x
									).toDateString() +
										" at\n" +
										new Date(
											this.state.value.x
										).toLocaleTimeString()}
								</div>{" "}
								<div>
									Activity Type:{" "}
									{this.state.value.activityType}
								</div>
								<div>
									Activity Detail:{" "}
									{this.state.value.activityDetail}
								</div>
							</div>
						</Hint>
					) : null}
					<Highlight
						onBrushEnd={area => this.props.changeDrawLocation(area)}
						onDrag={area => {
							this.props.changeDrawLocation({
								bottom:
									this.props.drawLocation.bottom +
									(area.top - area.bottom),
								left:
									this.props.drawLocation.left -
									(area.right - area.left),
								right:
									this.props.drawLocation.right -
									(area.right - area.left),
								top:
									this.props.drawLocation.top +
									(area.top - area.bottom)
							});
						}}
					/>
				</XYPlot>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectionStart: state.index.selectedPoints[0],
	selectionEnd: state.index.selectedPoints[1],
	activities: state.index.activities,
	abandoned: state.index.abandoned,
	drawLocation: state.index.drawLocation
});

export default connect(mapStateToProps, { changeDrawLocation })(
	ScatterPlotActivity
);
