const sendResponse = (statusCode, response ) => {
    return {
        statusCode: statusCode,
        headers: {
            "Content-type":"application/json",
        },
        body:JSON.stringify(response) 


    }
}


module.exports = {sendResponse}