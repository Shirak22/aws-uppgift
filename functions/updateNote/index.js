
const {sendResponse} = require('../../responses/index');
const { db } = require('../../services/db');
const {verifyToken } = require('../../services/verifyToken'); 


module.exports.handler = async (event,context) => {
  const {content} = JSON.parse(event.body);
  let TableName =  'memo-notes';
  let id  = event.pathParameters?.id; 

  //checking the JWT if its valid the code will continue otherwise it will throw error
  let user; 
  try {
    user = await verifyToken(event); 
  } catch (error) {
    return sendResponse(401,{success:false, message: 'Invalid token' }); 
  } 


  try {
    const params = {
      TableName,
      Key: {
        userId:user.userId,
        id:id
      },
    }
    let note = {
      ...params,
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'SET content = :content',
      ExpressionAttributeValues: {
        ':content': content
      }

    }

    const getNote = await db.get(params).promise();
      if(getNote.Item){
        console.log(getNote.Item);
        await db.update(note).promise();
        return sendResponse(200,{success:true, message: 'The content has been successfuly updated! '});

      }else {
        return sendResponse(404,{success:false, message: 'The note note found in this profile  '});
      }

  } catch (error) {
    return sendResponse(404,{success:false, message: 'No such note '})
    
  }


};  

// var params = {
//   TableName: 'table_name',  // Din DynamoDB tabell
//   Key: {
//       'key_attribute_name': 'key_value'  // Nyckeln för objektet du vill uppdatera
//   },
//   ExpressionAttributeNames: {
//       '#attr1': 'attribute1'  // Namnen på attributen du vill uppdatera
//   },
//   ExpressionAttributeValues: {
//       ':val1': 'new_value'  // De nya värdena för attributen
//   },
//   UpdateExpression: 'SET #attr1 = :val1',  // Uppdateringsuttrycket
//   ReturnValues: 'UPDATED_NEW'  // Vilka värden som ska returneras
// };

// docClient.update(params, function(err, data) {
//   if (err) {
//       console.error("Unable to update. Error:", JSON.stringify(err, null, 2));
//   } else {
//       console.log("Update succeeded:", data);
//   }
// });