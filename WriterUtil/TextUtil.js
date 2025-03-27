const editor = document.getElementById("editor");

function RetrieveText(docfragment)
{
    var div = document.createElement('div');
    div.appendChild(docfragment.cloneNode(true));

    return div.innerHTML.trim();
}

function RemoveTextNode(rawhtml, node)
{
    rawhtml = rawhtml.replaceAll('<' + node + '>', "");
    rawhtml = rawhtml.replaceAll('</' + node + '>', "");

    return rawhtml;
}

function SimplifyFormat(type)
{
    var raw = editor.innerHTML;

    raw = raw.replaceAll('</' + type + '><'+ type + '>', "");

    editor.innerHTML = raw;
}

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
    const textBefore = RetrieveText(range.cloneContents());

    // Return the length of this text
    return textBefore.length;
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

    const editText = GetEditorText();

    var preText = editText.substring(0, startend.start);
    var midText = editText.substring(startend.start, startend.end);
    var endText = editText.substring(startend.end);

    return {
        pre: preText,
        mid: midText,
        end: endText
    };
}

function RemoveType(type) 
{
    var sect = GetTextSections();

    SetEditorText(sect.pre + sect.mid + sect.end);
}

function AddType(type)
{
    var sect = GetTextSections();

    var nText = sect.pre 
    + buildType(type, false) 
    + sect.mid 
    + buildType(type, true) 
    + sect.end;

    SetEditorText(nText);
}

function buildType(type, isClose)
{
    if(isClose) return '</' + type + '>';
    return '<' + type + '>';
}