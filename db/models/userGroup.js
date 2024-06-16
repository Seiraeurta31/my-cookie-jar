import { Schema, model, models } from 'mongoose'


const userGroupSchema = new Schema({
  groupId: String,
  groupName: String
})


export default userGroupSchema