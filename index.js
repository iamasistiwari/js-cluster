import cluster from "cluster"
import os from "os"
import { once } from "events";

const target = 10_000_000_000_0;
const totalCPUs = os.cpus().length
const chunkSize = Math.floor(target/totalCPUs)

if(cluster.isPrimary){
    let starttime = Date.now()
    let totalsum = 0
    let completedWorker = 0
    console.log(`Number of cpus is ${totalCPUs}`)
    for(let i = 0; i < totalCPUs; i++){
        console.log("Forked");
        const worker = cluster.fork()
        const start = i * chunkSize
        const end = (i === totalCPUs -1) ? target: (i+1)*chunkSize-1

        // setTimeout(() => {
        //     worker.send({ start, end });
        // }, 100)
        worker.on('listening', () =>{
            worker.send({ start, end });
        })

        
        worker.on('message', (msg) => {
            if(msg.type === 'data'){
                totalsum += Number(msg.partialSum)
                completedWorker++
    
                if(completedWorker === totalCPUs){
                    const endTime = Date.now()
                    console.log(`Total time taken ${endTime - starttime}`)
                    console.log(`Total sum is ${totalsum}`)
                    process.exit(1)
                }
            }
        })
        await once(worker, "message");
        worker.send({ start, end });

    }
    
}else{
    process.on("message", (msg) => {
        const {start, end} = msg;
        let partialSum = 0
        for(let i = start; i <= end; i++){
            partialSum += i
        }
        process.send({type: 'data' ,partialSum: partialSum.toString()})
    })
    process.send("GOOD")
}