const editor = document.getElementById("editor");

var paraCount = 0;
var selectedParagraph = null;

const SupportedTextTypes = {
    Title: "h1",
    Header: "h2",
    Bold: "strong",
    Underline: "u",
    StrikeThrough: "s",
    Italics: "em"
};

const SelectType = {
    First: "f",
    Last: "l",
    Both: "b",
    None: "n",
    Enclosed: "e",
    Matches: "m"
}

const SupportedFont = [
    "Bona Nova",
    "Medula One",
    "Cutive Mono",
    "Lexend"
];

const FontClassName = [
    "BonaNova",
    "MedulaOne",
    "CutiveMono",
    "Lexend"
];

function GetFont(name)
{
    for(var v = 0; v < SupportedFont.length; v++)
    {
        if(SupportedFont[v] == name)
        {
            return FontClassName[v];
        }
    }

    return FontClassName[0];
}


editor.addEventListener("focus", function() {

    if(editor.innerHTML.trim() == "")
    {
        InsertRawHTML('<p id="initP"></p>');
    }

    console.log(document.activeElement);
});

editor.addEventListener('click', function(event) {

    var ele = document.elementFromPoint(event.clientX, event.clientY);

    if(ele.tagName == "P")
    {
        selectedParagraph = ele;
    }

  });

// editor.addEventListener("input", function(event){

//     event.preventDefault();
//     event.stopPropagation();
//     console.log(event.key);
// });

editor.addEventListener("keydown", function(event){

    if(event.key == "Tab")
    {
        event.preventDefault();
        event.stopPropagation();
        console.log(event.key);
        //override tab
    }
    else if(event.key == "Enter")
    {
        event.preventDefault();
        //event.stopPropagation();

        var pel = 'p_' + (paraCount++).toString();

        InsertRawHTML('</p><p id="' + pel + '"><br>');

        var element = document.getElementById(pel);

        AssignRange(element);

    }
});

function RetrieveText(docfragment)
{
    var div = document.createElement('div');

    var nd = docfragment.cloneNode(true);

    div.appendChild(nd);

    return div.innerHTML.trim();
}

function RemoveTextNode(rawhtml, type)
{
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

function AssignRange(element)
{
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // range.setStart(element.lastChild, 0);
    // range.setEnd(element.lastChild, 0);
    if(element)
    {
        if(element.lastChild)
            range.selectNodeContents(element.lastChild);
        else range.selectNodeContents(element);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    //range.deleteContents();
}

function GetRelativePosition()
{
    const selection = window.getSelection();
    
    if (selection.rangeCount >= 0) {
      const range = selection.getRangeAt(0);
      
      // Make sure the selection is within our editor
      if (editor.contains(range.startContainer)) {
        const startOffset = getAbsoluteOffset(editor, range.startContainer, range.startOffset);
        const endOffset = getAbsoluteOffset(editor, range.endContainer, range.endOffset);
        //console.log(startOffset, endOffset);
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

function ClearFormating()
{
    var sect = GetTextSections();

    var mid = ClearFromText(sect.mid);

    var nText = sect.pre + mid + sect.end;

    SetEditorText(nText);
}

function InsertLine()
{
    InsertRawHTML('<hr>');
}

function ClearFromText(text)
{
    var ntxt = "";

    var inside = false;

    for(var v = 0; v < text.length - 1; v++)
    {
        if(text[v] == '<' && text[v + 1] != 'p')
        {
            inside = true;
            console.log(text[v + 1]);
        }
        
        if(text[v] != '<')
        {
            if(text[v] == '>')
            {
                inside = false;
            }
            else
            {
                if(!inside)
                {
                    ntxt += text[v];
                }
            }
        }
    }

    return ntxt;
}

function RemoveCuts(text, next)
{
    var inx = text.lastIndexOf("<");
    var inc = text.lastIndexOf(">");

    var nnx = next.indexOf(">");

    if(inx > inc && nnx > 0)
    {
        var pre = text.substring(0, inx);
        var sub = text.substring(inx);

        text = pre;
        next = sub + next;        
    }

    return {
        txt: text,
        nxt: next
    }
}

function GetTextSections()
{
    const startend = GetRelativePosition();

    console.log(startend);

    const editText = GetEditorText().toString();

    console.log(editText);

    var preText = editText.substring(0, startend.start);
    var midText = editText.substring(startend.start, startend.end);
    var endText = editText.substring(startend.end);

    if(midText == '')
    {
        var procPre = RemoveCuts(preText, endText);

        preText = procPre.txt;
        endText = procPre.nxt;
    }
    else
    {
        var procPre = RemoveCuts(preText, midText);

        console.log(procPre);

        preText = procPre.txt;
        midText = procPre.nxt;

        var procMid = RemoveCuts(midText, endText);

        console.log(procMid);

        midText = procMid.txt;
        endText = procMid.nxt;
    }

    var value = {
        pre: preText,
        mid: midText,
        end: endText
    };

    console.log(value);

    return value;
}

function RemoveType(type) 
{
    var sect = GetTextSections();

    var txt = sect.pre + sect.mid + sect.end;

    txt = RemoveTextNode(txt, type);

    SetEditorText(txt);
}

function AddType(type, selectTyp)
{
    var sect = GetTextSections();

    var mid = sect.mid;

    var tyo = buildType(type, false);
    var tyc = buildType(type, true);

    if(selectTyp == SelectType.None)
    {
        mid = mid.replaceAll(tyo, "");
        mid = mid.replaceAll(tyc, "");

        var nText = sect.pre 
        + buildType(type, false) 
        + mid
        + buildType(type, true) 
        + sect.end;
    }
    else if(selectTyp == SelectType.First)
    {
        //remove the closing type
        mid = mid.replaceAll(tyc, "");

        var nText = sect.pre 
        + mid
        + buildType(type, true) 
        + sect.end;
    }
    else if(selectTyp == SelectType.Both)
    {
        mid = mid.replaceAll(tyo, "");
        mid = mid.replaceAll(tyc, "");

        console.log("both: " + mid);

        var nText = sect.pre 
        + buildType(type, true) 
        + mid
        + buildType(type, false) 
        + sect.end;
    }
    else if(selectTyp == SelectType.Last)
    {
        mid = mid.replaceAll(tyo, "");

        var nText = sect.pre 
        + buildType(type, false) 
        + mid
        + sect.end;
    }
    else if(selectTyp == SelectType.Enclosed)
    {
        mid = mid.replaceAll(tyo, "");
        mid = mid.replaceAll(tyc, "");

        var nText = sect.pre 
        + mid
        + buildType(type, true) 
        + sect.end;
    }
    else
    {
        sect.pre = sect.pre.replaceAll(tyo, "");
        mid = mid.replaceAll(tyc, "");

        var nText = sect.pre 
        + mid
        + sect.end;
    }

    nText = RemoveDuplicates(nText, type);

    SetEditorText(nText);
}

function InsertRawHTML(rawHtml)
{
    var txt = GetTextSections();

    if(txt.mid == '')
    {
        var nText = txt.pre + rawHtml + txt.end;

        SetEditorText(nText);
    }
    else{
        var nText = txt.pre + rawHtml + txt.end;

        SetEditorText(nText);
    }
}

function RemoveDuplicates(text, type)
{
    var val = text;

    var tyo = buildType(type, false);
    var tyc = buildType(type, true);

    if(val.includes(tyo + tyo))
    {
        val = val.replaceAll(tyo + tyo, "");
    }

    if(val.includes(tyc + tyc))
    {
        val = val.replaceAll(tyo + tyo, "");
    }

    return val;
}

function buildType(type, isClose)
{
    if(isClose) return '</' + type + '>';
    return '<' + type + '>';
}

function ValueIndependentLength(value, text)
{
    var val = text.replaceAll(value, "");

    return val.length;
}

function isInsideType(type)
{
    var sect = GetTextSections();

    var ctp = numberOfType(type, sect.pre);

    var ctm = numberOfType(type, sect.mid);

    var cte = numberOfType(type, sect.end);

    console.log(ctp, ctm, cte);

    var val = SelectType.None;

    if(ctp > 0 && cte < 0 ) {
        val = SelectType.Both;
    }
    else if(ctp > 0 && ctm < 0)
    {
        val = SelectType.Enclosed;
    }
    else{
        if(ctp > 0) val = SelectType.First;
        if(ctm > 0) val = SelectType.Last;
    }

    if(sect.pre.endsWith(buildType(type, false)))
    {
        if(sect.mid.endsWith(buildType(type, true)))
        {
            val = SelectType.Matches;
        }
    }

    return val;

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