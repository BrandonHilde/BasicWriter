
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

        // Step-by-step RTF parsing with better regex patterns
        // Remove opening RTF header
        content = content.replace(/^\{\\rtf1\\ansi\\deff0/, '');

        // Remove font table (simpler pattern that matches the actual structure)
        content = content.replace(/\{\\fonttbl\{[^}]+\}\}/, '');

        // Remove color table (more robust pattern)
        content = content.replace(/\{\\colortbl[^}]*\}/, '');

        // Remove document formatting
        content = content.replace(/\\f\d+\\fs\d+\s*/, '');

        // Remove final closing brace
        content = content.replace(/\}$/, '');

        console.log('After structure removal:', content);

        // Convert RTF formatting to HTML tags - preserve spaces properly
        content = content.replace(/\\par\s*/g, '<br>');

        // Bold tags - handle spaces carefully
        content = content.replaceAll(/\\b\s+/g, '<b>');
        content = content.replaceAll(/\\b0\s+/g, '</b> ');
        content = content.replaceAll(/\\b0$/g, '</b>');

        // Italic tags - handle spaces carefully
        content = content.replaceAll(/\\i\s+/g, '<em>');
        content = content.replaceAll(/\\i0\s+/g, '</em> ');
        content = content.replaceAll(/\\i0$/g, '</em>');

        // Underline tags - handle spaces carefully
        content = content.replaceAll(/\\ul\s+/g, '<u>');
        content = content.replaceAll(/\\ul0\s+/g, '</u> ');
        content = content.replaceAll(/\\ul0$/g, '</u>');

        // Strikethrough tags - handle spaces carefully
        content = content.replaceAll(/\\strike\s+/g, '<s>');
        content = content.replaceAll(/\\strike0\s+/g, '</s> ');
        content = content.replaceAll(/\\strike0$/g, '</s>');

        // Clean up multiple consecutive spaces but preserve single spaces
        content = content.replaceAll(/\s{2,}/g, ' ').trim();

        // Fix spacing around punctuation - remove space before punctuation
        content = content.replaceAll(/\s+([,;.])/g, '$1');

        console.log('Final HTML:', content);
        return content;
    }

    ReplaceTags(rawHTML) {

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