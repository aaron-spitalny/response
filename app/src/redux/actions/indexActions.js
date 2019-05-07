import C from "../constants";

//This action changes the time series selected endpoints
export const changeSelectedPoints = value => dispatch => {
	dispatch({
		type: C.CHANGE_SELECTED_POINTS,
		payload: value
	});
};

export const changeDrawLocation = value => dispatch => {
	dispatch({
		type: C.CHANGE_DRAW_LOCATION,
		payload: value
	});
};


export const changeMarkDrawLocation = value => dispatch => {
	dispatch({
		type: C.CHANGE_MARK_DRAW_LOCATION,
		payload: value
	});
};


export const changeActivities = value => dispatch => {
	dispatch({
		type: C.CHANGE_ACTIVITIES,
		payload: value
	});
};


export const changeAbandoned = value => dispatch => {
	dispatch({
		type: C.CHANGE_ABANDONED,
		payload: value
	});
};
