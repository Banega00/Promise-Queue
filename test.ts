export class PromiseQueue{
    queue:Promise<any>[];
    maxNumberOfConcurrentRequests = 10;
    functions: Function[];
    i = 0;
    active = false;
    onSuccess: Function | undefined;
    onFailure: Function | undefined;
    constructor(
        functions: Function[],
        config: {  
            maxNumberOfConcurrentRequests?: number,
            onSuccess?: (response:any) => void,
            onFailure?: (error:any) => void
        }){
        this.queue = []
        if(config.maxNumberOfConcurrentRequests && config.maxNumberOfConcurrentRequests > 0){
            this.maxNumberOfConcurrentRequests = config.maxNumberOfConcurrentRequests
        }else{
            this.maxNumberOfConcurrentRequests = 10;
        }

        this.onSuccess = config.onSuccess;
        this.onFailure = config.onFailure;

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
        .then((response:any) => {
            if(this.onSuccess){
                this.onSuccess(response);
            }

            this.i++;
            if(this.i >= this.functions.length && this.active) return;

            this.asyncFunctionWrapper(this.functions[this.i], this.i)
        })
        .catch((err:any) => {
            if(this.onFailure){
                this.onFailure(err);
            }

            this.i++;

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

promiseQueue.start();


