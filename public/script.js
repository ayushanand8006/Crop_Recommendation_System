const images = [
'https://cacm.acm.org/wp-content/uploads/2024/07/071624.RSS_.Scalable-Technological-S.jpg?resize=1536,864',
'https://community.nasscom.in/sites/default/files/styles/960_x_600/public/media/images/66-rp.png?itok=8nrIhGTQ',
'https://images.stockcake.com/public/e/e/3/ee39d4df-6e60-4560-9e0c-a71508de39e3_large/smart-farming-technology-stockcake.jpg',
'https://gmo-research.ai/en/application/files/7316/6435/9654/Smart_Farming_image_shutterstock_s.jpg',
'https://gmo-research.ai/en/application/files/7316/6435/9654/Smart_Farming_image_shutterstock_s.jpg',
'https://techbullion.com/wp-content/uploads/2023/12/Smart-Agriculture-How-Technology-is-Revolutionizing-Sustainable-Farming-for-Climate-and-Nature.jpg'

];

let index = 0;
function changeBackground() {
document.body.style.backgroundImage = `url('${images[index]}')`;
index = (index + 1) % images.length;
}

setInterval(changeBackground, 5000); // change every 5 seconds
window.onload = changeBackground;