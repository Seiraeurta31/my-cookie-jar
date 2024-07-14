import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  userId: String,
  memberFirstName: String,
  memberLastName: String,
  memberRole: String
})


export default memberSchema