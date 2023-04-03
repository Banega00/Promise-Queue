import { PromiseQueue } from "./promise-queue";

//This file is an example of usage of the PromiseQueue class

const requests = [];

for (let i = 1; i <= 50; i++) {
    requests.push(i);
}

// const requests = new Array(50).fill({x:1,y:2,z:3});//initialize array of 50 objects


//Define a function that simulates a request which needs between 1 and 8 seconds to complete
const sendRequest = async (data:any) => {
    return new Promise((resolve, reject) => {
        //random number between 1 and 8
        const rand = Math.floor(Math.random() * (8 - 2 + 1) + 1)*1000

        setTimeout(() => {
            resolve(data)
        }, rand)  
    })
}

//Initialize the PromiseQueue class
const promiseQueue = new PromiseQueue(
    requests.map(reqData => sendRequest.bind(null, {data: reqData})), 
    {
    maxNumberOfConcurrentRequests: 5,
    onSuccess: (response:{x:number,y:number,z:number}) => {
        console.log('SUCCESS')
        console.log(response)
    },
    onFailure: (error:any) => {
        console.log('ERROR')
        console.log(error)
    }
});

//Start the queue

//iife
(async () => {
    console.log("POCEO")

    await promiseQueue.start();
    
    console.log("ZAVRSIO")
})()

