const editor = document.getElementById("editor");

var paraCount = 0;
var selectedParagraph = null;
var hasSet = false;

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
    "Lexend",
    "Times New Roman"
];

const FontClassName = [
    "BonaNova",
    "MedulaOne",
    "CutiveMono",
    "Lexend",
    "TimesNewRoman"
];


editor.addEventListener("focus", function() {

    // if(editor.innerHTML.trim() == "")
    // {
    //     InsertRawHTML('<p id="initP"></p>', GetTextSections());
    // }
});

editor.addEventListener('click', function(event) {

    var ele = document.elementFromPoint(event.clientX, event.clientY);

    if(ele.tagName == "P")
    {
        selectedParagraph = ele;
    }

    hasSet = false;

});

document.addEventListener('selectionchange', function(event) {

    // if(!hasSet)
    // {
    //     hasSet = true;

    //     var sel = GetTextSections();

    //     console.log(sel);

    //     var paras = editor.getElementsByTagName("p");
        
    //     if(sel.mid == '')
    //     {
    //         if(sel.end == '')
    //         {
    //             // is after end
    //             var par = paras[paras.length - 1];
    //             //var rang = SetSelectionToEnd(par);
    //         }

    //         if(sel.pre == '')
    //         {
    //             // is before start
    //             var par = paras[0];
    //             //var rang = SetSelectionToEnd(par);
    //             //AssignRange(par);
    //         }
    //     }

    //     //RemoveAllSelections();
    // }
    
});

// MARK: PASTE
editor.addEventListener("paste", function(event){

    event.preventDefault();
    event.stopPropagation();

    var text = (event.originalEvent || event).clipboardData.getData('text/plain');

    var sect = GetTextSections();

    // make sure the selection is inside a paragraph
    var move = MoveIntoParagraph(sect);

    InsertRawHTML(text, move.sect);

    if(move.id != "")
    {
        var para = document.getElementById(move.id);
        AssignRange(para);
        para.removeAttribute("id");
    }
    else
    {
        if(selectedParagraph) AssignRange(selectedParagraph);
    }   
});

//MARK: KEYDOWN
editor.addEventListener("keydown", function(event){

    if(event.key == "Enter")
    {
        event.preventDefault();
        
        var pel = 'p_' + (paraCount++).toString();

        var sect = GetTextSections();
        
        //console.log(sect);

        var raw = '</p><p id="' + pel + '">';

        if(sect.pre.endsWith("<p>"))
        {
            raw = '<br>' + raw;
        }

        if(!HasTextContent(sect)){ raw += '<br>';}

        InsertRawHTML(raw, sect);

        var element = document.getElementById(pel);

        selectedParagraph = element;

        SetSelectionToStart(element);

        element.removeAttribute("id");
    }
    else if(event.key == "Tab")
    {
        event.preventDefault();

        var pel = 'p_' + (paraCount++).toString();

        InsertRawHTML('<span id="' + pel + '"></span>', GetTextSections());

        var element = document.getElementById(pel);

        element.appendChild(document.createTextNode('\t'));
        element.style.whiteSpace = 'pre';

        SetSelectionToEnd(element);

        element.removeAttribute("id");
    }
});

function RemoveAllSelections()
{
    const sel = window.getSelection();
    sel.removeAllRanges();
}

function SetSelectionToEnd(element) {

    const range = document.createRange();
    
    // Set the range to the end of the contenteditable element
    range.selectNodeContents(element);
    range.collapse(false); // false means collapse to end

    const selection = window.getSelection();
    

    selection.removeAllRanges();

    selection.addRange(range);
    
   // element.focus();
  }

  function SetSelectionToStart(element) {

    const range = document.createRange();
    
    // Set the range to the end of the contenteditable element
    range.selectNodeContents(element);
    range.collapse(true); 

    const selection = window.getSelection();
    

    selection.removeAllRanges();

    selection.addRange(range);
    
   // element.focus();
  }

function HasTextContent(sections)
{
    var inside = false;

    for(var v = 0; v < sections.end.length; v++)
    {
        if(sections.end[v] == '<') inside = true;
        if(sections.end[v] == '>') inside = false;


        if(!inside && sections.end[v] != '')
        {
            return true;
        }
    }

    return false;
}

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

    if(element)
    {
        if(element.lastChild)
            range.selectNodeContents(element.lastChild);
        else range.selectNodeContents(element);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    return selection;
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
    text = RemoveEmpty(text, "p");
    editor.innerHTML = text;
}

function ClearFormating()
{
    if(selectedParagraph)
    {
        var txt = selectedParagraph.innerText;
        selectedParagraph.innerHTML = txt;
        selectedParagraph.removeAttribute("align");
        selectedParagraph.removeAttribute("class");
    }
}

function InsertLine()
{
    var sect = GetTextSections();

    sect = MovePairsForInsert(sect);

    InsertRawHTML('<hr/>', sect);
}

function InsertTab() {    
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const span = document.createElement('span');
    span.appendChild(document.createTextNode('\t'));
    span.style.whiteSpace = 'pre';
    range.insertNode(span);

    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
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

function MoveIntoParagraph(sections)
{
    var eid = "p_" + (paraCount++);

    if(!IsInParagraph(sections))
    { 
       sections.pre += '<p id="' + eid + '">';
       sections.end += '</p>';
    }
    else
    {
        eid = "";
    }
    
    return {
        sect: sections,
        id: eid
    };
}

function IsInParagraph(sections)
{
    if(sections)
    {

        var rel = GetRelativePosition();

        var last = sections.pre.lastIndexOf("<p");
        var clse = sections.pre.lastIndexOf("</p");

        console.log(last, clse);

        if(sections.mid == '')
        {
            if(rel.start == rel.end)
            {
                if(rel.start == clse + 4)
                {
                    return true;
                }
            }
        }

        if(last != -1 && last > clse)
        {
            return true;
        }
    }
    
    return false;
}

//MARK: MOVE PAIRS

// moves open and close to the right location
function MovePairsForInsert(sections)
{
    if(sections.mid == '')
    { 
        var last = sections.pre.lastIndexOf("<p");
        var clse = sections.pre.lastIndexOf("</p");

        if(last != -1 && last > clse)
        {
            var befr = sections.pre.substring(0, last);
            var plst = sections.pre.substring(last);


            sections.pre = befr;
            sections.end = plst + sections.end;
        }
    }

    return sections;
}

// moves paragraph into pre
function MovePairsForEnter(sections)
{
    if(sections.mid == '')
    { 
        var clse = sections.end.indexOf("</p");

        if(clse != -1)
        {
            var befr = sections.end.substring(0, clse + "</p>".length);
            var plst = sections.end.substring(clse + "</p>".length);

            sections.pre += befr;
            sections.end = plst;
        }
    }

    return sections;
}

// removes breaks in an element but not pairs
function GetTextSections()
{
    const startend = GetRelativePosition();

    const editText = GetEditorText().toString();

    var preText = editText.substring(0, startend.start);
    var midText = editText.substring(startend.start, startend.end);
    var endText = editText.substring(startend.end);

    if(midText == '')
    {
        var procPre = RemoveCuts(preText, endText);

        preText = procPre.txt;
        endText = procPre.nxt;

        if(endText.startsWith("<hr>"))
        {
            endText = endText.substring("<hr>".length);
            preText += "<hr>";
        }
    }
    else
    {
        var procPre = RemoveCuts(preText, midText);

        preText = procPre.txt;
        midText = procPre.nxt;

        var procMid = RemoveCuts(midText, endText);

        midText = procMid.txt;
        endText = procMid.nxt;
    }

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

function AddType(type, selectTyp)
{
    var sect = GetTextSections();

    if(!IsInParagraph(sect))
    {
        sect = MovePairsForInsert(sect);
    }

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

function InsertRawHTML(rawHtml, sections)
{
    var txt = sections;
    var nText = '';

    if(txt.mid == '')
    {
        nText = txt.pre + rawHtml + txt.end;

        SetEditorText(nText);
    }
    else
    {
        nText = txt.pre + rawHtml + txt.end;

        SetEditorText(nText);
    }

   // console.log(nText);
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

function RemoveEmpty(text, type)
{
    var val = text;

    var tyo = buildType(type, false);
    var tyc = buildType(type, true);

    if(val.includes(tyo + tyc))
    {
        val = val.replaceAll(tyo + tyc, "");
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

function WordCount(element)
{
    var text = element.innerText;

    // splits at space and newline etc.
    var splt = text.split(/\s+/);

    return splt.length;
}