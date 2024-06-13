import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  memberId: String, //userId
  memberRole: String
})


export default memberSchema