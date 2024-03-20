const array1 = [1, 2, 3, 4, 5];
const array2 = [3, 4, 5, 6, 7];

for (let i = 0; i < array1.length; i++) {
    let foundMatch = false
    for (let j = 0; j < array2.length; j++) {
        if (array1[i] === array2[j]) {
            foundMatch = true
            console.log("Matching value found:", array1[i]);
            break
        }
    }
    if (!foundMatch) {
        console.log('not matching', array1[i])
    }
}
