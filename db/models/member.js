import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  memberId: String,
  memberName: String,
  memberEmail: String,
  memberRole: String
})


export default memberSchema