# Promise Queue
This project demonstrates usage of Promise Queue for executing asynchronous tasks as efficient as possible.

Promise Queue works by setting maximum number of tasks that can be executing concurrently at every moment.

![Queue Diagram](/assets/Screenshot%20from%202023-03-30%2012-44-40.png)

This approach is different from executing tasks in batches, because when executing tasks in batches, one waits for all requests in a batch to complete before sending the next batch. In this approach, when one request is completed, the next request from the queue is initiated, so we always have maximum utilization of requests, but not more requests in processing than the upper limit.

## Usage example:
Imagine you have a server that can process at most 5 requests at the time. You can send 5 by 5 requests but this approach would be much slower than using Promise Queue from this project because it does not utilize server as much as Promise Queue

## Usage
1. Initialize Promise Queue 
```ts
const promiseQueue = new PromiseQueue(functions, config);
```
2. Functions argument
functions are simply array of async functions that will be executed concurrently.

3. Config argument (optional)

Config argument is javascript object which consists of three optional properties. 

- maxNumberOfConcurrentRequests - (self explained)
- onSuccess - callback function that is being called once for every async function after its successful execution.
- onFailure - callback function that is being called once for every async function after error occurs.

## Notes
- Check index.ts file as an example of PromiseQueue usage
- promiseQueue.start() and promiseQueue.stop() are methods for starting and stopping tasks execution