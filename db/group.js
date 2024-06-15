import Group from './models/group'
import User from './models/user'
import dbConnect from './connection'

//Create new group
export async function createNewGroup(user, groupCode, groupName) {
  if (!(groupCode && groupName))
    throw new Error('Must include group ID and group name')

  await dbConnect()

  const group = await Group.create({ groupCode, groupName })

  if (!group)
    throw new Error('Error creating group')

  const groupId = group._id //identify new group by id

  const member = await Group.findByIdAndUpdate( //add first user to group member list/default to admin
    groupId,
    { $addToSet: 
      { groupMembers: 
        {
          userId: user._id, 
          memberRole: 'admin'
        } 
      } 
    },    
    { new: true } 
  )
  if (!member) return null

  return group.toJSON()
}

//GET group details by id
export async function getGroupById(userId, groupId) {

  await dbConnect()

  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Validate group exists
  const group = await Group.findById(groupId)
  if (!group) return null

  //Validate user is a member of the group
  const memberFound = group.groupMembers.find(member => member.userId === userId)
  if (!memberFound) return null

  return convertIdToString(group)
}

//TO DO: Get list of group members
export async function getGroupMembers(groupId) {

  await dbConnect()

  //Validate user exists
  const group = await Group.findById(groupId).lean()
  if (!group) return null

  return group.groupMembers.map(member => convertIdToString(member))
}

//TO DO: Update member role
export async function updateMemberRole(memberId, newMemberRole, groupId) {

  await dbConnect()

  const group = await Group.findById(groupId).lean()

  //Update sepecific member role in group using member id
  const memberUpdated = await Group.updateOne(
    {"groupMembers._id": memberId},
    { $set: 
      { 
        "groupMembers.$.memberRole": newMemberRole
      }
    },   
    { new: true } 
  )
  if (!memberUpdated) return null

  return memberUpdated
}





//Delete a group
export async function deleteGroup(groupId) {

  //Start up database connection
  await dbConnect()
 
  //If user exists, find drink in Favorites by ID and remove it
  const user = await Group.findByIdAndUpdate(
    groupId,
    { $pull: { _id: groupId } },
    { new: true }
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!user) return null
  return true
}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




