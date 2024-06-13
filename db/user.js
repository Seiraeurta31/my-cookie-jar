import User from './models/user'
import Group from './models/group'
import dbConnect from './connection'
import { getGroupById,  } from './group'

//POST: Create new user
export async function create(username, password, name, email) {
  if (!(username && password))
    throw new Error('Must include username and password')

  await dbConnect()

  const user = await User.create({username, password, name, email})

  if (!user)
    throw new Error('Error creating user')

  return user.toJSON()
}

//GET: Get all user groups
export async function getUserGroups(userId) {

  await dbConnect()
  
  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Use user group list to GET group info by group Id's
  const userGroups = user.userGroupIDs.map(group => getGroupById(userId, group))

  return userGroups

}

//POST: Add user to group 
export async function joinGroup(userId, gCode, gName) {

  await dbConnect()

  //Find group in group database with group code and name from search
  const groupFound = await Group.find({"groupCode": gCode, "groupName": gName})
  if (!groupFound) return null

  //Identify group id
  const groupId = groupFound.id

  //Add group id to the users list of groups
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: 
      { 
        "userGroupIDs": groupId 
      } 
    },   
    { new: true } 
  )
  if (!user) return null

  //Add user information to member list in group
  const group = await Group.findByIdAndUpdate(
    groupId,
    { $addToSet: 
      { groupMembers: 
        {
          memberId: userId, 
          memberRole: 'member'
        } 
      } 
    },    
    { new: true } 
  )
  if (!group) return null

  return group
}

//DELETE: Remove user from group
export async function leaveGroup(userId, groupId) {

  //Start up database connection
  await dbConnect()
 
  //If user exists, find drink in Favorites by ID and remove it
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: 
      { 
        userGroupIDs: {_id: id} 
      } 
    },   
    { new: true } 
  )
  if (!user) return null

  //Add user information to member list in group
  const group = await Group.findByIdAndUpdate(
    groupId,
    { $pull: 
      { groupMembers: 
        {
          _id: id
        } 
      } 
    },    
    { new: true } 
  )
  if (!group) return null

  return true
}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}
