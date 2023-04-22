import axios from "axios";

const headers = {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
};

const postOptions = {
    method: "POST",
    url: process.env.REACT_APP_RAPID_API_URL,
    params: { base64_encoded: "true", fields: "*" },
    headers: headers,
    data: {}
};

const getOptions = {
    method: "GET",
    url: process.env.REACT_APP_RAPID_API_URL,
    params: { token: "", base64_encoded: "true", fields: "*" },
    headers: headers
};


// compile source code and return token for single test case
const getToken = async (data : any)  => {

    let token = "";

    postOptions.url = process.env.REACT_APP_RAPID_API_URL;
    postOptions.data = data;

    await axios
    .request(postOptions)
    .then(function (response) {
        token  = response.data.token;
    })
    .catch((err) => {
        console.log(err);
        
        return err.response ? err.response.data : err;
        // setProcessing(false);
    });
    return token;
};

// compile source code and return token for multiple test cases
const getTokenBatch =  async (data : any) => {
   
    postOptions.url = process.env.REACT_APP_RAPID_API_URL_BATCH;
    postOptions.data = { submissions: data };

    let token = "";
    
    await axios
        .request(postOptions)
        .then(function (response) {
             token = response.data.map((item: any) => item.token).join(",");

        })
        .catch((err) => {
            console.log(err);
            return err.response ? err.response.data : err;

        });

        return token;
    };


// check token status for submitted test case
const checkTokenStatus = async (token: any) => {

    getOptions.url = process.env.REACT_APP_RAPID_API_URL + "/" + token;
    getOptions.params = { token: "", base64_encoded: "true", fields: "*" };

    try {
        const response = await axios.request(getOptions);
        
        return response.data;
        
    } catch (err : any) {
        return err.response ? err.response.data : err;
    }
   
};

// check token status for all test cases
const checkTokenStatusBatch = async (token : any) => {

    getOptions.url = process.env.REACT_APP_RAPID_API_URL_BATCH;
    getOptions.params = { token: token, base64_encoded: "true", fields: "*" };

    try {
        const response = await axios.request(getOptions);
        return response.data;
        
    }
    catch (err : any) {
        return err.response ? err.response.data : err;
    }

};

export const compile = {
getToken,
getTokenBatch,
checkTokenStatus,
checkTokenStatusBatch,

}