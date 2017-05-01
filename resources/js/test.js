/* file: main.js
   author: Brandon LaRouche
   CSCI 2254 Web Application Development
   This is a simple web app for todo lists. It follows
   the TEA (The Elm Architecture) style.
type model = {
  state : list of records,
  props : {
    addMeeting : button,
    input : text field,
    meetings : list of something
    }
  }
  render : element * container element -> unit
  update : event * model -> model
  view   : model * cycle -> element
  app : {
          view   : model * (event -> unit) -> element,
          update : event * model -> model
        }
*/

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

var data = (localStorage.getItem('upcoming1')) ? JSON.parse(localStorage.getItem('upcoming1')):{
  state: []
};

function loadData(model) {
  if (!data.state.length) return;

  for (var i = 0; i < data.state.length; i++) {
    var value = data.state[i];
    model.state.push(value);
  }
}

function updateData(model) {
  if (!model.state.length) {
    data.state = [];
    saveData();
    return;
  }


  data.state = [];

  for (var i = 0; i < model.state.length; i++) {
    var value = model.state[i];
    data.state.push(value);
  }

  saveData();
}

function saveData() {
  localStorage.setItem('upcoming1', JSON.stringify(data));
}

// makeModel : unit -> model
//
let makeModel = function () {
  return {
    //state : [{status: '', name: '', location: '', className:'', times:{}, createdAt:''}],
    state : [],
    props : {
      addMeeting : document.getElementById('addMeeting'),
      nameInput :     document.getElementById('name'),
      locationInput :     document.getElementById('location'),
      classInput :     document.getElementById('class'),

      MstartTimeInput :     document.getElementById('MstartTime'),
      MendTimeInput :     document.getElementById('MendTime'),
      TstartTimeInput :     document.getElementById('TstartTime'),
      TendTimeInput :     document.getElementById('TendTime'),
      WstartTimeInput :     document.getElementById('WstartTime'),
      WendTimeInput :     document.getElementById('WendTime'),
      THstartTimeInput :     document.getElementById('THstartTime'),
      THendTimeInput :     document.getElementById('THendTime'),
      FstartTimeInput :     document.getElementById('FstartTime'),
      FendTimeInput :     document.getElementById('FendTime'),
      SAstartTimeInput :     document.getElementById('SAstartTime'),
      SAendTimeInput :     document.getElementById('SAendTime'),
      SUstartTimeInput :     document.getElementById('SUstartTime'),
      SUendTimeInput :     document.getElementById('SUendTime'),

      container : document.getElementById('container')
    }
  };
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

// update : event * model -> model
//
let update = function(event, model) {
  console.log(event.target);
  if ((findAncestor(event.target, 'addMeeting')) || (event.target == model.props.addMeeting)) {    // Add meeting Event
    console.log("adding a meeting..");

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    let monday = {start: model.props.MstartTimeInput.value, end: model.props.MendTimeInput.value};
    let tuesday  = {start: model.props.TstartTimeInput.value, end: model.props.TendTimeInput.value};
    let wednesday = {start: model.props.WstartTimeInput.value, end: model.props.WendTimeInput.value};
    let thursday = {start: model.props.THstartTimeInput.value, end: model.props.THendTimeInput.value};
    let friday = {start: model.props.FstartTimeInput.value, end: model.props.FendTimeInput.value};
    let saturday = {start: model.props.SAstartTimeInput.value, end: model.props.SAendTimeInput.value};
    let sunday = {start: model.props.SUstartTimeInput.value, end: model.props.SUendTimeInput.value};

    let times = {monday, tuesday, wednesday, thursday, friday, saturday, sunday};
    let newMeeting = {status: 'upcoming', name: model.props.nameInput.value, location: model.props.locationInput.value, className:model.props.classInput.value, times, createdAt: dateTime};
    model.props.nameInput.value = '';
    model.props.locationInput.value = '';
    model.props.classInput.value = '';

    model.props.MstartTimeInput.value = '';
    model.props.MendTimeInput.value = '';
    model.props.TstartTimeInput.value = '';
    model.props.TendTimeInput.value = '';
    model.props.WstartTimeInput.value = '';
    model.props.WendTimeInput.value = '';
    model.props.THstartTimeInput.value = '';
    model.props.THendTimeInput.value = '';
    model.props.FstartTimeInput.value = '';
    model.props.FendTimeInput.value = '';
    model.props.SAstartTimeInput.value = '';
    model.props.SAendTimeInput.value = '';
    model.props.SUstartTimeInput.value = '';
    model.props.SUendTimeInput.value = '';

    model.state.push(newMeeting);
    }
    else if ((findAncestor(event.target, 'remove')) || (event.target.className == "remove")){                                          // Delete task Event
    let remove = event.target.closest('li');
    model.state.forEach(function(meeting) {
      if ((meeting.createdAt === remove.title) && (meeting.status = remove.id)) {
        console.log("in delete area of update, removing ", meeting);
        let i = model.state.indexOf(meeting);
        model.state.splice(i, 1);
      }
    });
  }
  else if ((findAncestor(event.target, 'past')) || (event.target.className == "markpast")) {                                          // Delete task Event
    let past = event.target.closest('li');
    model.state.forEach(function(meeting) {
      if ((meeting.createdAt === past.title) && (meeting.status = past.id)) {
        console.log("in complete area of update, marking as past ", meeting);
        if (meeting.status == "upcoming")
          meeting.status = "past";
        else
          meeting.status = "upcoming";
      }
    });
  }
  console.log("leaving update with model.state= ", model.state);
  return model;
}

// view : model * (event -> unit) -> element
//
let view = function(model, listener, className) {
  let ul = document.createElement('ul');
  ul.className = 'upcoming';

  model.state.forEach(function (meeting) {
    let li = document.createElement('li');
    //li.appendChild(document.createTextNode(meeting.name + " is free in " + meeting.location + " for " + meeting.class));
    li.id = meeting.status;
    //hover title
    li.title = meeting.createdAt;

    var listContents = document.createElement('div');
    listContents.className = 'listContents';

    var basicInfo = document.createElement('div');
    basicInfo.classList.add('basicInfo');

    var itemName = document.createElement('div');
    itemName.className = 'itemName';
    if (meeting.name != '')
      itemName.innerHTML = meeting.name;
    else
      itemName.innerHTML = 'None';

    var itemLocation = document.createElement('div');
    itemLocation.className = 'itemLocation';
    if (meeting.location != '')
      itemLocation.innerHTML = meeting.location;
    else
      itemLocation.innerHTML = 'None';

    var itemClass = document.createElement('div');
    itemClass.className = 'itemClass';
    if (meeting.className != '')
      itemClass.innerHTML = meeting.className;
    else
      itemClass.innerHTML = 'None';

    basicInfo.appendChild(itemName);
    basicInfo.appendChild(itemLocation);
    basicInfo.appendChild(itemClass);
    listContents.appendChild(basicInfo);

    if ((meeting.times.monday.start != '') | (meeting.times.monday.end != ''))
      listContents.appendChild(createDay(meeting.times.monday, 'monday'));

    if ((meeting.times.tuesday.start != '') | (meeting.times.tuesday.end != ''))
      listContents.appendChild(createDay(meeting.times.tuesday, 'tuesday'));

    if ((meeting.times.wednesday.start != '') | (meeting.times.wednesday.end != ''))
      listContents.appendChild(createDay(meeting.times.wednesday, 'wednesday'));

    if ((meeting.times.thursday.start != '') | (meeting.times.thursday.end != ''))
      listContents.appendChild(createDay(meeting.times.thursday, 'thursday'));

    if ((meeting.times.friday.start != '') | (meeting.times.friday.end != ''))
      listContents.appendChild(createDay(meeting.times.friday, 'friday'));

    if ((meeting.times.saturday.start != '') | (meeting.times.saturday.end != ''))
      listContents.appendChild(createDay(meeting.times.saturday, 'saturday'));

    if ((meeting.times.sunday.start != '') | (meeting.times.sunday.end != ''))
      listContents.appendChild(createDay(meeting.times.sunday, 'sunday'));

    var remove = document.createElement('button');
    remove.className = "remove";
    remove.innerHTML = "Remove";
    remove.addEventListener('click', listener);
    listContents.appendChild(remove);

    var past = document.createElement('button');
    past.className = "markpast";
    if (meeting.status == "upcoming")
      past.innerHTML = "Mark as past";
    else
      past.innerHTML = "Mark as upcoming";
    past.addEventListener('click', listener);
    listContents.appendChild(past);

    li.appendChild(listContents);
    ul.appendChild(li);
  });
  return ul;
}

// render : element * element -> unit
//
let createDay = function(day, name) {
  var itemDay = document.createElement('div');
  itemDay.className = 'itemDay';

  var itemDates = document.createElement('div');
  itemDates.className = 'itemDates';
  itemDates.innerHTML = name;

  var itemTimesStart = document.createElement('div');
  itemTimesStart.className = 'itemTimes';
  if (day.start != '')
    itemTimesStart.innerHTML = 'Start time is: ' + day.start;
  else
    itemTimesStart.innerHTML = 'There is no start time';

  var itemTimesEnd = document.createElement('div');
  itemTimesEnd.className = 'itemTimes';
  if (day.end != '')
    itemTimesEnd.innerHTML = 'End time is: ' + day.end;
  else
    itemTimesEnd.innerHTML = 'There is no end time';

  itemDay.appendChild(itemDates);
  itemDay.appendChild(itemTimesStart);
  itemDay.appendChild(itemTimesEnd);

  return itemDay;
}

// render : element * element -> unit
//
let render = function(element, container) {
  let meetings = document.getElementById("upcoming");
  let past = document.getElementById("past");
  if (meetings) {
    //container.removeChild(meetings);
    while (child = meetings.firstChild)
      meetings.removeChild(child);
    while (child = past.firstChild)
      past.removeChild(child);
  }
  while (child = element.firstChild) {
    if (child.id == "upcoming")
      meetings.appendChild(child);
    else
      past.appendChild(child);
  }
  //meetings.appendChild(element);
  //container.appendChild(element);
}

// start : app -> unit
//
let start = function(app) {
  console.log("starting app..");

  let model = makeModel();
  loadData(model);

  let cycle = function (event) {
    model = app.update(event, model);

    let elementUpcoming = app.view(model, cycle, 'upcoming');
    let elementPast = app.view(model, cycle, 'past');
    render(elementUpcoming, model.props.container);
    render(elementPast, model.props.container);

    updateData(model);
  }

  model.props.addMeeting.addEventListener('click', cycle);
  let elt = app.view(model, cycle, 'upcoming');
  render(elt, model.props.container);
}

let app = {
            view   : view,
            update : update
          };

start(app);
