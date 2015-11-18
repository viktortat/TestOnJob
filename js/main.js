
var person = {
    name:'Иванов',
    age: 26,
    inn: 7421234338,
    getName: function(){
        return ''+this.age+this.test;
    }
};
 console.log(person);

var func =
    function(a,b){
    console.log(this);
    return a+b;
};
 console.log(func(4,8));    //Вызов функции

/*
var MyObj = {
    info: 'вызов метода',
    func: function(a,b){
        console.log(this);
        return a+b;
    }
};
console.log(MyObj.func(4,8));
*/

/**
 *Паттерн-Метод
 */
var MyObj=(function(){
    //'паттерн Метод';
    var funcPrivate= function(){
        console.log(this);
        return 'Приватный метод';
    };

    return{
         getPublic: function(a1,b1){
            console.log(this);
            var that = this;
            var helperFunc = function(a1,b1){
                console.log(this);
                console.info(that);
                that.multiply=a1*b1;
            };
            helperFunc(a1,b1);
            return a1+b1;
        },
        getPrivate: funcPrivate
    }
})();

console.log(MyObj.getPrivate());
console.log('--------------------------');
console.log(MyObj.getPublic(4,8));

var arr = [3,6];
var add = function(a,b){
    console.log(this.func(10,3));
    return a+b;
};

var sum = add.apply(MyObj,arr)
console.log(sum);

/*
var Constr = {

};

new Constr();
*/













































