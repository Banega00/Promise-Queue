export class PromiseQueue{
    queue:Promise<any>[];
    maxNumberOfConcurrentRequests = 10;
    functions: Function[];
    i = 0;
    active = false;
    constructor(
        functions: Function[],
        config: {  
            maxNumberOfConcurrentRequests?: number,

        }){
        this.queue = []
        if(config.maxNumberOfConcurrentRequests && config.maxNumberOfConcurrentRequests > 0){
            this.maxNumberOfConcurrentRequests = config.maxNumberOfConcurrentRequests
        }else{
            this.maxNumberOfConcurrentRequests = 10;
        }

        this.functions = functions;
    }

    public start(){
        this.active = true;
        for(this.i = 0; this.i< this.maxNumberOfConcurrentRequests && this.i<this.functions.length; this.i++){
            this.queue.push(this.asyncFunctionWrapper(this.functions[this.i], this.i))
        }
    }

    public stop(){
        this.active=false;
    }

    private async asyncFunctionWrapper(fn: Function, i:number){
        if(!this.active) return;

        await fn()
        .then((res:any) => {
            this.i++;
            if(this.i >= this.functions.length && this.active) return;

            this.asyncFunctionWrapper(this.functions[this.i], this.i)
        })
        .catch((err:any) => {
            this.i++

            if(this.i >= this.functions.length && this.active) return;

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

const promiseQueue = new PromiseQueue(requests.map(reqData => sendRequest.bind(null,reqData.x, reqData.y, reqData.z)), {
    maxNumberOfConcurrentRequests: 10
})

promiseQueue.start();

new Promise((resolve, reject) => {

    setTimeout(() => {
        promiseQueue.stop();
        resolve(0);
    }, 3)  
})
