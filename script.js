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
        },
        addTask : function(taskValue) {
            let id;
            if(data.tasks.length == 0) {
                id = 1;
            }else if(data.tasks.length > 0){
                id = data.tasks.length + 1;
            }

            const newTask = new Task(id,taskValue);
            data.tasks.push(newTask);
            return newTask;
        },
        getTaskById : function(id) {
            let task = null;

            data.tasks.forEach(function(item){
                if(item.id == id) {
                    task = item;
                }
            });

            return task;
        },
        setCurrentTask : function(obj){
            data.selectedTask = obj;
        },
        updateTask : function(selectedInput) {
            let newTask = null;

            // console.log(id);
            // if(data.selectedTask.id == id) {
            //     console.log(selectedInput.value);
            //     data.selectedTask.value = selectedInput.value;
            // }

            data.tasks.forEach(function(task){
                //aynı tr de olduğumuzu kontrol ettik
                if(task.id == data.selectedTask.id) {
                   task.value = selectedInput.value;
                   newTask = task;
                }
            });

            return newTask;
        }
    }

})();



const UIController = (function(){
    const Selectors = {
        taskInput : "inputToDo",
        form : "form",
        addTask : ".addTask",
        item : ".item",
        inputTask : ".inputTask",
        edit : ".edit"   
    }

    return {
        getSelectors : function(){
            return Selectors;
        },
        addTask : function(task) {
           let tag = `
           <div class="item" id="${task.id}">
                <button class="check" type="button">
                    <i class="fa-sharp fa-regular fa-circle"></i>
                </button>
                <input type="text" class="inputTask" value="${task.value}" disabled id="${task.id}">    
            </div>    
            `;

            document.querySelector(Selectors.addTask).insertAdjacentHTML("beforeend",tag);          
        },
        clearInputs : function() {
            document.getElementById(Selectors.taskInput).value = "";
        },
        showButons : function() {
            const selectedTask = TaskController.getData().selectedTask;
           
            const tr = document.querySelectorAll(Selectors.item)

            tr.forEach(function(element){
                if(element.getAttribute("id") == selectedTask.id) {
                      if(!(element.querySelector(".butonController"))) {
                        let butonShow = `
                            <div class="butonController">
                                <button class="edit" type="button" id="${selectedTask.id}">
                                    <i class="fa-sharp fa-regular fa-pen-to-square"></i>
                                </button>
                                <button class="delete" type="button">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="cancel" type="button">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>        
                        `;
                        element.insertAdjacentHTML("beforeend",butonShow);
                    };
                    element.querySelector("input").disabled = false;
                }
            });
        },
        updateTask : function(newObj) {
            let yeniGorev = null;
            let items = document.querySelectorAll(Selectors.item);
            items.forEach(function(item){               
                if(item.getAttribute("id") == newObj.id) {
                    item.children[1].value = newObj.value;
                    yeniGorev = item;
                }
            });
            return yeniGorev;
        },
        editState : function(state) {
            state.children[2].remove();
        } 
    }

})();



const Main = (function(Task,UI){

    const selector = UI.getSelectors();

    const eventController = function() {
        document.getElementById(selector.form).addEventListener("submit", getTask);

        //show button
        document.querySelector(selector.addTask).addEventListener("click",showButon);     
    }

    const getTask = (e)=> {
        e.preventDefault();
        const inputValue = document.getElementById(selector.taskInput).value;

        //input'un içi boş olmaması lazım. Boş olarak submit etmek istemiyoruz.
        if(inputValue !== "") {
            //add Task
            const addTask = Task.addTask(inputValue);

            //ui task
            UI.addTask(addTask);

            UI.clearInputs();
        } 
    }

    const showButon = (e)=> {
        if(e.target.classList.contains("inputTask")) {
            const id = e.target.getAttribute("id");

            //get selected task
            const task = Task.getTaskById(id);
            
            //set current task
            Task.setCurrentTask(task);

            UI.showButons();

            //save changes buton
            document.querySelector(selector.edit).addEventListener("click",saveChanges);
        }
    }

    //save changes button
    const saveChanges = function() {

      
        const editBtn   = document.querySelector(selector.edit);
        const editBtnId = editBtn.getAttribute("id");
        const newInput  = editBtn.parentElement.parentElement.children[1];
        // console.log(newInput);

        const newObj = Task.updateTask(newInput);
       
        const state = UI.updateTask(newObj);
       
        UI.editState(state);

     



        
    }



    return {
        init : function() {
            console.log("app starting...");
            eventController();
            
        }
    }

})(TaskController,UIController);
Main.init();
