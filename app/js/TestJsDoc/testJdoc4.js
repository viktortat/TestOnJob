/**
 * Пример описание справки JDoc
 * @constructor
 * @name Todo
 * @see https://www.youtube.com/watch?v=DNRS1Bdrhtc
 *
 *
 * @file Manages the configuration settings for the widget.
 * @author Viktor Sanela
 */
var Todo = Backbone.Model.extend({

    /**
     * Определение значений по умолчанию для модели заданий
     *
     * @memberOf Todo
     * @returns {{title: string, order: *, done: boolean}}
     */
    defaults: function () {
        return {
            title: "empty todo...",
            order: Todos.nextOrder(),
            done: false
        };
    },

    /**
     * Переключение значений
     */
    toggle: function () {
        this.save({done: !this.get("done")});
    }

});

/**
 * Представление (Вид) задачи
 * @constructor
 * @name TodoView
 * @see https://www.youtube.com/watch?v=DNRS1Bdrhtc
 */
var TodoView = Backbone.View.extend({

    /**
     * Определение значений по умолчанию для модели заданий
     *
     * @memberOf TodoView
     */
    tagName: "li",

    /**
     * Устанавливаем шаблон
     */
    template: _.template($('#item-template').html()),

    /**
     * Определение прослушивыания событий
     *
     * @memberOf TodoView
     */
    events: {
        "click .toggle": "toggleDone",
        "dblclick .view": "edit",
        "click a.destroy": "clear",
        "keypress .edit": "updateOnEnter",
        "blur .edit": "close"
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('done', this.model.get('done'));
        this.input = this.$('.edit');
        return this;
    },


    toggleDone: function () {
        this.model.toggle();
    },


    edit: function () {
        this.$el.addClass("editing");
        this.input.focus();
    },


    close: function () {
        var value = this.input.val();
        if (!value) {
            this.clear();
        } else {
            this.model.save({title: value});
            this.$el.removeClass("editing");
        }
    },


    updateOnEnter: function (e) {
        if (e.keyCode == 13) this.close();
    },


    /**
     * Удаление модели
     *
     * @memberOf TodoView
     */
    clear: function () {
        this.model.destroy();
    }

});
