import Booth from './models/booth'
import Group from './models/group'
import dbConnect from './connection'

//Create new booth
export async function createNewBooth(
  groupId, 
  locationName, 
  date, 
  time,
  amPM, 
  shifts,
  address,
  city,
  state,
  notes) {

  console.log(groupId, 
    locationName, 
    date, 
    time,
    amPM, 
    shifts,
    address,
    city,
    state,
    notes)

  if (!(
    groupId &&
    locationName && 
    date && 
    time &&
    amPM && 
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
      amPM, 
      shifts,
      address,
      city,
      state,
      notes })

  if (!newBooth)
  throw new Error('Error creating booth')

  const gId = groupId

    //TO DO: Add booth Id to group booth list
    const groupBooth = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: 
        { groupBooths: 
          {
            boothId: newBooth._id,
            locationName: newBooth.locationName,
            date: newBooth.date,
            time: newBooth.time,
            amPM: newBooth.amPM,
            numShifts: newBooth.shifts
          } 
        } 
      },   
      { new: true } 
    )

    if (!groupBooth) return null
  


  return newBooth.toJSON()
}






//GET: Get booth details by id
export async function getBoothById(boothId) {

  await dbConnect()


  //Get booth details by booth id
  const booth = await Booth.findById(boothId).lean()
  if (!booth) return null



  return convertIdToString(booth)
}


//GET: Get list of booth attendees
export async function getBoothAttendees(boothId) {

  await dbConnect()


  const attendeeList = Booth.attendingMembers.findById(boothId)
  if (!attendeeList) return null

  return attendeeList.map(attendee => convertIdToString(attendee))
}


//PUT: Update booth information
export async function updateBoothDetails(
  bId,
  locationName, 
  date, 
  time,
  amPM, 
  shifts,
  address,
  city,
  state,
  notes) {

  await dbConnect()

  //Update booth details by id
  const boothUpdated = await Booth.findByIdAndUpdate(
    bId,
    { $set: 
      { 
        "locationName": locationName, 
        "date": date, 
        "time": time,
        "amPM": amPM, 
        "shifts": shifts,
        "address": address,
        "city": city,
        "state": state,
        "notes": notes
      }
    },   
    { new: true } 
  )
  if (!boothUpdated) return null

  return boothUpdated
}



//Add member to booth attendee list
export async function addBoothAttendee(firstName, lastName, groupMemberId, boothId) {

  await dbConnect()

  //If user exists, add drink to user Favorites
  const attendee = await Booth.findByIdAndUpdate(
    boothId,
    { $addToSet: { attendingMembers: {memberId: groupMemberId, memberFirstName: firstName, memberLastName: lastName}} }, 
    { new: true } 
  )
  //If user was not found, return null
  if (!attendee) return null

  return attendee
}


//Remove member from booth attendee list
export async function removeBoothAttendee(attendeeId, boothId) {

  await dbConnect()

  //If user exists, add drink to user Favorites
  const removedAttendee = await Booth.findByIdAndUpdate(
    boothId,
    { $pull: 
      { 
        attendingMembers: {_id: attendeeId } 
      } 
    },
    { new: true } 
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!removedAttendee) return null
  return true
}




//Delete: Delete a booth
export async function deleteBooth(groupId, bId) {

  //Start up database connection
  await dbConnect()

  //Remove booth 
  const boothRemoved = await Booth.deleteOne(
    {_id: bId},
    { new: true }
  )

  const groupBoothRemoved = await Group.findByIdAndUpdate(
    groupId,
    { $pull: { groupBooths: {boothId: bId } } },
    { new: true }
  )

  if (!boothRemoved) return null
  
  return true
}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




