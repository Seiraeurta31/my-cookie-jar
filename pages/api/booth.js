import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const user = req.session.user
  
    switch(req.method) {
      
      //Create new booth
      case 'POST': 
        try{
          const {
            groupId, 
            locationName, 
            date, 
            time,
            amPm, 
            shifts,
            address,
            city,
            state,
            notes
          } = req.body

          const newBooth = await db.booth.createNewBooth( 
            groupId, 
            locationName, 
            date, 
            time,
            amPm, 
            shifts,
            address,
            city,
            state,
            notes)

          if(newBooth == null){
            req.session.destroy()  
            return res.status(401).json({error: "Unable to create new booth"})
          }

          
          return res.status(200).json(newBooth)
        }catch(error){
          return res.status(400).json({error: error.message})
        }


      //Update booth information  
      case 'PUT': 
        try{
          const {
            boothId,
            locationName, 
            date, 
            time,
            amPm, 
            shifts,
            address,
            city,
            state,
            notes
          } = req.body

          const newBooth= await db.group.updateBoothDatails( 
            boothId,
            locationName, 
            date, 
            time,
            amPm, 
            shifts,
            address,
            city,
            state,
            notes)

          if(newBooth == null){
            req.session.destroy()  
            return res.status(401)
          }
          return res.status(200).json(newBooth)
        }catch(error){
          return res.status(400).json({error: error.message})
        }


      //Add booth attendee
      case 'POST': 
      try{
        const { boothId, groupMemberId }= req.body
        const addedAttendee= await db.drink.addBoothAttendee(boothId, groupMemberId)
        if(addedAttendee == null){
          req.session.destroy()  
          return res.status(401)
        }
        return res.status(200).json(addedAttendee)
      }catch(error){
        return res.status(400).json({error: error.message})
      }  

      //Remove booth attendee
      case 'DELETE': 
        try{
          const { boothId, attendeeId } = req.body
          const deletedAttendee = await db.group.removeBoothAttendee(boothId, attendeeId)
          if(deletedAttendee == null){
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json(deletedAttendee)
        }catch(error){
          return res.status(400).json({error: error.message})
        }




      //Delete booth
      case 'DELETE': 
        try{
          const boothToRemove = req.body
          const deletedBooth = await db.group.boothGroup(boothToRemove.id)
          if(deletedBooth == null){
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json(deletedBooth)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)