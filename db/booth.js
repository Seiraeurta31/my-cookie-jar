import Booth from './models/booth'
import Group from './models/group'
import dbConnect from './connection'

//Create new booth
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

    if (!newBooth)
    throw new Error('Error creating booth')


    //TO DO: Add booth Id to group booth list


    return newBooth.toJSON()
}


//GET: Get booth details by id
export async function getBoothById(boothId) {

  await dbConnect()

  //Validate group contains member
  // const groupApproved = validateGroupAccess (memberId, groupId)
  // if (!groupApproved ) return null

  //Get booth details by booth id
  const booth = Booth.findById(boothId)
  if (!booth) return null

  return convertIdToString(booth)
}



//GET: Get list of booth attendees
export async function getBoothAttendees(boothId) {

  await dbConnect()

  //Validate group contains member
  // const groupApproved = validateGroupAccess (memberId, groupId)
  // if (!groupApproved ) return null


  const attendeeList = Booth.attendingMembers.findById(boothId)
  if (!attendeeList) return null

  return attendeeList.map(attendee => convertIdToString(attendee))
}


//Add member to booth attendee list
export async function addBoothAttendee(groupMemberId, boothId) {

  await dbConnect()

  //If user exists, add drink to user Favorites
  const user = await Booth.findByIdAndUpdate(
    boothId,
    { $addToSet: 
      { 
        attendingMembers: groupMemberId 
      } 
    },  
    { new: true } 
  )
  //If user was not found, return null
  if (!user) return null

  //If user exists, confirm new drink was added by searching for drink in favorites by id and returning new drink
  const addedDrink = user.favoriteDrinks.find(fav => fav.cocktailDbId == drink.cocktailDbId) 

  return convertDrinkIdToString(addedDrink)
}


//PUT: Update booth information
export async function updateBoothDatails(
  boothId,
  locationName, 
  date, 
  time,
  amPm, 
  shifts,
  address,
  city,
  state,
  notes) {

  await dbConnect()

  // const groupApproved = validateGroupAccess (memberId, groupId)
  // if (!groupApproved ) return null

  //Update booth details by id
  const boothUpdated = await Booth.updateOne(
    {boothId},
    { $set: 
      { 
        "locationName": locationName, 
        "date": date, 
        "time": time,
        "amPm": amPm, 
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
export async function deleteBooth(groupId, boothId) {

  //Start up database connection
  await dbConnect()

  //If user exists, add drink to user Favorites
  const removedBooth = await Group.findByIdAndUpdate(
    boothId,
    { $pull: 
      { 
        _id: boothId
      } 
    },
    { new: true } 
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!removedBooth) return null

  //If user exists, add drink to user Favorites
  const removedGroupBooth = await Group.findByIdAndUpdate(
    groupId,
    { $pull: 
      { 
        _id: boothId
      } 
    },
    { new: true } 
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!removedBooth) return null




  
  return true
}


//Format data
export function convertIdToString({ _id, ...otherProperties }) {
  const id = _id.toString()
  return { ...otherProperties, id }
}




