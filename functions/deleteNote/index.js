
const {sendResponse} = require('../../responses/index');
const { db } = require('../../services/db');
const {verifyToken } = require('../../services/verifyToken')


module.exports.handler = async (event) => {
  let TableName =  'memo-notes';
  let id  = event.pathParameters?.id; 
  let user; 
  try {
    user = await verifyToken(event); 
  } catch (error) {
    return sendResponse(401,{success:false, message: 'Invalid token' }); 
  } 


  try {
    let params = {
      TableName,
      Key:{
        userId:user.userId,
        id : id 
      }
    }

    const getNote = await db.get(params).promise(); 
    console.log(getNote.Item);
    if(getNote.Item){
      await db.delete(params).promise(); 
      return sendResponse(200,{success:true, message:`The Note with id:${id} has been deleted successfully!  `});
    }else {
      return sendResponse(404,{success:false, message:`The note not found , This note belongs to another user`});
    }
    

  } catch (error) {
    return sendResponse(500,{success:false,message:'Faild to delete note' })
  }
};





