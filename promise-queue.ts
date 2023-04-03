export class PromiseQueue{
    queue:Promise<any>[];
    maxNumberOfConcurrentRequests = 10;
    functions: Function[];
    i = 0;
    active = false;
    onSuccess: Function | undefined;
    onFailure: Function | undefined;
    done: number;
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

        this.done = 0;
    }

    public async start(){
        this.active = true;
        for(this.i = 0; this.i< this.maxNumberOfConcurrentRequests-1 && this.i<this.functions.length; this.i++){
            this.queue.push(this.asyncFunctionWrapper(this.functions[this.i], this.i))
        }

        this.i--;

        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (this.done >= this.functions.length) {
                    clearInterval(intervalId);
                    resolve(null);
                }
            }, 100); // Check every 100ms
        });
    }

    public stop(){
        this.active=false;
    }

    private async asyncFunctionWrapper(fn: Function, i:number){
        if(!this.active) return;

        await fn()
        .then((response:any) => {
            this.done++;

            if(this.onSuccess){
                this.onSuccess(response);
            }

            this.i++;
            if(this.i >= this.functions.length && this.active){
               return this.stop();
            }

            this.queue.push(this.asyncFunctionWrapper(this.functions[this.i], this.i))
        })
        .catch((err:any) => {
            this.done++;

            if(this.onFailure){
                this.onFailure(err);
            }

            this.i++;

            if(this.i >= this.functions.length && this.active){
                return this.stop();
            }

            this.queue.push(this.asyncFunctionWrapper(this.functions[this.i], this.i));
        })
    }
}




