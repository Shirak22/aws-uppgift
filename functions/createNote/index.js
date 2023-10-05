const {sendResponse} = require('../../responses/index');
const { nanoid } = require('nanoid'); 
const { db } = require('../../services/db');
const {verifyToken } = require('../../services/verifyToken')



module.exports.handler = async (event,context ) => {
    const {content} = JSON.parse(event.body); 
    let user; 
  try {
    user = await verifyToken(event); 
  } catch (error) {
    return sendResponse(401,{success:false, message: 'Invalid token' }); 
  }



  try {
      if(content.length > 110) { return sendResponse(401,{success:false, message:"The content must be less than 110 chars"})}
      else {
        let note = {
          id: nanoid(),
          userId: user.userId,
          username: user.username,
          content,
          color: `hsl(${Math.floor(Math.random() * 360)},100%,80%)`
        }
      
        await db.put({
          TableName: 'memo-notes',
          Item: note
        }).promise();
         return sendResponse(200,{success:true, note,})
      }
  } catch (error) {
    return sendResponse(500,{success:false,message:'Faild to create a note' })
  }

};





 

