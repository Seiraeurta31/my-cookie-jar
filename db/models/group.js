import { Schema, model, models } from 'mongoose'
import BoothSchema from './booth'
import memberSchema from './member'


const GroupSchema = new Schema({
  groupCode: String,
  groupName: String,
  groupMembers: [memberSchema],
  groupBooths: [String]
})


export default models.Group || model('Group', GroupSchema)