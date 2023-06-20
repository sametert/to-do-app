const TaskController = (function(){

    //private
    //Task create constructor
    const Task = function(id,value) {
        this.id = id;
        this.value = value;
    }

    const data = {
        tasks : [],
        selectedTask: null
    }


    //public
    return {
        getTasks : function() {
            return data.tasks;
        },
        getData : function() {
            return data;
        }
    }

})();



const UIController = (function(){
    const Selectors = {
        taskInput : "inputToDo"
    }

    return {
        getSelectors : function(){
            return Selectors;
        }
    }

})();



const Main = (function(Task,UI){

    const selector = UI.getSelectors();

    const eventController = function() {
        document.getElementById(selector.taskInput).addEventListener("keypress", getTask);
    }

    const getTask = (e)=> {
        if(e.keyCode == "13") {
            console.log("hjsa")
        }
    }


    return {
        init : function() {
            console.log("app starting...");
            eventController();
            
        }
    }

})(TaskController,UIController);
Main.init();