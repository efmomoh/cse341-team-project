

async function init(){

const mainContainer = document.querySelector(".route-schedules");
const allScheduleContainer = document.querySelector(".schedules-grid");
const monthContainer = document.querySelector("#months-grid");

const tripId = mainContainer.dataset.tripid;
const route = `/api/trips/${tripId}/schedules`;

// Get all schedule, upon page load
const schedules = await getSchedule(route);
mainContainer.insertAdjacentHTML("afterbegin", "<h2>Available Schedules</h2>")
renderData(schedules,allScheduleContainer,true);

// update page content after selecting month

monthContainer.addEventListener("click", async(event) => {
  const clickedElement = event.target;
  const month = clickedElement.dataset.monthnum;
  if(month){
    const schedules = await getSchedule(`${route}?month=${month}`)
    if(schedules && schedules.length != 0){
           renderData(schedules,allScheduleContainer,true)
        }else{
            allScheduleContainer.innerHTML =` <h3>No schedules available for the selected month </h3>`
        }
    }
})

}

init();

function renderData(data,domElement,clear=false){
  if(clear){domElement.innerHTML = ""};
  const stringData = data.map( d => scheduleTemplate(d)).join("");
  domElement.insertAdjacentHTML("afterbegin",stringData);
}

async function getSchedule(route){
    try {
         const response = await fetch(route);
         if(response.ok){
           const scheduleData = await response.json();
           return scheduleData;
         }
    } catch (error) {
        console.error(error)
    }
 
}




const scheduleTemplate = (schedule) => {
  return ` 
    <div class="schedule-card">
      <div class="schedule-times">
        <div class="time-block">
          <span class="time-label">Departs</span>
          <span class="time-value">${schedule.departureTime}</span>
        </div>
        <span class="time-arrow">→</span>
        <div class="time-block">
          <span class="time-label">Arrives</span>
          <span class="time-value">${schedule.arrivalTime}</span>
        </div>
      </div>
      <div class="schedule-days">
        ${schedule.daysOfWeek
          .map((day) => `<span class="day-badge">${day.substring(0, 3)}</span>`)
          .join("")}
      </div>
      <a href="/trips/booking/${schedule.id}" class="book-btn">Book Now</a>
    </div>
  `;
};
