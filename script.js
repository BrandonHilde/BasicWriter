const menu = document.getElementById('menu');
const fontSelect = document.getElementById('setFontSelect');
const defaultFont = document.getElementById('setDefaultFont');
const defaultSize = document.getElementById('setDefaultSize');
const paraSize = document.getElementById('setSize');
const exptMenu = document.getElementById('exportMenu');

exptMenu.addEventListener('click', function() {
   exptMenu.style.display = "none";
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

document.getElementById('lineButton').addEventListener('click', function() {

   InsertLine();
   WordCount(editor);

});

var clearbutton = document.getElementById('clearButton');

clearbutton.addEventListener('click', function() {

   ClearFormating();

});

var toolbarParagraph = document.getElementById('paraToolBar');

toolbarParagraph.addEventListener('mouseenter', function() {

   HighlightParagraph(selectedParagraph);

});

toolbarParagraph.addEventListener('mouseleave', function() {

   ResetParagraph(selectedParagraph);
   
});

document.getElementById('setupButton').addEventListener('click', function() {

   ToggleMenu();

});

//MARK: alignment
var leftAlignButton = document.getElementById('leftAlignButton');
var rightAlignButton = document.getElementById('rightAlignButton');
var centerAlignButton = document.getElementById('centerAlignButton');

leftAlignButton.addEventListener('click', function() {

   if(selectedParagraph)
   {
      selectedParagraph.removeAttribute("align");
   }

});

rightAlignButton.addEventListener('click', function() {

   if(selectedParagraph)
   {
      selectedParagraph.align = "right";
   }

});

centerAlignButton.addEventListener('click', function() {

   if(selectedParagraph)
   {
      selectedParagraph.align = "center";
   }

});

editor.addEventListener('input', function(){
   //document.getElementById('dragdropinfo').style.display = "none";
});

//MARK: font select

fontSelect.addEventListener('change', function() {

   if(selectedParagraph)
   {
      selectedParagraph.className = GetFont(fontSelect.value);
   }

});

paraSize.addEventListener('change', function() {

   if(selectedParagraph)
   {
      selectedParagraph.style.fontSize = paraSize.value;
   }

});

defaultFont.addEventListener('change', function() {


  editor.style.fontFamily = defaultFont.value;

});


defaultSize.addEventListener('change', function() {

   editor.style.fontSize = defaultSize.value;

});

document.getElementById('export').addEventListener('click', function() {

  var exmenu = document.getElementById('exportMenu');
  if(exmenu.style.display == "block")
  {
    exmenu.style.display = "none";
  }
  else
  {
    exmenu.style.display = "block";
  }
   
});

document.getElementById('exportTxt').addEventListener('click', function() {

   SaveToText("document.txt");
   
});
document.getElementById('exportHTML').addEventListener('click', function() {

   SaveToHTML("document.html");
   
});

document.addEventListener('dragenter', function(ev) {
   ev.preventDefault();
   ev.stopPropagation();
});

document.addEventListener('dragover', function(ev) {
   ev.preventDefault();
   ev.stopPropagation();
});

document.addEventListener('drop', function(ev) {
   FileDrop(ev);
});

function FileDrop(ev)
{
   ev.preventDefault();
   ev.stopPropagation();

   const dt = ev.dataTransfer;
   const files = dt.files;

   if (files.length > 0) {
      const file = files[0];
      
      console.log(file);

     
          const reader = new FileReader();
          
          reader.onload = function(ev) {
             //e.target.result
            var data = ev.target.result;
            if (file.type.startsWith('text/html')) {
               var inx = data.indexOf("<body>");
               var inc = data.indexOf("</body>");

               if(inx > -1 && inc > -1 && inx < inc)
               {
                  data = data.substring(inx, inc);

                  editor.innerHTML = data;
               }
               else{
                  editor.innerHTML = data;
               }
          }
          else if(file.type.startsWith('text/plain'))
          {
            data = TextFileLoad(data);
            // needs /r/n replace
          
            editor.innerHTML = data;
          }
          
         
      }
      reader.readAsText(file);
   }
}

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
   var style =	
   `<style type="text/css">
		@page { size: 5.5in 8.5in; margin: 0.79in }
		p { line-height: 115%; margin-bottom: 0.1in; background: transparent }
	</style>`;

   var data = '<html><head>' + style + '</head><body>';

   data += editor.innerHTML;

   data += '</body></html>';

   SaveToRawText(data, filename);
}

function SaveToText(filename)
{
   var data = editor.innerText;
   // var post = document.createElement('p');
   // post.textContent = data;
   // data = post.innerHTML.replace(/\n/g, '<br>\n');
   SaveToRawText(data, filename);
}

function HighlightParagraph(para)
{
   if(para)
   {
      para.style.backgroundColor = "wheat";
      para.style.borderRadius = "5px";
   }
}
function ResetParagraph(para)
{
   if(para)
   {
      para.style.backgroundColor = "";
      para.style.borderRadius = "";
   }
}

function TextFileLoad(file)
{
   var data = '<p>';

   if(file.includes("\n"))
   {  
      for(var v = 0; v < file.length; v++)
      {
         if(file[v] === '\n')
         {
            if(v + 1 < file.length)
            {
               if(file[v + 1] === '\r')
               {
                  data += '</p><p><br>';
               }
               else{
                  data += '</p><p>';
               }
            }
            else
            {
               data += '</p><p>';
            } 
         }
         else
         {
            data += file[v];
         }
      }

      data += '</p>';
   }
   else
   {
      data += file + '</p>';
   }

   console.log(file);
   console.log(data);

   return data;
}
