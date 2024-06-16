import { Schema, model, models } from 'mongoose'


const boothAttendeeSchema = new Schema({
  memberId: String, 
})


export default boothAttendeeSchema