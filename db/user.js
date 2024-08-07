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
  return user.userGroups.map(group=> convertIdToString(group))

}


//POST: Create new user
export async function create(username, password, firstName, lastName, email) {
  if (!(username && password))
    throw new Error('Must include username and password')

  await dbConnect()

  const user = await User.create({username, password, firstName, lastName, email})

  if (!user)
    throw new Error('Error creating user')

  return user.toJSON()
}


export async function getUserInfo(userId) {

  await dbConnect()
  
  //Validate user exists
  const user = await User.findById(userId).lean()
  if (!user) return null

  //Use user group list to GET group info by group Id's
  return user

}

//POST: Join user to existing group 
export async function joinGroup(userId, userFirstName, userLastName, gCode, gName) {

  await dbConnect()

  //Find group in group database with group code and name from search
  let groupFound = await Group.find({"groupCode": gCode, "groupName": gName})
  if (!groupFound) return null

  //Check to see if user is current member of group
  const currentMember = groupFound[0].groupMembers.find(member => member.userId === userId)
  if(currentMember) return currentMember

  //Identify group id
  const groupId = groupFound[0].id

  //Add group id to the users list of groups
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: 
      { userGroups: 
        {
          groupId: groupId,
          groupName: gName
        } 
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
          memberFirstName: userFirstName,
          memberLastName: userLastName,
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
export async function leaveGroup(uId, gId) {


  //Start up database connection
  await dbConnect()
 
  //If user exists, find drink in Favorites by ID and remove it
  const user = await User.findByIdAndUpdate(
    uId,
    { $pull: { userGroups: {groupId: gId } } },
    { new: true }
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!user) return null

  const group = await Group.findByIdAndUpdate(
    gId,
    { $pull: { groupMembers: {userId: uId } } },
    { new: true }
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!group) return null



  return true
}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}
