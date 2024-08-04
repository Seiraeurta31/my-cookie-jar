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
            amPM,
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
            amPM,
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
            amPM, 
            shifts,
            address,
            city,
            state,
            notes
          } = req.body

          const newBooth= await db.booth.updateBoothDetails( 
            boothId,
            locationName, 
            date, 
            time,
            amPM, 
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


      //Delete booth
      case 'DELETE': 
        try{
          const {groupId, boothId} = req.body
          const deletedBooth = await db.booth.deleteBooth(groupId, boothId)
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