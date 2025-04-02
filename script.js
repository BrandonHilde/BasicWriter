
document.getElementById('boldButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.Bold);

});

document.getElementById('underlineButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.Underline);

});

document.getElementById('strikeButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.StrikeThrough);

});

document.getElementById('italicsButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.Italics);

});

document.getElementById('clearButton').addEventListener('click', function() {

   ClearFormating();

});

const fontSelect = document.getElementById('setFontSelect');

// fontSelect.addEventListener("click", function(){
//    console.log(document.activeElement);
// });

fontSelect.addEventListener('change', function() {

   if(selectedParagraph)
   {
      selectedParagraph.className = GetFont(fontSelect.value);
   }

});


function ToggleType(type)
{
   var sel = isInsideType(type);

   AddType(type, sel);
}
