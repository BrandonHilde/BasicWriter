const menu = document.getElementById('menu');
const fontSelect = document.getElementById('setFontSelect');
const defaultFont = document.getElementById('setDefaultFont');
const defaultSize = document.getElementById('setDefaultSize');

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

document.getElementById('lineButton').addEventListener('click', function() {

   InsertLine();

});

document.getElementById('clearButton').addEventListener('click', function() {

   ClearFormating();

});

document.getElementById('setupButton').addEventListener('click', function() {

   ToggleMenu();

});

fontSelect.addEventListener('change', function() {

   if(selectedParagraph)
   {
      selectedParagraph.className = GetFont(fontSelect.value);
   }

});

defaultFont.addEventListener('change', function() {


  editor.style.fontFamily = defaultFont.value;

});


defaultSize.addEventListener('change', function() {

   editor.style.fontSize = defaultSize.value;

});

document.getElementById('exportHTML').addEventListener('click', function() {

   SaveToHTML("document.html");
   
});

function ToggleType(type)
{
   var sel = isInsideType(type);

   AddType(type, sel);
}

function ToggleMenu()
{
   if(menu.style.display == "block")
   {
      menu.style.display = "none";
   }
   else
   {
      menu.style.display = "block";
   }
}


function SaveToRawText(data, filename)
{
   var file = new Blob([data], {type: 'text/plain'});
   if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
   else { 
      var a = document.createElement("a");
      var url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
      }, 0); 
   }
}

function SaveToHTML(filename)
{
   var data = '<html><head></head><body>';

   data += editor.innerHTML;

   data += '</body></html>';

   SaveToRawText(data, filename);
}

