const form = document.querySelector("form"); //get the dom for html document

//create 3 arrays, for all notes, for the undone tasks and the completed tasks
let allNotesArray = [];
let activeArray = [];
let completedArray = [];

let toDo = ""; //value of toDo input, the user input
let isCompleted = false;

//get the dom for html elements
let input = document.querySelector("input");
let counter = document.getElementById("counter");
let actions = document.getElementById("actions");
actions.style.visibility = "hidden"; //button is not visible in the beginning
let selectAllButton = document.getElementById("select-all");
let selectAllButtonActive = false;
selectAllButton.style.visibility = "hidden";
let notebarContainer = document.getElementById("notebar");
let showAllButton = document.getElementById("show-all");
let activeButton = document.getElementById("active");
let completedButton = document.getElementById("completed");
let clearCompletedButton = document.getElementById("clear-completed");
clearCompletedButton.style.visibility = "hidden";


//Create each note, parameters to find index in the arrays and check if note is completed or not
function CreateNotes(i, isCompleted) {

    //start with creating a label
    let label = document.createElement("label");
    label.id = "notelabel";

    //add a checkbox
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "checkbox";
    label.appendChild(checkBox);

    //add the textpart
    let note = document.createElement("p");
    note.id = "note";

    //if the note is'nt marked as completed, show the note as it is
    if (isCompleted === false) {
        note.textContent = allNotesArray[i];
    }

    //if marked completed, draw a line through the note
    else {
        note.textContent = allNotesArray[i];
        note.style.setProperty('text-decoration', 'line-through');
        checkBox.checked = true;
    }

    label.appendChild(note);

    //add a deletebutton, use an icon
    let deleteButton = document.createElement("button");
    deleteButton.id = "delete";
    deleteButton.textContent = "❌";
    label.appendChild(deleteButton);

    //show the actionbar
    actions.style.visibility = "visible";
    //add all to the notebar
    notebarContainer.appendChild(label);


    //when the deletebutton is clicked
    deleteButton.onclick = event => {
        event.preventDefault();

        //remove the entire label 
        label.remove();


        //find out if the note is in the activearray or in completedarray
        //delete the note from that array
        if (activeArray.includes(note.textContent)) {
            for (let i = 0; i < activeArray.length; i++) {
                if (note.textContent === activeArray[i]) {
                    activeArray.splice(i, 1);
                }
            }
        }
        else {
            for (let i = 0; i < completedArray.length; i++) {
                if (note.textContent === completedArray[i]) {
                    completedArray.splice(i, 1);
                }
            }
        }

        //find the note in the allnotesarray by index, and remove it
        for (let j = 0; j < allNotesArray.length; j++) {
            if (note.textContent === allNotesArray[j]) {
                allNotesArray.splice(j, 1);
            }
        }

        //if there are no notes left, all deleted, hide all buttons in footer
        if (activeArray.length === 0) {
            actions.style.visibility = "hidden";
            InactivateButton(clearCompletedButton);
            InactivateButton(selectAllButton);
        }

        //if no notes are completed, hide the clearcompletedbutton
        if (completedArray.length === 0) {
            InactivateButton(clearCompletedButton);
        }

        //counter shows the active notes
        counter.textContent = activeArray.length.toString() + " item left";

    }

    //check the checkbox, checked or not
    checkBox.onchange = event => {
        event.preventDefault();

        //if the checkbox is checked
        if (checkBox.checked === true) {

            //add a line through the note text
            note.style.setProperty('text-decoration', 'line-through');

            //add the note to completedarray
            completedArray.push(note.textContent);

            //remove the note from the activearray
            activeArray = activeArray.filter(val => val !== note.textContent)
            ActivateButton(clearCompletedButton);
        }

        //if the checkbox is not checked
        else {
            //the note text will not have any lines
            note.style.setProperty('text-decoration', 'none');

            //add the note to the activearray since its not completed
            activeArray.push(note.textContent);
            completedArray = completedArray.filter(val => val !== note.textContent);

            if (completedArray.length === 0) {
                InactivateButton(clearCompletedButton);
            }
        }

        //counter shows how many active notes there are
        counter.textContent = activeArray.length.toString() + " item left";
    }
    counter.textContent = activeArray.length.toString() + " item left";
}

//when the showallbutton is clicked
showAllButton.onclick = event => {
    event.preventDefault();

    Borders(showAllButton);
    //remove the borders on the other buttons
    NoBorders(activeButton);
    NoBorders(completedButton);

    //clear the notebar
    notebarContainer.textContent = "";
    for (let i = 0; i < allNotesArray.length; i++) {

        //if the note is in the activearray, then its not completed
        if (activeArray.includes(allNotesArray[i])) {
            isCompleted = false;
        }
        //or else it is completed
        else {
            isCompleted = true;
        }

        if (isCompleted === true) {
            CreateNotes(i, true);
        }

        else {
            CreateNotes(i, false);
        }

        isCompleted = false;
        ActivateButton(selectAllButton);
    }

}

//if the completedbutton is clicked
activeButton.onclick = event => {
    event.preventDefault();

    Borders(activeButton);
    NoBorders(showAllButton);
    NoBorders(completedButton);

    //empty the notebar
    notebarContainer.textContent = "";

    for (let i = 0; i < allNotesArray.length; i++) {
        if (activeArray.includes(allNotesArray[i])) {
            CreateNotes(i, false);
        }
    }

}

//if the completedbutton is clicked
completedButton.onclick = event => {
    event.preventDefault();

    Borders(completedButton);
    NoBorders(activeButton);
    NoBorders(showAllButton);

    //empty the notebar
    notebarContainer.textContent = "";
    for (let i = 0; i < allNotesArray.length; i++) {
        //if the note is marked as completed and show only completed notes
        if (completedArray.includes(allNotesArray[i])) {
            CreateNotes(i, true);
        }

    }
};

//if the clearcompletedbutton is clicked
clearCompletedButton.onclick = event => {
    event.preventDefault();

    //empty the completedarray
    completedArray = [];
    //empty the allnotesarray
    allNotesArray = [];

    //fill the all array with the active notes only
    for (let i = 0; i < activeArray.length; i++) {
        allNotesArray[i] = activeArray[i];
    }

    //empty the notebar
    notebarContainer.textContent = "";

    //fill the notebar with just the active notes
    for (let i = 0; i < allNotesArray.length; i++) {
        CreateNotes(i, false);
    }

    //if there are no active notes left, hide counter and inactivate the buttons
    if (activeArray.length === 0) {
        counter.textContent = "";

        InactivateButton(selectAllButton);
        actions.style.visibility = "hidden";
    }

    //counter shows the active notes left
    else {
        counter.textContent = activeArray.length.toString() + " item left";
    }

    //hide the clearcompeletebutton
    if (completedArray.length === 0) {
        clearCompletedButton.style.visibility = "hidden";
    }

};

//if the selectallbutton is clicked
selectAllButton.onclick = event => {
    event.preventDefault();

    ActivateButton(clearCompletedButton);

    //if the arrowdownbutton is active
    if (selectAllButtonActive === false) {
        for (let i = 0; i < activeArray.length; i++) {

            //add the note to completedarray
            completedArray.push(activeArray[i]);
        }
        //empty the activearray
        activeArray = [];
        //empty the notebar
        notebarContainer.textContent = "";

        for (let i = 0; i < allNotesArray.length; i++) {
            CreateNotes(i, true);
        }
        selectAllButtonActive = true;
    }
    //if the selectallbutton is inactive
    else {
        for (let i = 0; i < completedArray.length; i++) {

            //move notes to the activelist
            activeArray.push(completedArray[i]);
        }

        //empty the completedarray, no completed notes are in the completearray
        completedArray = [];

        InactivateButton(clearCompletedButton);
        notebarContainer.textContent = "";

        for (let i = 0; i < allNotesArray.length; i++) {
            CreateNotes(i, false);
        }
        selectAllButtonActive = false;
    }

    counter.textContent = activeArray.length.toString() + " item left";
};


//add note by entering the text in the textbox
form.onsubmit = event => {
    event.preventDefault();

    //activate and show the selectall button
    ActivateButton(selectAllButton);

    showAllButton.style.setProperty('border-color', 'rgba(175, 47, 47, 0.2)');

    //change the style of the footer
    let footer = document.querySelector("footer");
    footer.style.setProperty('margin-top', '50px');

    //clear the notebar
    notebarContainer.textContent = "";

    //get the user input
    toDo = form.elements.text.value;

    if (toDo !== "") {

        //add the note to the allnotesarray
        allNotesArray.push(toDo);

        //add the note to the activearray
        activeArray.push(toDo);

        //iterate over the allnotesarray and append the notes to the notebar
        for (let i = 0; i < allNotesArray.length; i++) {

            //check if the note is marked as completed or not
            if (activeArray.includes(allNotesArray[i])) {
                isCompleted = false;
            }
            else {
                isCompleted = true;
            }

            if (isCompleted === true) {
                CreateNotes(i, true);
            }
            else {
                CreateNotes(i, false);
            }
            isCompleted = false;
            selectAllButton.disabled = false;
        }
    }
    else {
        alert("Todo list cannot be submitted empty")
    }

    //clear the textbox
    input.value = "";

};

//create borders on buttons
function Borders(button) {
    button.style.setProperty('border-color', 'rgba(175, 47, 47, 0.2)');
}

//remove borders on buttons
function NoBorders(button) {
    button.style.setProperty('border', 'none');
}

//button activation function
function ActivateButton(button) {
    button.disabled = false;
    button.style.visibility = "visible";
}

//button inactivation function
function InactivateButton(button) {
    button.disabled = true;
    button.style.visibility = "hidden";
}