
 import { withIronSessionApiRoute } from "iron-session/next";
 import sessionOptions from "../../../config/session"
 import db from '../../../db'

 
export default withIronSessionApiRoute(
    async function handler(req, res) {
  
      if(!req.session.user)
        return res.status(401).end()
  
      const user = req.session.user
    
      switch(req.method) {
 
        //Add booth attendee
        case 'POST': 
        try{
        const {groupMemberId,  boothId }= req.body
        const addedAttendee= await db.booth.addBoothAttendee(groupMemberId, boothId)
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
        default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)