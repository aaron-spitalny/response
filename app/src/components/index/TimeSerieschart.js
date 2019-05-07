import React, { Component } from "react";
import { connect } from "react-redux";
import {
	XYPlot,
	XAxis,
	YAxis,
	HorizontalGridLines,
	AreaSeries,
	Highlight,
	VerticalGridLines,
	Hint,
	VerticalBarSeries
} from "react-vis";
import { changeSelectedPoints } from "../../redux/actions/indexActions";
var moment = require("moment");

function getActivityData(data) {
	return data.reduce((accum, curr) => {
		if (
			accum[moment(new Date(curr["Activity Time"])).format("YYYY/MM/DD")]
		) {
			accum[
				moment(new Date(curr["Activity Time"])).format("YYYY/MM/DD")
			].x =
				accum[
					moment(new Date(curr["Activity Time"])).format("YYYY/MM/DD")
				].x + 1;
		} else {
			accum[
				moment(new Date(curr["Activity Time"])).format("YYYY/MM/DD")
			] = {
				x: 1,
				y: moment(new Date(curr["Activity Time"])).format("YYYY/MM/DD"),
				opacity: 0.5
			};
		}
		return accum;
	}, {});
}

function getAbandonedData(data) {
	let currentDay;
	return data.reduce((accum, curr) => {
		if (
			curr["Date and Time"] &&
			!accum[
				moment(new Date(curr[["Date and Time"]])).format("YYYY/MM/DD")
			]
		) {
			accum[
				moment(new Date(curr["Date and Time"])).format("YYYY/MM/DD")
			] = {
				y: 0,
				x: moment(new Date(curr["Date and Time"])).format("YYYY/MM/DD"),
				opacity: 0.5
			};
			currentDay = moment(new Date(curr["Date and Time"])).format(
				"YYYY/MM/DD"
			);
		} else if (curr["Call Center Name"] === "Summary") {
			accum[currentDay].y = curr["Calls Abandoned"];
		}
		return accum;
	}, {});
}

class TimeSerieschart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hoveredNode: null,
			data: null,
			keys: null,
			keysReversed: null
		};
	}

	componentWillReceiveProps(newProp) {
		// if (!this.props.activities && newProp.activities) {
		// 	let data = getActivityData(
		// 		newProp.activities.slice(0, newProp.activities.length - 3)
		// 	);
		// 	this.setState({
		// 		data: Object.values(data),
		// 		keys: Object.keys(data),
		// 		keysReversed: Object.keys(data).reverse()
		// 	});
		// }
		if (!this.props.abandoned && newProp.abandoned) {
			let data = getAbandonedData(
				newProp.abandoned.slice(0, newProp.abandoned.length - 9)
			);
			this.setState({
				data: Object.values(data),
				keys: Object.keys(data),
				keysReversed: Object.keys(data).reverse()
			});
		}
		if (newProp.selectionStart && newProp.selectionEnd) {
			this.setState({
				data: this.state.data.map(event => {
					return {
						x: event.x,
						y: event.y,
						opacity:
							moment(
								moment(event.x).format("YYYY/MM/DD"),
								"YYYY/MM/DD"
							).isSameOrAfter(
								moment(
									moment(newProp.selectionStart).format(
										"YYYY/MM/DD"
									),
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
								? 1
								: 0.5
					};
				})
			});
		} else if (this.props.abandoned) {
			this.setState({
				data: this.state.data.map(event => ({
					x: event.x,
					y: event.y,
					opacity: 0.5
				}))
			});
		}
	}

	render() {
		const updateDragState = area => {
			if (area && area.right && area.left) {
				this.props.changeSelectedPoints([area.left, area.right]);
			}
		};
		return (
			<XYPlot
				width={1200}
				height={300}
				margin={margin}
				xType="ordinal"
				onMouseLeave={() => this.setState({ hoveredNode: null })}>
				<VerticalGridLines />
				<VerticalBarSeries
					onNearestXY={d =>
						this.props.selectionStart
							? this.setState({ hoveredNode: null })
							: this.setState({ hoveredNode: d })
					}
					onSeriesMouseOut={d => this.setState({ hoveredNode: null })}
					data={this.state.data}
					opacity={0.5}
					colorType="literal"
				/>
				<Highlight
					color="#ccc"
					drag
					enableY={false}
					enableX={true}
					onDrag={updateDragState}
					onDragEnd={updateDragState}
				/>
				{this.state.hoveredNode && (
					<Hint value={this.state.hoveredNode}>
						<div className="rv-hint__content">
							<div>
								<span className="rv-hint__title">Date</span>
								{": "}
								<span className="rv-hint__value">
									{this.state.hoveredNode.y}
								</span>
							</div>
							<div>
								<span className="rv-hint__title">
									# of events
								</span>
								{": "}
								<span className="rv-hint__value">
									{this.state.hoveredNode.x}
								</span>
							</div>
						</div>
					</Hint>
				)}
				<XAxis
					title="Date"
					style={{
						title: { fill: "#031e20" },
						ticks: { paddingBottom: 20 }
					}}
					tickLabelAngle={-90}
					height={200}
				/>
				<YAxis
					style={{ title: { fill: "#031e20" } }}
					title="#Abandoned"
				/>
			</XYPlot>
		);
	}
}

const margin = { top: 40, bottom: 50, left: 80, right: 20 };

const mapStateToProps = state => ({
	selectionStart: state.index.selectedPoints[0],
	selectionEnd: state.index.selectedPoints[1],
	activities: state.index.activities,
	abandoned: state.index.abandoned
});

export default connect(mapStateToProps, { changeSelectedPoints })(
	TimeSerieschart
);
