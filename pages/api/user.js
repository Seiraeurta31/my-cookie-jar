import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const {_id: userId} = req.session.user
    const { name: name} = req.session.user
    const { email: email} = req.session.user


  //API Routes/SECRETARY to handle requests to DB  
    switch(req.method) {


      //Create new group
      case 'POST': 
        try{
          const {groupCode, groupName} = req.body
          const addedDrink= await db.group.createNewGroup(user, groupCode, groupName)
          if(addedDrink == null){
            req.session.destroy()  
            return res.status(401)
          }
          return res.status(200).json(addedDrink)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

      
      //Join a group
      case 'POST': 
        try{
          const {groupCode, groupName} = req.body
          const addedGroup= await db.user.joinGroup(userId, name, email, groupCode, groupName)
          if(addedGroup == null){
            req.session.destroy()  
            return res.status(401)
          }
          return res.status(200).json(addedGroup)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

        
      //Leave a group
      case 'DELETE': 
      try{
        const groupToLeave = req.body
        const memberRemoved = await db.user.leaveGroup(userId, groupToLeave.id)
        if(memberRemoved == null){
          req.session.destroy()
          return res.status(401)
        }
        return res.status(200).json(memberRemoved)
      }catch(error){
        return res.status(400).json({error: error.message})
      }

      // 
      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)