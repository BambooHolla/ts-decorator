/**
 * 方法修饰器
 * @param msg 传入的值
 */
function methodDeractor(msg:string):Function{
    return function(target:any, name:string, descriptor:PropertyDescriptor){
        descriptor.value = () => console.log(msg)
    }
}

class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    @methodDeractor('@methodDeractor')
    sayHello() {
        console.log("sayHello()",this.name)
    }
}

const Joy = new Person('Joy')
Joy.sayHello()