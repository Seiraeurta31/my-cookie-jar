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
      
      //Create new group
      case 'POST': 
        try{
          const {groupCode, groupName} = req.body
          const newGroup= await db.group.createNewGroup(user._id, user.firstName, user.lastName, groupCode, groupName)
          if(newGroup == null){
            req.session.destroy()  
            return res.status(401)
          }
          return res.status(200).json(newGroup)
        }catch(error){
          return res.status(400).json({error: error.message})
        }



      //Update member role in group  
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
 

      //TO DO: Remove member from group





      //Delete group
      case 'DELETE': 

      try{
        const {groupId} = req.body
        const deletedGroup = await db.group.deleteGroup(groupId)
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