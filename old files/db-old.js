
//some sample data
const taskData = [
    {task: "Call mom"},
    {task: "Cook dinner"}
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
       var objectStore = db.createObjectStore("task", {keyPath: "task"});
       // var objectStore = db.createObjectStore("id", {keyPath: "id"});
       
       for (var i in taskData) {
          objectStore.add(taskData[i]);
       }
    }
 }
 
 //adds a record as entered in the form
 function add() {
     //get a reference to the fields in html
     let myInput = document.querySelector("#myInput").value;
     // let task = ("myInput");
     console.log(myInput);
    
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
     newElement();

     // readAll();
 }
 
 //not used in code example
 //reads one record by id
 function read() {
    //get a transaction
    var transaction = db.transaction(["task"]);
    
    //create the object store
    var objectStore = transaction.objectStore("task");
 
    //get the data by id
    var request = objectStore.get("task");
    
    request.onerror = function(event) {
       console.log("Unable to retrieve data from database!");
    };
    
    request.onsuccess = function(event) {
       // Do something with the request.myUL!
       if(request.result) {
          console.log("task: " + request.result.task);
       }
       
       else {
          console.log("couldn't be found in your database!");
       }
    };
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
          addEntry(cursor.value.task);
          cursor.continue();
       }
       
       else {
          console.log("No more entries!");
       }
    };
 }

 //deletes a record by id
 function remove() {
     let delid = document.querySelector("#delid").value;
    var request = db.transaction(["task"], "readwrite")
    .objectStore("task")
    .delete(delid);
    
    request.onsuccess = function(event) {
       console.log("Entry has been removed from your database.");
    };
 }

 function addEntry(task) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'myUL';
    iDiv.innerHTML = task + "<BR>";
    document.querySelector("#myInput").appendChild(iDiv);
 }
 function clearList() {
     document.querySelector("#myUL").innerHTML = "";
 }
 
 initDatabase();