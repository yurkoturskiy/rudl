import { curry } from "ramda";

/* Create dispatcher */
const action = (dispatch, type, payload) => dispatch({ type, payload });

export default curry(action);
