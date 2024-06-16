import { Schema, model, models } from 'mongoose'


const boothAttendeeSchema = new Schema({
  userId: String, 
})


export default boothAttendeeSchema