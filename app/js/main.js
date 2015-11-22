/*
 /!**
 * Вызов функции
 * @param a слгаемое 1
 * @param b слгаемое 2
 * @returns {*} сумма
 *!/
 var funcAdd =
 function (a, b) {
 console.log(this);
 return a + b;
 };
 console.log(funcAdd(4, 8));
 */
/*======================================================

 /!**
 * Шаблон вызова метода
 * @type {{info: string, func: MyObj.func}}
 *!/
 var MyObj = {
 info: 'вызов метода',
 func: function(a,b){
 console.log(this);
 return a+b;
 }
 };
 console.log(MyObj.func(4,8));
 */

/*======================================================









 /*
 var incredible = 'world';
 console.log(incredible);

 function test(){
 //console.log(incredible);
 //will see 'incredible'
 var incredible = 'no magic1';
 console.log(incredible);
 }
 test();
 console.log(incredible);
 */


/**
 * Паттерн-Модуль
 */
var MyObj = (function () {
    /**
     * Приватный метод
     * @returns {string}
     */
    var funcPrivate = function () {
        //console.log(this);
        return 'Приватный метод';
    };

    return {
        /**
         * Публичный метод
         * @returns {*}
         */
        funcPublic: function () {
            //console.log(this);
            return a1 + b1;
        },

        getPublic: function (a1, b1) {
            //console.log(this);
            var that = this;   //кешированый объект

            var helperFunc = function (a1, b1) {
                //console.log(this);
                console.info(that);
                that.multiply = a1 * b1;
            };
            helperFunc(a1, b1);

            //console.log(helperFunc(a1, b1));
            return a1 + b1;
        },
        getPrivate: funcPrivate
    }
})();


console.log(MyObj.getPrivate());
console.log('--------------------------');
console.log(MyObj.getPublic(4, 8));


/*

 var person = {
 name:'Иванов',
 age: 26,
 inn: 7421234338,
 getName: function(){
 return ''+this.age+this.test;
 }
 };
 console.log(person);
 */






/*
 var arr = [3,6];
 var add = function(a,b){
 console.log(this.func(10,3));
 return a+b;
 };

 var sum = add.apply(MyObj,arr)
 console.log(sum);
 */
/*
 var Constr = {

 };

 new Constr();
 */













































