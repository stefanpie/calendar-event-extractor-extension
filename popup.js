let get_events_btn = document.getElementById("get_events");
let input_textarea = document.getElementById("input_text");

let status_p = document.getElementsByClassName("status")[0];
let events_list_ul = document.getElementsByClassName("output-events-list")[0];


document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("calender_event_extractor_input_data", function (data) {
    if (data.calender_event_extractor_input_data) {
      input_textarea.value = data.calender_event_extractor_input_data;
    }
  });
});

input_textarea.addEventListener("input", () => {
  var textarea_value = input_textarea.value;
  chrome.storage.local.set({
    calender_event_extractor_input_data: textarea_value});
});


get_events_btn.addEventListener("click", async () => {
  var input_text = input_textarea.value;
  const data = { input_text: input_text };

  while (events_list_ul.firstChild) {
    events_list_ul.removeChild(events_list_ul.firstChild);
  }
  status_p.innerHTML = `Status: thinking...`;

  fetch("https://calendar-event-extractor.onrender.com/extract-event", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((json_data) => {
      const events = json_data.events;
      console.log(events);
      status_p.innerHTML = `Status: ${events.length} events found`;

      // remove all chidlren from ul dont use innerHTML
      while (events_list_ul.firstChild) {
        events_list_ul.removeChild(events_list_ul.firstChild);
      }

      for (let i = 0; i < events.length; i++) {
        var event = events[i];
        var event_name = event.event_name;
        var start_datetime = event.start_datetime;
        var end_datetime = event.end_datetime;
        var event_creation_link = event.event_creation_link;
        var li = document.createElement("li");
        li.innerHTML = `<a href="${event_creation_link}" target="_blank">${event_name}: ${start_datetime} - ${end_datetime}</a>`;
        events_list_ul.appendChild(li);
      }
    })
    .catch((err) => {
      console.log(err);
      status_p.innerHTML = `Status: error ${err.status}`;
    });
});
