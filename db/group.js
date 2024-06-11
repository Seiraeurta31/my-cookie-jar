import Group from './models/group'
import User from './models/user'
import dbConnect from './connection'

//Create new group
export async function createNewGroup(groupNumber, groupName) {
  if (!(groupNumber && groupName))
    throw new Error('Must include group ID and group name')

  await dbConnect()

  const group = await Group.create({groupNumber, groupName})

  if (!group)
    throw new Error('Error creating group')

  return group.toJSON()
}



//GET group by ID
export async function getGroupById(userId, groupNumber) {

  await dbConnect()

  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Validate group exists
  const group = await Group.findById(groupNumber)
  if (!group) return null
  
  //Validate user is a member of the group
  const memberFound = group.groupMembers.find(member => member.memberId === userId)
  if (!group) return null

  return convertIdToString(group)
}


//TO DO: Get GroupMembers
export async function getGroupMembers(groupNumber) {

  await dbConnect()

  //Validate user exists
  const group = await Group.findById(groupNumber).lean()
  if (!group) return null

  return group.groupMembers.map(member => convertIdToString(member))
}




//Format data
export function convertIdToString({_id, ...otherProperties}) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




