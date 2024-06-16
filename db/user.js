import User from './models/user'
import Group from './models/group'
import dbConnect from './connection'


//GET: Get all user groups
export async function getUserGroups(userId) {

  await dbConnect()
  
  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Use user group list to GET group info by group Id's
  const userGroupList = user.userGroupIDs

  if (!userGroupList) return null

  return userGroupList

}


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


//POST: Create new group
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
          // name: user.name,  //Access from user table by user id
          // email: user.email,
          memberRole: 'admin'
        } 
      } 
    },    
    { new: true } 
  )
  if (!member) return null

  const userGroup = await User.findByIdAndUpdate(
    user._id,
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




//POST: Join user to existing group 
export async function joinGroup(userId,  name, email, gCode, gName) {

  await dbConnect()

  //Find group in group database with group code and name from search
  let groupFound = await Group.find({"groupCode": gCode, "groupName": gName})
  if (!groupFound) return null


  console.log("group:", groupFound[0].id)

  //Identify group id
  const groupId = groupFound[0].id

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
          userId: userId, 
          // name: name,     //Access from user table by user id
          // email: email,
          memberRole: 'admin'
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
