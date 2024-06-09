import { Schema, model, models } from 'mongoose'


const GroupSchema = new Schema({
  groupId: String,
  groupName: String,
  groupMembers: [String],
  groupBooths: [String]
})


export default models.Group || model('Group', GroupSchema)