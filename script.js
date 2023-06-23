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
        updateTask : function(selectedInput,value) {
            let newTask = null;

            data.tasks.forEach(function(task){
                //aynı tr de olduğumuzu kontrol ettik
                if(task.id == data.selectedTask.id) {
                   task.value = value;
                   newTask = task;
                }
            });
            return newTask;
        },
        deleteTask : function(selectedTask) {
            data.tasks.forEach(function(element,index){
                if(element.id == selectedTask.id) {
                    data.tasks.splice(index,1);
                }
            });
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
        edit : ".edit",
        delete : ".delete",
        cancel : ".cancel", 
        checkBtn : ".check",
        iTag : ".fa-sharp"
    }

    return {
        getSelectors : function(){
            return Selectors;
        },
        addTask : function(task) {
           let tag = `
           <div class="item" id="${task.id}">
                <button class="check btn" type="button">
                    <i class="fa-sharp fa-regular fa-circle check"></i>
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
           
            const tr = document.querySelectorAll(Selectors.item);
            const addTask = document.querySelector(Selectors.addTask);

            tr.forEach(function(element){
                if(element.getAttribute("id") == selectedTask.id) {
                    //addTask class'ının içindeki rowlara(trlere) sadece bir kez butonlar gösterilmeli.
                    if(!(addTask.querySelector(".butonController"))) {
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
                    } 
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
        },
        deleteTask : function(item) {
            item.remove();
        },
        cancelButon : function(butonCtrl,item) {
            item.children[1].disabled = true;
            butonCtrl.remove();
        },
        // checkCtrl : function(tag){
        //     if(tag.classList.contains("btn")) {
        //         tag.innerHTML = '<i class="fa-sharp fa-regular fa-circle-check"></i>';
        //         const inputTag = tag.nextElementSibling;
        //         inputTag.setAttribute("style","text-decoration:line-through;");
        //     }else if(tag.classList.contains("fa-sharp")) {
        //         console.log("hello")
        //     }
        //     // if(btn) {
        //     //     btn.innerHTML = '<i class="fa-sharp fa-regular fa-circle-check"></i>';
        //     //     const inputTag = btn.children[0];
        //     //     inputTag.setAttribute("style","text-decoration:line-through;");
        //     // }else if(i) {
        //     //     i.setAttribute("class","fa-sharp fa-regular fa-circle-check");
        //     //     const inputTag = btn.children[0];
        //     //     inputTag.setAttribute("style","text-decoration:line-through;");
        //     // }
             
            
        // },
        disabledCtrl : function(item) {
            if(item.querySelector(".butonController")) {
                item.children[1].disabled = false;
            }else {
                item.children[1].disabled = true;
            }
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

           
            // document.querySelector(selector.addTask).addEventListener("click",checkButon);
        }  
    }


    //check button
    // const checkButon = function(e) {
    //     if(e.target.classList.contains("check")){
    //         if(e.target.classList.contains("btn")) {
    //             const btn = document.querySelector(selector.checkBtn);
    //             UI.checkCtrl(btn);
    //         }else if(e.target.classList.contains("fa-sharp")) {
    //             const i = document.querySelector(selector.iTag);
    //             UI.checkCtrl(i);
    //         }
            
    //     }
    // }

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

            //delete buton
            document.querySelector(selector.delete).addEventListener("click",deleteButon);

            //cancel button
            document.querySelector(selector.cancel).addEventListener("click",cancelButon);
        }
    }

   

    //save changes button
    const saveChanges = function() {   
        const editBtn   = document.querySelector(selector.edit);

        //input text kısmı
        const newInput  = editBtn.parentElement.parentElement.children[1];

        //tr
        const item = editBtn.parentElement.parentElement;

        const newObj = Task.updateTask(newInput,newInput.value);
       
        const state = UI.updateTask(newObj);
       
        UI.editState(state);
        UI.disabledCtrl(item);
    }


    //delete button
    const deleteButon = function() {
        const selectedTask = Task.getData().selectedTask;
        Task.deleteTask(selectedTask);
        
        const item = document.querySelector(selector.delete).parentElement.parentElement;
        UI.deleteTask(item);

    }

    //cancel button
    const cancelButon = function() {
        const butonController = document.querySelector(selector.cancel).parentElement;
        const item = butonController.parentElement;
        UI.cancelButon(butonController,item);
    }

     

    



    return {
        init : function() {
            console.log("app starting...");
            eventController();        
        }
    }

})(TaskController,UIController);
Main.init();
