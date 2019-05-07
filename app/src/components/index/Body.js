import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ScatterPlotActivity from "./ScatterPlotActivity";
import TimeSerieschart from "./TimeSerieschart";
import ScatterPlotAbandoned from "./ScatterPlotAbandoned";
import { connect } from "react-redux";
import { changeDrawLocation } from "../../redux/actions/indexActions";
import Button from "@material-ui/core/Button";

class Body extends React.Component {
	render() {
		return (
			<div
				style={{
					maxWidth: 1280,
					margin: "0 auto",
					width: "100%"
				}}>
				{!this.props.activities &&
					!this.props.abandoned && (
						<div
							style={{
								marginTop: "20%",
								fontSize: "4rem",
								color: "rgba(0, 0, 0, 0.54)",
								display: "flex",
								justifyContent: "center"
							}}>
							Upload Data
						</div>
					)}
				<Grid container>
					<Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
						{this.props.activities && (
							<div
								style={{
									paddingTop: 20,
									display: "flex",
									justifyContent: "center",
									color: "rgba(0, 0, 0, 0.54)"
								}}>
								Call Data Agent Activity Data
							</div>
						)}
						<ScatterPlotActivity />
					</Grid>
					<Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
						{this.props.abandoned && (
							<div
								style={{
									paddingTop: 20,
									display: "flex",
									justifyContent: "center",
									color: "rgba(0, 0, 0, 0.54)"
								}}>
								Abandoned Call Data
							</div>
						)}
						<ScatterPlotAbandoned />
					</Grid>
					<Grid
						style={{ paddingBottom: 50 }}
						item
						xl={12}
						lg={12}
						md={12}
						sm={12}
						xs={12}>
						{(this.props.activities || this.props.abandoned) && (
							<div
								style={{
									display: "flex",
									justifyContent: "center"
								}}>
								<Button
									variant="outlined"
									onClick={() =>
										this.props.changeDrawLocation(null)
									}>
									Reset Zoom
								</Button>
							</div>
						)}
					</Grid>
					<Grid
						style={{ paddingBottom: 50 }}
						item
						xl={12}
						lg={12}
						md={12}
						sm={12}
						xs={12}>
						<TimeSerieschart />
					</Grid>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	activities: state.index.activities,
	abandoned: state.index.abandoned
});

export default connect(mapStateToProps, { changeDrawLocation })(Body);
