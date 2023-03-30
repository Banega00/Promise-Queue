import { PromiseQueue } from "./promise-queue";

//This file is an example of usage of the PromiseQueue class

const requests = new Array(50).fill({x:1,y:2,z:3});//initialize array of 50 objects


//Define a function that simulates a request which needs between 3 and 8 seconds to complete
const sendRequest = async (x:any,y:any,z:any) => {
    return new Promise((resolve, reject) => {
        //random number between 3 and 8
        const rand = Math.floor(Math.random() * (8 - 3 + 1) + 3)*1000

        setTimeout(() => {
            resolve({x,y,z})
        }, rand)  
    })
}

//Initialize the PromiseQueue class
const promiseQueue = new PromiseQueue(
    requests.map(reqData => sendRequest.bind(null,reqData.x, reqData.y, reqData.z)), 
    {
    maxNumberOfConcurrentRequests: 10,
    onSuccess: (response:{x:number,y:number,z:number}) => {
        console.log('SUCCESS')
        console.log(response)
    },
    onFailure: (error:any) => {
        console.log('ERROR')
        console.log(error)
    }
})

//Start the queue
promiseQueue.start();