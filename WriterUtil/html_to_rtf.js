
class BasicRTFtoHTMLConverter {

    ConvertRTFtoHTML(rawRTF) {
        return this.BuildHTML(rawRTF);
    }

    ConvertHTMLtoRTF(rawHTML) {
        return this.BuildRTF(rawHTML);
    }

    BuildHTML(rawRTF) {
        var htmlText = this.ReplaceRTFwithTags(rawRTF);
        return htmlText; // Return just the content, not full HTML document
    }

    BuildRTF(rawHTML) {
        var rtfText = this.ReplaceTags(rawHTML);

        // Build RTF document according to specification
        const rtfHeader = '{\\rtf1\\ansi\\deff0';
        const fontTable = '{\\fonttbl{\\f0\\froman Times New Roman;}}';
        const colorTable = '{\\colortbl;\\red0\\green0\\blue0;}';
        const docFormat = '\\f0\\fs24 '; // Default font and size (12pt)
        const rtfFooter = '}';

        return `${rtfHeader}${fontTable}${colorTable}${docFormat}${rtfText}${rtfFooter}`;
    }

    ReplaceRTFwithTags(rawRTF) {
        let content = rawRTF;

        // Debug: log the input
        console.log('RTF Input:', rawRTF);

        // Remove RTF header and footer
        content = content.replace(/^\{\\rtf1\\ansi\\deff0\{\\fonttbl\{\\f0\\froman Times New Roman;\}\}\{\\colortbl;\\red0\\green0\\blue0;\}\\f0\\fs24 /, '');
        content = content.replace(/\}$/, '');

        // Handle HR first (most specific pattern)
        content = content.replaceAll('{\\par \\brdrt\\brdrnone\\brdrl\\brdrnone\\brdrb\\brdrdb \\par}', '<hr>');

        // Reverse the exact order of ReplaceTags operations
        // But be more careful about spaces - don't convert ALL spaces to &nbsp;

        // First undo the escaping (last operations in ReplaceTags)
        content = content.replaceAll('\\\\', '\\');
        content = content.replaceAll('\\{', '{');
        content = content.replaceAll('\\}', '}');

        // Then undo the tag replacements (in reverse order)
        content = content.replaceAll('\\ul0 ', '</u>');
        content = content.replaceAll('\\ul ', '<u>');
        content = content.replaceAll('\\i0 ', '</em>');
        content = content.replaceAll('\\i ', '<em>');
        content = content.replaceAll('\\strike0 ', '</s>');
        content = content.replaceAll('\\strike ', '<s>');
        content = content.replaceAll('\\b0 ', '</strong>');
        content = content.replaceAll('\\b ', '<strong>');
        content = content.replaceAll('{\\par', '<p><br>');
        content = content.replaceAll('\\par ', '<p><br>');
        content = content.replaceAll('}', '</p>');

        // Clean up any remaining patterns
        content = content.replaceAll('<br></p>', '</p>');
        content = content.replaceAll('<p><br>', '<p>');
        content = content.replaceAll('<p><p>', '<p><br>');

        // Fix HR pattern that might not have been caught
        content = content.replaceAll('\\brdrt\\brdrnone\\brdrl\\brdrnone\\brdrb\\brdrdb \\par', '<hr>');

        // If content doesn't start with <p> or <hr>, wrap it in <p>
        if (content && !content.startsWith('<p>') && !content.startsWith('<hr>')) {
            content = '<p>' + content;
        }

        // If content doesn't end with </p> or <hr>, close the paragraph
        if (content && !content.endsWith('</p>') && !content.endsWith('<hr>')) {
            content = content + '</p>';
        }

        console.log('Final HTML:', content);
        return content;
    }

    ReplaceTags(rawHTML) {


        rawHTML = rawHTML.replaceAll('}', '\\}');
        rawHTML = rawHTML.replaceAll('{', '\\{');
        rawHTML = rawHTML.replaceAll('\\', '\\\\');
        // hr needs a line insert
        rawHTML = rawHTML.replaceAll('<hr>', '{\\par \\brdrt\\brdrnone\\brdrl\\brdrnone\\brdrb\\brdrdb \\par}');
        rawHTML = rawHTML.replaceAll('&nbsp;', ' ');
        rawHTML = rawHTML.replaceAll('<p>', '{\\par ');
        rawHTML = rawHTML.replaceAll('</p>', '}');
        rawHTML = rawHTML.replaceAll('<br>', '\\par ');
        rawHTML = rawHTML.replaceAll('<strong>', '\\b ');
        rawHTML = rawHTML.replaceAll('</strong>', '\\b0 ');
        rawHTML = rawHTML.replaceAll('<s>', '\\strike ');
        rawHTML = rawHTML.replaceAll('</s>', '\\strike0 ');
        rawHTML = rawHTML.replaceAll('<em>', '\\i ');
        rawHTML = rawHTML.replaceAll('</em>', '\\i0 ');
        rawHTML = rawHTML.replaceAll('<u>', '\\ul ');
        rawHTML = rawHTML.replaceAll('</u>', '\\ul0 ');

        return rawHTML;
    }
}