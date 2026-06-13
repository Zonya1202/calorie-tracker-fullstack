import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const TODAY_STRING = new Date().toISOString().split('T')[0]

interface DateState {
  selectedDate: string
}

const initialState: DateState = {
  selectedDate: TODAY_STRING,
}

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setToday: (state) => {
      state.selectedDate = TODAY_STRING
    },
  },
})

export const { setSelectedDate, setToday } = dateSlice.actions
export default dateSlice.reducer
