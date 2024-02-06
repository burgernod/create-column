'use strict';

//Creating Column Template

const columnTemplate = document.querySelector('.column'),
      taskTemplate = document.querySelector('.task');

let classnameCounter = 1,
    selectedColumn;

//Bind Color Input with Text Input

const colorInp = document.querySelector('[type="color"]'),
      textInp = document.querySelector('#create div > input[type="text"]');

textInp.value = colorInp.value;

textInp.addEventListener('keypress', e => {
   const hexCode = textInp.value.split('#').join('');

   if (hexCode.length === 6 && e.key !== 'Backspace') {
      e.preventDefault();
      return;
   }
});

textInp.addEventListener('input', e => {
   if (/^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(textInp.value)) {
      colorInp.value = textInp.value;
   } else colorInp.value = '#000000';
});

colorInp.addEventListener('change', () => {
   textInp.value = colorInp.value;
});

//Nessesary Variable For Dragging

const offsetP = document.querySelector('.tasks').offsetTop,
      offsetW = document.querySelector('.column').offsetWidth / 2;

//Adding Task Button Functionality

function taskCreation() {
   let addingTask = taskTemplate.cloneNode(true);

   //Change Name

   const taskName = addingTask.querySelector('h2'),
         writtenName = document.querySelector('#task-create input');

   taskName.innerText = writtenName.value.trim().toLowerCase();
   
   //Making Tasks Draggable

   addingTask.addEventListener('dragstart', e => {
      setTimeout(() => addingTask.classList.add('dragging'), 0);

      const sortingList = e.currentTarget.parentElement,
            draggingTask = e.currentTarget;

      sortingList.addEventListener('dragover', e => {
         e.preventDefault();

         let siblings = [...sortingList.querySelectorAll('.task:not(.dragging)')];
         const offsetH = 57 / 2;

         let nextSibling = siblings.find(s => {
            return e.clientY <= s.offsetTop + offsetH + offsetP;
         });

         sortingList.insertBefore(draggingTask, nextSibling);
         [siblings, nextSibling] = [, ];
      });

      sortingList.addEventListener('dragenter', e => e.preventDefault());
   });

   addingTask.addEventListener('dragend', () => {
      addingTask.classList.remove('dragging');
   });

   //Adding Functionality to Delete

   const taskRemove = addingTask.querySelector('button');

   taskRemove.addEventListener('click', e => {
      e.currentTarget.parentElement.remove();
      addingTask = undefined;
   });
   
   //Adding to Page

   selectedColumn.querySelector('.tasks > div').append(addingTask);

   //Reset

   selectedColumn = undefined;
   writtenName.value = '';

   document.querySelector('#task-create').classList.toggle('invisible');
   document.querySelector('#task-create + div').classList.toggle('invisible');
}

//Make Clicking Background Close Task Creation Tab

document.querySelector('#task-create + div').addEventListener('click', () => {
   selectedColumn = undefined;
   document.querySelector('#task-create input').value = '';

   document.querySelector('#task-create').classList.toggle('invisible');
   document.querySelector('#task-create + div').classList.toggle('invisible');
});


function columnCreation() {
   let addingColumn = columnTemplate.cloneNode(true);

   addingColumn.classList.add('column' + classnameCounter++);

   // Column Color

   const columnColor = addingColumn.querySelector('hr'),
         selectedColor = document.querySelector('[type="color"]');

   columnColor.style.background = selectedColor.value;

   //Column Name

   const columnName = addingColumn.querySelector('h2'),
         writtenName = document.querySelector('[type="text"]');

   columnName.innerText = writtenName.value.trim().toLowerCase();

   // Add New Task Buttom

   const addTaskButton = addingColumn.querySelector('.tasks > button');

   addTaskButton.addEventListener('click', e => {
      selectedColumn = e.currentTarget.parentElement;

      document.querySelector('#task-create').classList.toggle('invisible');
      document.querySelector('#task-create + div').classList.toggle('invisible');

      document.querySelector('#task-create > input').focus();
   });

   // Making Columns Draggable

   addingColumn.addEventListener('dragstart', e => {
      setTimeout(() => addingColumn.classList.add('dragging-column'), 0);

      const sortingColumns = e.currentTarget.parentElement,
            draggingColumn = e.currentTarget;

      sortingColumns.addEventListener('dragover', e => {
         e.preventDefault();

         let siblings = [...sortingColumns.querySelectorAll('.column:not(.dragging-column)')];

         let nextSibling = siblings.find(s => {
            return e.clientX <= s.offsetLeft + offsetW;
         });

         sortingColumns.insertBefore(draggingColumn, nextSibling);
         [siblings, nextSibling] = [, ];
      });

      sortingColumns.addEventListener('dragenter', e => e.preventDefault());
   });

   addingColumn.addEventListener('dragend', (e) => {
      addingColumn.classList.remove('dragging-column');
   });

   //Deleting Column Button 

   const garbageButton = addingColumn.querySelector('a');

   garbageButton.addEventListener('click', e => {
      e.preventDefault();
   
      e.currentTarget.parentElement.remove();
      addingColumn = undefined;
   });

   //Adding Column To Page

   const columns = document.querySelector('#columns');

   columns.append(addingColumn);

   //Reseting The Column Create Page

   selectedColor.value = '#000000';
   writtenName.value = '';

   textInp.value = colorInp.value;

   document.querySelector('#create').classList.toggle('create-opened');
}

//Add Functionality to Change Theme and Color

const themeChangeBtn = document.querySelector('#theme-change');

let theme = 0,
    fi = '#A71B55',
    se = '#FF2983',
    dark = '#3B3A3E',
    darker = '#262628',
    white = '#F2EBEE',
    gray = '#E4E1E1';

const styleTag = document.createElement("style");

styleTag.innerHTML = `
:root {
   --fi: ${fi};
   --se: ${se};
   --dark: ${dark};
   --darker: ${darker};
   --white: ${white};
}
`;
document.getElementsByTagName('head')[0].append(styleTag);

themeChangeBtn.addEventListener('click', () => {
   [white, dark, gray, darker] = [darker, gray, dark, white];

   styleTag.innerHTML = `:root {
   --fi: ${fi};
   --se: ${se};
   --dark: ${dark};
   --darker: ${darker};
   --white: ${white};
   --gray: ${gray};
   }`;
});

const colorChangeBtn = document.querySelector('#color-change');

colorChangeBtn.addEventListener('click', e => {
   let data = [[150, 40, 0, '#'],
               [245, 140, 0, '#'],
               [40, 25, 0, '#'],
               [30, 4, 0, '#'],
               [255, 235, 0, '#'],
               [235, 220, 0, '#']],
       colors = [];

   data.forEach(d => {
      while (true) {
         const num = Math.floor(Math.random() * 255);
         if (d[2] == 3) return; 
         if (num < d[0] && num > d[1]) {
            d[3] += num.toString(16).length == 2 ? num.toString(16) : 0 + num.toString(16);
            d[2]++;
         } 
      }
   });

   for (let i = 0; i < data.length; i++) {
      colors[i] = data[i][3];
   }

   fi = colors[0];
   se = colors[1];
   dark = colors[2];
   darker = colors[3];
   white = colors[4];
   gray = colors[5];

   styleTag.innerHTML = `:root {
      --fi: ${fi};
      --se: ${se};
      --dark: ${dark};
      --darker: ${darker};
      --white: ${white};
      --gray: ${gray};
      }`;
});

// No Duplicate Names and at Least 4 charachters long

//Binding Button to Add Task

const taskCreateButton = document.querySelector('#task-create > button'),
      taskCreateName = document.querySelector('#task-create > input');

taskCreateName.addEventListener('input', taskCreationCheck);

function taskCreationCheck() {
   const areDuplicates = [...selectedColumn.querySelectorAll('.task')].reduce((t, v) => {return t || v.querySelector('h2').innerText === taskCreateName.value.trim().toLowerCase()}, false);
   if (taskCreateName.value.trim().length <= 4 || areDuplicates) taskCreateButton.removeEventListener('click', taskCreation);
   else taskCreateButton.addEventListener('click', taskCreation);
}

//Add Functionality to Create Column Button

const createSubmit = document.querySelector('.submit'),
      createColumnName = document.querySelector('input');

function columnCreationCheck() {
   const areDuplicates = [...document.querySelectorAll('.column')].reduce((t, v) => {return t || v.querySelector('h2').innerText === createColumnName.value.trim().toLowerCase()}, false);
   if (createColumnName.value.trim().length <= 4 || areDuplicates) createSubmit.removeEventListener('click', columnCreation);
   else createSubmit.addEventListener('click', columnCreation);
}

createColumnName.addEventListener('input', columnCreationCheck);

// Adding Functionality To Slider

const createSlider = document.querySelector('.afterelement');

createSlider.addEventListener('click', () => {
   document.querySelector('#create').classList.toggle('create-opened');
   document.querySelector('#create > input').focus();
});

// Making First Input to Focus to Color Input when finished

const createFirstInput = document.querySelector('#create > input');

createFirstInput.addEventListener('keypress', e => {
   if (e.key === 'Enter') document.querySelector('h4 + input').focus();
});

// Making Second Input Create Column When Pressed Enter

const createSecondInput = document.querySelector('h4 + input');

createSecondInput.addEventListener('keypress', e => {
   if (e.key === 'Enter') createSubmit.click();
});

// Making Task CreaTe when pressing enter when name is finished

taskCreateName.addEventListener('keypress', e => {
   if (e.key === 'Enter') taskCreateButton.click();
});

document.querySelector('.column').remove();
document.querySelector('.task').remove();