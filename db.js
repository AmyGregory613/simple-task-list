
//some sample data
const taskData = [
    {id:0, task: "Call mom"},
    {id:1, task: "Cook dinner"}
 ];
 
 //the database reference
 let db;
 
 //initializes the database
 function initDatabase() {
 
     //create a unified variable for the browser variant
     window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
     window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
 
     window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
 
         //if a variant wasn't found, let the user know
     if (!window.indexedDB) {
             window.alert("Your browser doesn't support a stable version of IndexedDB.")
     }
 
    //attempt to open the database
     let request = window.indexedDB.open("tasks", 1);
     request.onerror = function(event) {
         console.log(event);
     };
 
    //map db to the opening of a database
     request.onsuccess = function(event) { 
         db = request.result;
         console.log("success: " + db);
     };
 
    //if no database, create one and fill it with data
     request.onupgradeneeded = function(event) {
       var db = event.target.result;
       var objectStore = db.createObjectStore("task", {keyPath: "id", autoIncrement: true});
       
       for (var i in taskData) {
          objectStore.add(taskData[i]);
       }
    }
 }
 
 //adds a record as entered in the form
 function add() {
     //get a reference to the fields in html
     let myInput = document.querySelector("#myInput").value;
    
    //create a transaction and attempt to add data
     var request = db.transaction(["task"], "readwrite")
     .objectStore("task")
     .add({task: myInput});
 
    //when successfully added to the database
     request.onsuccess = function(event) {
         console.log(`${myInput} has been added to your database.`);
     };
 
    //when not successfully added to the database
     request.onerror = function(event) {
     console.log(`Unable to add data\r\n${myInput} is already in your database! `);
     }

     readAll();
 }
 
 //reads all the data in the database
 function readAll() {
     clearList();
     
    var objectStore = db.transaction("task").objectStore("task");
    
    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       
       if (cursor) {
          console.log("task: " + cursor.value.task);
          addEntry(cursor.value.task, cursor.value.id);
          cursor.continue();
       }
       
       else {
          console.log("No more entries!");
       }
    };
 }

 //deletes a record by id
 function remove(id) {
    var transaction = db.transaction([ 'task' ], 'readwrite').objectStore('task').delete(id);

    
    transaction.onsuccess = function(event) {
      alert("Delete was successful!")  
    };
    
    transaction.onerror = function(event) {
        alert("Delete was unsuccessful!")  
    };
    readAll();
}


 function addEntry(task, id) {
     // Your existing code unmodified...

    var iLi = document.createElement('li');
    iLi.className = 'myUL';
    iLi.id = `${id}`;
    iLi.innerHTML = task;
        console.log(id);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.setAttribute("onclick", `remove(${id})`)
    span.appendChild(txt);
    iLi.appendChild(span);

    if (task === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(iLi);
    }
 }


 function clearList() {
     document.querySelector("#myUL").innerHTML = "";
 }
 
 initDatabase();
