let userName = {
    firstName: "abir",
    isloggedin: true
}

// console.log(userName);
// console.log(typeof userName)

let user = {
    "first name": "Abir"
}

user.lastName = "Bhattacharjee"

// console.log(user["first name"]);
// console.log(user["lastName"]);


let today = new Date()
// console.log(today.getDate())


//Array
let heroes = [ "a", "b", "c" , true]
let fakeHeroes = [...heroes]   /* hard copy */
heroes.pop()

console.log(heroes);
console.log(fakeHeroes);