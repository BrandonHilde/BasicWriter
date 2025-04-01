
document.getElementById('titleButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.Title);

});

document.getElementById('headerButton').addEventListener('click', function() {

   ToggleType(SupportedTextTypes.Header);

});

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

   ClearFormating();

});

function ToggleType(type)
{
   var sel = isInsideType(type);

   AddType(type, sel);
}
