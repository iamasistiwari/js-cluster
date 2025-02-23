let sum= 0;
const target = 10_000_000_000_0;

const starttime = Date.now()
for (let i = 1; i <= target; i++) {
  sum += i;
}
const endTime = Date.now()
console.log(`Time taken ${endTime - starttime}`)
console.log("Sum is ",sum)