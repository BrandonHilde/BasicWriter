const editor = document.getElementById("editor");

const SupportedTextTypes = {
    Bold: "strong",
    Underline: "u",
    StrikeThrough: "s",
    Italics: "em"
};

function RetrieveText(docfragment)
{
    var div = document.createElement('div');

    var nd = docfragment.cloneNode(true);

    div.appendChild(nd);

    return div.innerHTML.trim();
}

function RemoveTextNode(rawhtml, type)
{
    console.log(rawhtml);
    console.log(type);
    rawhtml = rawhtml.replaceAll('<' + type + '>', "");
    rawhtml = rawhtml.replaceAll('</' + type + '>', "");

    return rawhtml;
}

function SimplifyFormat(type)
{
    var raw = editor.innerHTML;

    raw = raw.replaceAll('</' + type + '><'+ type + '>', "");

    editor.innerHTML = raw;
}

/*
function SimplifyTextFormat(text, type)
{
    var tyo = buildType(type, false);
    var tyc = buildType(type, true);

    const count = text.split(tyo).length - 1;

    if(count > 1)
    {

        var open = text.indexOf(tyo);
        var clos = text.lastIndexOf(tyc);

        var pre = text.substring(0, open);
        var rm = text.substring(open, clos)

        rm = rm.replaceAll(tyo, "");
        rm = rm.replaceAll(tyc, "");

        var pst = text.substring(clos);

        return pre + rm + pst;
    }

    return text;

}*/

function GetRelativePosition()
{
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Make sure the selection is within our editor
      if (editor.contains(range.startContainer)) {
        const startOffset = getAbsoluteOffset(editor, range.startContainer, range.startOffset);
        const endOffset = getAbsoluteOffset(editor, range.endContainer, range.endOffset);
        return {start: startOffset, end: endOffset};
      }
    }

    return {start: -1, end: -1};
}
  
function getAbsoluteOffset(editor, container, offsetInContainer) 
{
    // Create a range from the start of the editor to the selection point
    const range = document.createRange();
    range.setStart(editor, 0);
    range.setEnd(container, offsetInContainer);

    // Get the text content of this range, which represents all text before our position
   // const textBefore = range.toString().trim();

   var doc = range.cloneContents();

   const textBefore = RetrieveText(doc);
   const textAfter =  GetAbsoluteText(textBefore, GetEditorText());

    // Return the length of this text
    return textAfter.length;
}

function GetAbsoluteText(text, raw)
{
    var val = "";

    if(text != raw)
    {
        for(var v = 0; v < text.length; v++)
        {
            if(text[v] == raw[v])
            { 
                val += text[v];
            }
            else{
                break;
            }
        } 
    }
    else
    {
        return text;
    }
    
    return val;
}

function GetEditorText()
{
    return editor.innerHTML.trim();
}

function SetEditorText(text)
{
    editor.innerHTML = text;
}

function GetTextSections()
{
    const startend = GetRelativePosition();

    const editText = GetEditorText().toString();

    var preText = editText.substring(0, startend.start);
    var midText = editText.substring(startend.start, startend.end);
    var endText = editText.substring(startend.end);

    var value = {
        pre: preText,
        mid: midText,
        end: endText
    };

    return value;
}

function RemoveType(type) 
{
    var sect = GetTextSections();

    var txt = sect.pre + sect.mid + sect.end;

    txt = RemoveTextNode(txt, type);

    SetEditorText(txt);
}

function AddType(type)
{
    var sect = GetTextSections();

    console.log(sect);

    var mid = sect.mid;

    var tyo = buildType(type, false);
    var tyc = buildType(type, true);

    mid = mid.replaceAll(tyo, "");
    mid = mid.replaceAll(tyc, "");

    var nText = sect.pre 
    + buildType(type, false) 
    + mid
    + buildType(type, true) 
    + sect.end;

    console.log(nText);
  
   // var simp = SimplifyTextFormat(nText, type);
    SetEditorText(nText);
}

function buildType(type, isClose)
{
    if(isClose) return '</' + type + '>';
    return '<' + type + '>';
}

function isInsideType(type)
{
    var sect = GetTextSections();

    var count = 0;

    count += numberOfType(type, sect.pre);
    console.log(count);
    count += numberOfType(type, sect.mid);
    console.log(count);

    return count > 0;

}

function numberOfType(type, text)
{
    var count = 0;

    for(var v = 0; v < text.length - (type.length + 2); v++)
    {
        if(text.startsWith('<' + type + '>', v))
        {
            count++;
        }
        else if(text.startsWith('</' + type + '>', v))
        {
            count--;
        }
    }

    return count;
}