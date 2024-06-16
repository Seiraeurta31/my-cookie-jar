import { Schema, model, models } from 'mongoose'
import groupBoothSchema from './groupBooth'
import memberSchema from './groupMember'


const GroupSchema = new Schema({
  groupCode: String,
  groupName: String,
  groupMembers: [memberSchema],
  groupBooths: [groupBoothSchema]
})


export default models.Group || model('Group', GroupSchema)