import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const {_id: userId} = req.session.user


  //API for group database requests
    switch(req.method) {
      
    //Create new group    
      case 'POST': 
        try{
          const drinkToAdd = req.body
          const addedDrink= await db.drink.addFavoriteDrink(userId, drinkToAdd)
          if(addedDrink == null){
            req.session.destroy()  
            return res.status(401)
          }
          return res.status(200).json(addedDrink)
        }catch(error){
          return res.status(400).json({error: error.message})
        }
      case 'DELETE': 
      try{
        const drinkToRemove = req.body
        const deletedDrink = await db.drink.removeFavoriteDrink(userId, drinkToRemove.id)
        if(deletedDrink == null){
          req.session.destroy()
          return res.status(401)
        }
        return res.status(200).json(deletedDrink)
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