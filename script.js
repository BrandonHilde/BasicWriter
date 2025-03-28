
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


document.getElementById('checkButton').addEventListener('click', function() {

   console.log(isInsideType('strong'));

});

function ToggleType(type)
{
   if(isInsideType(type))
   {
      RemoveType(type);
   }
   else{
      AddType(type);
   }
}
