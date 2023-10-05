const {sendResponse} = require('../../responses/index');
const { nanoid } = require('nanoid'); 
const { db } = require('../../services/db');
const bcrypt = require('bcryptjs'); 



module.exports.handler = async (event,context ) => {
  const { username , password} = JSON.parse(event.body);
  const TableName = 'memo-notes-users'; 
    try {
        const Hash_salt = bcrypt.genSaltSync(12);


        let user = {
            TableName,
            Item: {
                username:username.toLowerCase(),
                password: bcrypt.hashSync(password,Hash_salt),
                userId:nanoid(),
                role: 'user'
            }
        }
        let params = {
            TableName,
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username':username 
            }
        }
        const checkUser = await db.query(params).promise();
        if(checkUser.Items.length > 0){
            return sendResponse(401,{success:false, message: 'Already Exists! ,Please try another username'})
        }else {
            await db.put(user).promise();
            return sendResponse(200,{success:true,message:'The user has been created successfully! ',user: {
                username:user.Item.username,
                userId:user.Item.userId,
            }});
        }
     
    } catch (error) {
        console.log(error);
        return sendResponse(500, { success: false, error })
    }
};










// if(getUser.Item){
//     return sendResponse(200,'Please try another username');
// }else {
    
//    const newUser =  await db.put({
//         TableName:TableName,
//         Item: {
//            username:username,
//            userId: nanoid(),
//            password: bcrypt.hashSync(password,Hash_salt),
//            role:'user'
//         },
//     }).promise(); 
//     return sendResponse(200, {createdUser: newUser.Item});

// }