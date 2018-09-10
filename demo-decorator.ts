/**
 * 各类装饰器的使用
 * 1、类装饰器（7）
 * 2、方法装饰器（54）
 * 3、访问器装饰器（86）
 * 4、属性装饰器（126）
 * 5、参数装饰器（165）
 */

/**
 * 类装饰器（使用频率较低）
 * 类装饰器在类声明之前被声明（紧靠着类声明）。 
 * 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。
 * 类装饰器不能用在声明文件中( .d.ts)，也不能用在任何外部上下文中（比如declare的类）。
 * 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
 * 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
 * 注意：如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。
 */

// 1、密封构造函数以及原型 
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter_1 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

// 2、重构构造函数
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter_2 {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter_2("world"));


/**
 * 方法装饰器
 * 方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
 * 1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * 2、成员的名字。
 * 3、成员的属性描述符。
 * 注意：如果代码输出目标版本小于ES5，属性描述符将会是undefined。
 * 如果方法装饰器返回一个值，它会被用作方法的属性描述符。
 * 注意：如果代码输出目标版本小于ES5返回值会被忽略。
 */

// 下面是一个方法装饰器（@enumerable）的例子，应用于Greeter类的方法上
// 这里的@enumerable(false)是一个装饰器工厂。 当装饰器 @enumerable(false)被调用时，它会修改属性描述符的enumerable属性。
 function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Greeter_3 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}

/**
 * 访问器装饰器
 * 访问器装饰器声明在一个访问器的声明之前（紧靠着访问器声明）。 
 * 访问器装饰器应用于访问器的属性描述符并且可以用来监视，修改或替换一个访问器的定义。 
 * 访问器装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。
 * 注意：TypeScript不允许同时装饰一个成员的get和set访问器。
 * 取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。
 * 这是因为，在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。
 * 访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
 * 1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * 2、成员的名字。
 * 3、成员的属性描述符。
 * 注意：如果代码输出目标版本小于ES5，Property Descriptor将会是undefined。
 * 如果访问器装饰器返回一个值，它会被用作方法的属性描述符。
 * 注意：如果代码输出目标版本小于ES5返回值会被忽略。
 */

//  下面是使用了访问器装饰器（@configurable）的例子，应用于Point类的成员上：
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}

class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}


/**
 * 属性装饰器
 * 属性装饰器声明在一个属性声明之前（紧靠着属性声明）。 属性装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。
 * 属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
 * 1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * 2、成员的名字。
 * 注意：属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 
 * 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。
 * 返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。
 */

// 我们可以用它来记录这个属性的元数据，如下例所示：
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}


/**
 * 参数装饰器
 * 参数装饰器声明在一个参数声明之前（紧靠着参数声明）。 
 * 参数装饰器应用于类构造函数或方法声明。 参数装饰器不能用在声明文件（.d.ts），重载或其它外部上下文（比如 declare的类）里。
 * 参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
 * 1、对于静态函数，对成员来说是类的构造于实例成员是类的原型对象。
 * 2、成员的名字。
 * 3、参数在函数参数列表中的索引。
 * 注意：参数装饰器只能用来监视一个方法的参数是否被传入。
 * 参数装饰器的返回值会被忽略。
 */

// 下例定义了参数装饰器（@required）并应用于Greeter_4类方法的一个参数：
// @required装饰器添加了元数据实体把参数标记为必需的。 @validate装饰器把greet方法包裹在一个函数里在调用原先的函数前验证函数参数。
// 注意：这个例子使用了reflect-metadata库。 查看 元数据了解reflect-metadata库的更多信息。
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value;
    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }

        return method.apply(this, arguments);
    }
}

class Greeter_4 {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    @validate
    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}
