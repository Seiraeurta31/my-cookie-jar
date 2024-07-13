import { Schema, model, models } from 'mongoose'
import boothAttendeeSchema from './boothAttendee'

const BoothSchema = new Schema({
  groupId: String,
  locationName: String,
  date: String,
  time: String,
  amPM: String,
  shifts: Number,
  address: String,
  city: String,
  state: String,
  notes: String,
  attendingMembers: [boothAttendeeSchema]
})

export default models.Booth || model('Booth', BoothSchema)