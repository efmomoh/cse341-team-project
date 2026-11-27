async function init(){

const mainContainer = document.querySelector(".route-schedules");
const allScheduleContainer = document.querySelector(".schedules-grid");
const monthContainer = document.querySelector("#months-grid");
const scheduleTemplate = document.querySelector(".schedule-template");
const scheduleDaysTemplate = document.querySelector(".schedule-days-template");


const tripId = mainContainer.dataset.tripid;
const route = `/api/trips/${tripId}/schedules`;

// Get all schedule, upon page load
try {
  const schedules = await getSchedule(route);
  mainContainer.insertAdjacentHTML("afterbegin", "<h2>Available Schedules</h2>");
  populateTemplate(scheduleTemplate,schedules,scheduleDaysTemplate,allScheduleContainer);
} catch (error) {
  allScheduleContainer.textContent = `Failed to fetch. An error occured`;
  console.log(error)
};

// update page content after selecting month
monthContainer.addEventListener("click", async(event) => {
  const clickedElement = event.target;
  const month = clickedElement.dataset.monthnum;
  if(month){
    try {
      const schedules = await getSchedule(`${route}?month=${month}`)
      if(schedules && schedules.length !== 0){
           populateTemplate(scheduleTemplate,schedules,scheduleDaysTemplate,allScheduleContainer);
        }else{
            allScheduleContainer.innerHTML =` <h3>No schedules available for the selected month </h3>`
        }
     }catch (error) {
      allScheduleContainer.textContent = `Failed to fetch. An error occured`;
      console.log(error)
    }
    }    
})

}

init();

const populateTemplate = async(template,data,scheduleDaysTemplate,domContainer) => {
  const fragment = document.createDocumentFragment();
  data.forEach(d => {
    const scheduleCard = template.content.cloneNode(true);
    scheduleCard.querySelector(".departureTime").textContent = d.departureTime;
    scheduleCard.querySelector(".arrivalTime").textContent = d.arrivalTime;
    const scheduleDayFragment = document.createDocumentFragment();
    d.daysOfWeek.forEach( w => {
      const scheduleDayCard = scheduleDaysTemplate.content.cloneNode(true);
       scheduleDayCard.querySelector(".day-badge").textContent = w.substring(0, 3);
       scheduleDayFragment.append(scheduleDayCard);
    });
    scheduleCard.querySelector(".book-btn").href = `/trips/booking/${d.id}`;
    scheduleCard.querySelector(".schedule-days").replaceChildren(scheduleDayFragment);
    fragment.append(scheduleCard);
  })
  domContainer.replaceChildren(fragment);
}



async function getSchedule(route){
 let scheduleData = "";
 try {
   const response = await fetch(route);
   if(!response.ok){
      throw new Error("Error fetching data");
   }
   scheduleData = await response.json();
 } catch (error) {
   console.error(error);
 }
 return scheduleData;
}



