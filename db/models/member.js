import { Schema, model, models } from 'mongoose'


const memberSchema = new Schema({
  userId: String, //userId
  // name: String, // user name 
  // email: String, //user email
  memberRole: String
})


export default memberSchema