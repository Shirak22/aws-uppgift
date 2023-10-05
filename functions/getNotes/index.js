

// const params = {
//   TableName: 'YourPostsTable',
//   KeyConditionExpression: 'userId = :userId',
//   ExpressionAttributeValues: {
//       ':userId': 'TheUserIdOfTheLoggedInUser'
//   }
// };





const {sendResponse} = require('../../responses/index');
const { db } = require('../../services/db');
const {verifyToken } = require('../../services/verifyToken')



module.exports.handler = async (event,context ) => {
    
  let TableName =  'memo-notes';
  let user; 
  try {
    user = await verifyToken(event); 
  } catch (error) {
    return sendResponse(401,{success:false, message: 'Invalid token' }); 
  }

  
  try {
   const parameters = {
    TableName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId':user.userId,
    }
   }
    
  const getUserNotes = await db.query(parameters).promise();

  return sendResponse(200,{success:true, user:user.username, allUserNotes:getUserNotes}); 
  } catch (error) {
    return sendResponse(500,{success:false,message:'Faild to get notes' })
  }

};













