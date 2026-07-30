import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    color: "#adb5bd",
    size: "16",
}

export const variableSlice = createSlice({
    name: "variables",
    initialState: initialValue,
    reducers: {
        setColor: (state, action) => {
            state.color = action.payload
        },
        setSize: (state, action) => {
            state.size = action.payload
        }
    }
})

export const { setColor, setSize } = variableSlice.actions

export default variableSlice.reducer
