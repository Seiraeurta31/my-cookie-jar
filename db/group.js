import Group from './models/group'
import User from './models/user'
import dbConnect from './connection'


//POST: Create new group
export async function createNewGroup(uId, groupCode, groupName) {
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
          memberRole: 'admin'
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
export async function getGroupById(userId, groupId) {

  await dbConnect()

  console.log("get group by id activated")

  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Validate group exists
  const group = await Group.findById(groupId)
  if (!group) return null


   console.log("group found: ", group)
  //Validate user is a member of the group
  const memberFound = group.groupMembers.find(member => member.userId === userId)
  if (!memberFound) return null

  console.log("Member Found: ", memberFound)

  return group.toJSON()
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

  console.log("groupId: ", groupId)

  //Find group by ID and remove it
  const group = await Group.deleteOne(
    {_id: groupId},
    { new: true }
  )
  if (!group) return null


  //TO DO: Get all group members and remove group from the user table

  // const user = await User.update(
  //   "userGroups",
  //   { $pull: 
  //     { 
  //       groupId: groupId
  //     } 
  //   },   
  //   { new: true } 
  // )
  // if (!user) return null


  return true

}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




