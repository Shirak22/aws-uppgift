const {sendResponse} = require('../../responses/index');
const bcrypt   = require('bcryptjs');
const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');


module.exports.handler = async (event, context ) => {
    const {username, password} = JSON.parse(event.body); 
    const TableName = 'memo-notes-users'; 
    

    
    try {
     const params = {
        TableName,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username
          }
     }

     const user = await db.query(params).promise();

        if(user.Items.length > 0){
            if(username.toLowerCase() === user.Items[0].username && bcrypt.compareSync(password,user.Items[0].password)){
                const token = jwt.sign({username,userId:user.Items[0].userId},process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                let userResponse = {
                    username,
                    userId: user.Items[0]?.userId
                }
                
                return sendResponse(200,{success:true,token, user:userResponse}); 
            }else {
                return sendResponse(200,{success:false, message:'Please check your password or username! '}); 
            }
        }else {
            return sendResponse(200,{success:false, message:'Please check your password or username! u'}); 
        }


     
    } catch (error) {
        console.log(error);
        return sendResponse(500,'Something went wrong! ')
    }
}