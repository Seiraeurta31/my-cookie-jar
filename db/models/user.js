import { Schema, model, models } from 'mongoose'
import userGroupSchema from './userGroup'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200
  },
  firstName: String,
  lastName: String,
  email: String,
  userGroups: [userGroupSchema]
})

// hashes the password before it's stored in mongo
UserSchema.pre('save', async function(next) {
  if (this.isNew)
    this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default models.User || model('User', UserSchema)