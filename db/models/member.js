import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  userId: String, //userId
  memberRole: String
})


export default memberSchema