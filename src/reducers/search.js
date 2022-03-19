const initialState = "india";
const setsearch = (state = initialState, action) => {
  switch (action.type) {
    case "search":
      // const { data } = action.payload;
      return action.payload;
    default:
      return state;
  }
};
export default setsearch;
