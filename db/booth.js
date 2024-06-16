import Booth from './models/booth'
import Group from './models/group'
import dbConnect from './connection'

//Create new group
export async function createNewBooth(
    groupId, 
    locationName, 
    date, 
    time,
    amPm, 
    shifts,
    address,
    city,
    state,
    notes) {

    if (!(
        groupId &&
        locationName && 
        date && 
        time &&
        amPm && 
        shifts &&
        address &&
        city &&
        state))
        throw new Error('Must include all * fields')

    await dbConnect()

    const newBooth = await Booth.create({ 
        groupId, 
        locationName, 
        date, 
        time,
        amPm, 
        shifts,
        address,
        city,
        state,
        notes })

    if (!group)
    throw new Error('Error creating group')

    return newBooth.toJSON()
}


//GET group details by id
export async function getBoothById(boothId) {

  await dbConnect()

  //Get booth details by booth id
  const booth = Booth.findById(boothId)
  if (!booth) return null

  return convertIdToString(booth)
}



//GET list of booth attendees
export async function getBoothAttendees(memberId, groupId, boothId) {

  await dbConnect()

  //Validate group contains member
  const group = validateGroupAccess (memberId, groupId)
  if (!group ) return null


  const attendeeList = Booth.attendingMembers.findById(boothId)
  if (!attendeeList) return null

  const attendeeDetails = attendeeList.map()

  return group.groupBooths.attendingMembers.map(attendee => convertIdToString(attendee))
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





export async function validateGroupAccess (memberId, groupId) {

    //Get group info by id
    const group = await Group.find({"_id": groupId, "groupMembers.memberId": memberId })
    if (!group ) return null
  
    return group

}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




