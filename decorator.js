/**
 * 从头部开始 
 * 首先__decorate会检查是否已经存在__decorate，
 * 检查的方法是检查this上的__decorator是否存在，
 * 在浏览器端，全局的this指代window对象，在node端，
 * this指代module.exports，module.exports的默认值是{}，
 * 一个空对象，由此判断，这里的__decorate被赋值为后面那个函数。
 * 这个函数接收4个参数:
 * 1.decorators 其类型为一个数组，表示应用到目标方法的所有装饰器
 * 2.target 其类型为一个对象，是该方法所属类的原型对象
 * 3.key 其类型为字符串，是该方法的名称
 * 4.desc 其类型也为一个对象，是目标方法的属性描述符
 */

//装饰器，类的原型对象，方法名，属性描述符
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    /**
     * 在开头，定义了三个变量，c，r，d
     * 1.c为参数的个数，后文通过判断参数的个数来进行传参
     * 2.r为目标方法的属性描述符或该方法所属类的原型对象
     * 3.d为具体的装饰器
     */

    // 通过arguments.length直接获取到参数个数
    var c = arguments.length, 
        // 参数个数<3为目标方法，>3为属性描述符
        // 通过划分3这个参数个数来进行分别传值，
        // 小于3就是<=2，通常只有装饰器数组和该方法所属类的原型对象被传递进来，
        // 此时的r为原型对象，大于3也就是有4个参数，r通过Object.getOwnPropertyDescriptor被赋值为该方法的属性描述符
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        //装饰器
        // d没有被明确的赋初始值，之后，会通过遍历装饰器数组对其进行赋值，现在知道d是一个具体的装饰器就行了
        d;

    // 检测新特性
    // 这里是检测是否已经支持新特性了，该新特性是能够支持JS元数据反射的API
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function"){
        r = Reflect.decorate(decorators, target, key, desc);

    }
    //无新特性
    else {
        //遍历装饰器个数
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]){
                console.log(d(target, key));
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }

    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// 一开始声明的修饰器,并没有被改动，原样保存了下来
function methodDeractor(msg) {
    console.log("修饰器运行",msg)
    return function (target, name, descriptor) {
        console.log("修饰被调用",target)
        console.log("修饰被调用",name)
        console.log("修饰被调用",descriptor,descriptor.value)
        descriptor.value = function () { return console.log(msg); };
    };
}

/**
 * 这里对类多做了一件事情，那就是执行装饰器，
 * 这里调用了上面声明的__decorate函数，
 * 传入四个参数，装饰器列表，该类的原型，
 * 目标方法的名称，还有就是目标方法的属性描述符，
 * 该属性描述符在此被传递为null，而真正的传值在__decorate内部，也就是r的值。
 */
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.sayHello = function () {
        console.log("sayHello()", this.name);
    };
    __decorate([
        methodDeractor('@methodDeractor')
    ], Person.prototype, "sayHello",null);
    return Person;
}());
var Joy = new Person('Joy');
Joy.sayHello();
