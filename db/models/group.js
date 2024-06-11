import { Schema, model, models } from 'mongoose'
import boothSchema from './booth'
import memberSchema from './member'


const GroupSchema = new Schema({
  groupNumber: String,
  groupName: String,
  groupMembers: [memberSchema],
  groupBooths: [boothSchema]
})


export default models.Group || model('Group', GroupSchema)