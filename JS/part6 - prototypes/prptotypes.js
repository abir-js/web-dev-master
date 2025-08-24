let computer = {
    cpu: 12
}
let lenovo = {
    screen: "HD",
    __proto__: computer
}
let tomHardware = {}

console.log("lenovo" ,lenovo, lenovo.__proto__);



let genericCar = {tyres: 4}

let tesla = {
    drivers: "AI"
}

Object.setPrototypeOf(tesla, genericCar)

console.log("genericCar", Object.getPrototypeOf(tesla));