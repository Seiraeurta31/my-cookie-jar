import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const user = req.session.user


  //API Routes/SECRETARY to handle requests to DB  
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

          const newBooth= await db.group.createNewBooth( 
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


      //TO DO: Update booth information  
      case 'PUT': 
      try{
        const {memberId, newMemberRole, group} = req.body
        const memberUpdated= await db.group.updateMemberRole(memberId, newMemberRole, group)
        if(memberUpdated == null){
          req.session.destroy()  
          return res.status(401)
        }
        return res.status(200).json(memberUpdated)
      }catch(error){
        return res.status(400).json({error: error.message})
      }

      //Delete group
      case 'DELETE': 
      try{
        const groupToRemove = req.body
        const deletedGroup = await db.group.deleteGroup(groupToRemove.id)
        if(deletedGroup == null){
          req.session.destroy()
          return res.status(401)
        }
        return res.status(200).json(deletedGroup)
      }catch(error){
        return res.status(400).json({error: error.message})
      }

      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)