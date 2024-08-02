import Group from './models/group'
import User from './models/user'
import dbConnect from './connection'


//POST: Create new group
export async function createNewGroup(uId, uFirstName, uLastName, groupCode, groupName) {
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
          userId: uId, 
          memberFirstName: uFirstName,
          memberLastName: uLastName,
          memberRole: 'Admin'
        } 
      } 
    },    
    { new: true } 
  )
  if (!member) return null

  const userGroup = await User.findByIdAndUpdate(
    uId,
    { $addToSet: 
      { userGroups: 
        {
          groupId: groupId,
          groupName: groupName
        } 
      } 
    },   
    { new: true } 
  )
  if (!userGroup) return null

  return group.toJSON()
}




//GET group details by id
export async function getGroupById(groupId) {

  await dbConnect()

  //Validate group exists
  const group = await Group.findById(groupId).lean() 
  if (!group) return null

  if (group) 
    
  return convertIdToString(group)
}




//TO DO: Get list of group members
export async function getGroupMembers(groupId) {

  await dbConnect()

  //Validate user exists
  const group = await Group.findById(groupId).lean()
  if (!group) return null

  //TO DO: Stringify data to convert to JSON to be read from database
  return group.groupMembers.map(member => convertIdToString(member))
}




export async function getMemberById(groupId, memberId) {

  await dbConnect()

  //Check for user, if none, return null, otherwise proceed to find drink by user.
 const memberList = await getGroupMembers(groupId)
 if (!memberList) return null

 const member = memberList.find(mem => mem.id === memberId)
  if (!member) return null

  return member
}


export async function getMemberByUserId(groupId, userId) {

  await dbConnect()

  //Check for user, if none, return null, otherwise proceed to find drink by user.
 const memberList = await getGroupMembers(groupId)
 if (!memberList) return null

 const member = memberList.find(mem => mem.userId === userId)
  if (!member) return null

  return member
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

  //Find group by ID and remove it
  const group = await Group.deleteOne(
    {_id: groupId},
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




