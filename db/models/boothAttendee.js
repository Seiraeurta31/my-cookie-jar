import { Schema, model, models } from 'mongoose'


const boothAttendeeSchema = new Schema({
  memberId: String, 
  memberFirstName: String,
  memberLastName: String,
})


export default boothAttendeeSchema