export class PromiseQueue{
    queue:Promise<any>[];
    maxNumberOfConcurrentRequests = 10;
    functions: Function[];
    i = 0;
    constructor(functions: Function[], maxNumberOfConcurrentRequests?: number){
        this.queue = []
        if(maxNumberOfConcurrentRequests && maxNumberOfConcurrentRequests > 0){
            this.maxNumberOfConcurrentRequests = maxNumberOfConcurrentRequests
        }else{
            this.maxNumberOfConcurrentRequests = 10;
        }

        for(this.i = 0; this.i< this.maxNumberOfConcurrentRequests && this.i<functions.length; this.i++){
            this.queue.push(this.asyncFunctionWrapper(functions[this.i], this.i))
        }

        this.functions = functions;
    }

    private async asyncFunctionWrapper(fn: Function, i:number){
        await fn()
        .then((res:any) => {
            console.log(`Request ${i} completed`)
            this.i++;
            if(this.i >= this.functions.length) return;

            this.asyncFunctionWrapper(this.functions[this.i], this.i)
        })
        .catch((err:any) => {
            console.log(`Request ${i} failed`)
            console.log(err)
            this.i++

            if(this.i >= this.functions.length) return;

            this.asyncFunctionWrapper(this.functions[this.i], this.i)
        })
    }
}

const requests = new Array(50).fill({x:1,y:2,z:3});


const sendRequest = async (x:any,y:any,z:any) => {
    return new Promise((resolve, reject) => {
        //random number between 3 and 8
        const rand = Math.floor(Math.random() * (8 - 3 + 1) + 3)*1000

        setTimeout(() => {
            resolve({x,y,z})
        }, rand)  
    })
}

const promiseQueue = new PromiseQueue(requests.map(reqData => sendRequest.bind(null,reqData.x, reqData.y, reqData.z)), 10)