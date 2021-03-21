//opening and closing side panel
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.mapSection');
document.querySelector('#panelButton').onclick = function () {
  sidebar.classList.toggle('sidebar_small');
  mainContent.classList.toggle('mapSection_large');
}
