import { Schema, model, models } from 'mongoose'


const boothAttendeeSchema = new Schema({
  userId: String, 
  memberFirstName: String,
  memberLastName: String,
})


export default boothAttendeeSchema