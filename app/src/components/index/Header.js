import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CloudUpload from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
var XLSX = require("xlsx");
import {
	changeActivities,
	changeAbandoned
} from "../../redux/actions/indexActions";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.handleActivityFile = this.handleActivityFile.bind(this);
		this.handleAbandonedFile = this.handleAbandonedFile.bind(this);
	}

	handleAbandonedFile(event) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = new Uint8Array(e.target.result);
			var workbook = XLSX.read(data, { type: "array" });
			var sheet_name_list = workbook.SheetNames;
			this.props.changeAbandoned(
				XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
			);
		}.bind(this);
		reader.readAsArrayBuffer(event.target.files[0]);
	}

	handleActivityFile(event) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = new Uint8Array(e.target.result);
			var workbook = XLSX.read(data, { type: "array" });
			var sheet_name_list = workbook.SheetNames;
			this.props.changeActivities(
				XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
			);
		}.bind(this);
		reader.readAsArrayBuffer(event.target.files[0]);
	}
	render() {
		const classes = this.props.classes;
		return (
			<AppBar position="static" className={classes.appBar}>
				<div
					style={{
						height: 70,
						maxWidth: 1280,
						margin: "0 auto",
						width: "100%"
					}}>
					<Toolbar>
						<Typography
							className={classes.grow}
							variant="h6"
							style={{
								color: "#fff",
								marginLeft: "1%",
								marginTop: 6
							}}>
							Shift Optimization
						</Typography>
						<IconButton
							style={{
								marginRight: 0,
								color: "#fff"
							}}
							onClick={e => this.setState({ open: true })}>
							<CloudUpload />
						</IconButton>
					</Toolbar>
				</div>
				<Dialog
					maxWidth={"md"}
					onClose={() => this.setState({ open: false })}
					open={this.state.open}>
					<DialogTitle>Data Upload</DialogTitle>
					<DialogContent>
						<DialogContentText style={{ padding: 10 }}>
							{" "}
							Activity Detail:{" "}
							<input
								onChange={this.handleActivityFile}
								accept=".xlsx, .xls, .csv"
								multiple
								type="file"
							/>
						</DialogContentText>
						<DialogContentText style={{ padding: 10 }}>
							{" "}
							Abandoned Call:{" "}
							<input
								onChange={this.handleAbandonedFile}
								accept=".xlsx, .xls, .csv"
								multiple
								type="file"
							/>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => this.setState({ open: false })}
							color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</AppBar>
		);
	}
}

const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	appBar: {
		backgroundColor: "#00AFD1",
		boxShadow: "0 2px 4px 0 rgba(0,0,0,.1)",
		height: 70
	}
});

Header.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { changeActivities, changeAbandoned })(
	withStyles(styles)(Header)
);
