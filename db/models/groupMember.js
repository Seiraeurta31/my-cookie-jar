import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  userId: String,
  memberName: String,
  memberRole: String
})


export default memberSchema