import C from "../constants";
import { initialState } from "../initialState";

//This reducer changes the index object
export const index = (state = initialState.index, action) => {
	switch (action.type) {
		case C.CHANGE_SELECTED_POINTS:
			return {
				...state,
				selectedPoints: action.payload
			};
		case C.CHANGE_SELECTED_POINTS:
			return {
				...state,
				markDrawLocation: action.payload
			};
		case C.CHANGE_ACTIVITIES:
			return {
				...state,
				activities: action.payload
			};
		case C.CHANGE_ABANDONED:
			return {
				...state,
				abandoned: action.payload
			};
		case C.CHANGE_DRAW_LOCATION:
			return {
				...state,
				drawLocation: action.payload
			};
		default:
			return state;
	}
};
