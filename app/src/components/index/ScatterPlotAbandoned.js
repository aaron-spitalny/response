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
import Button from "@material-ui/core/Button";
import { changeDrawLocation } from "../../redux/actions/indexActions";

function getAbandonedData(data) {
	let currentHour;
	let hours = [];
	for (let i = 0; i < data.length; i++) {
		if (data[i]["Date and Time"]) {
			if (currentHour && currentHour.y > 0) {
				currentHour.callCenter = JSON.stringify(currentHour.callCenter);
				hours.push(currentHour);
			}
			currentHour = {
				x: new Date(data[i]["Date and Time"]).getTime(),
				y: data[i]["Calls Abandoned"],
				color: "b63295",
				size: 5,
				callCenter: [
					{
						name: data[i]["Call Center Name"],
						abandoned: data[i]["Calls Abandoned"],
						queued: data[i]["Calls Queued"]
					}
				]
			};
		} else if (data[i]["Call Center Name"] !== "Summary") {
			currentHour.callCenter.push({
				name: data[i]["Call Center Name"],
				abandoned: data[i]["Calls Abandoned"],
				queued: data[i]["Calls Queued"]
			});
			currentHour.y += data[i]["Calls Abandoned"];
		}
	}
	return hours;
}

class ScatterPlotAbandoned extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drawMode: 0,
			data: null,
			originalData: null,
			data: null,
			value: false,
			mouseDown: false
		};
	}

	componentWillReceiveProps(newProp) {
		if (!this.props.abandoned && newProp.abandoned) {
			let data = getAbandonedData(
				newProp.abandoned.slice(0, newProp.abandoned.length - 9)
			);
			this.setState({
				data: data,
				originalData: data
			});
		}
		if (newProp.selectionStart && newProp.selectionEnd) {
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
		const { colorType } = this.state;
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
					yType="linear"
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
						title="#Abandoned"
						orientation="left"
						position="start"
					/>
					<MarkSeries
						animation={true}
						className={"mark-series-example"}
						sizeType="literal"
						seriesId="my-example-scatterplot"
						colorType="literal"
						data={this.state.data}
						onSeriesMouseOut={d =>
							this.setState({
								value: false
							})
						}
						onNearestXY={value =>
							this.setState({
								value: this.state.mouseDown ? false : value
							})
						}
					/>
					{this.state.value ? (
						<Hint
							value={this.state.value}
							align={{
								vertical: "top",
								horizontal: "left"
							}}>
							<div className="rv-hint__content">
								<div> # of calls abandoned: {this.state.value.y} </div>
								<div>
									Date:{" "}
									{new Date(
										this.state.value.x
									).toDateString() +
										" at\n" +
										new Date(
											this.state.value.x
										).toLocaleTimeString()}
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
	abandoned: state.index.abandoned,
	drawLocation: state.index.drawLocation
});

export default connect(mapStateToProps, { changeDrawLocation })(
	ScatterPlotAbandoned
);
