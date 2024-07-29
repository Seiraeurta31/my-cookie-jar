import { Schema, model, models } from 'mongoose'


const groupBoothSchema = new Schema({
  boothId: String, 
  locationName: String,
  date: String,
  time: String,
  amPM: String,
  numShifts: String

})


export default groupBoothSchema