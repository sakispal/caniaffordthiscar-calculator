var i = 0;
var txt = "Sakis Paliouras"; /* The text */
var speed = 70; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
  	var type = document.getElementById("typewriter");
  	//CUSTOMIZE THE COLOR AND FONT OF THE TYPED TEXT
    type.classList.add("dope");

  	type.innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
   }
}
typeWriter();
