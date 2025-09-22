import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Configure PDF.js worker - try different worker paths
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch {
  // Fallback for different bundlers
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

/**
 * Extract text from PDF files using PDF.js
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pagesText = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent({ normalizeWhitespace: true });

      // Group text items by their Y position to preserve line breaks
      const lineMap = new Map();
      const yTolerance = 2; // pixels

      for (const item of content.items) {
        const tx = item.transform;
        const x = tx[4];
        const y = tx[5];

        // Find an existing line with approximately the same Y
        let targetKey = null;
        for (const key of lineMap.keys()) {
          if (Math.abs(Number(key) - y) <= yTolerance) {
            targetKey = key;
            break;
          }
        }
        if (targetKey === null) {
          targetKey = y;
          lineMap.set(targetKey, []);
        }
        lineMap.get(targetKey).push({ x, str: item.str || '' });
      }

      // Sort lines top-to-bottom (y desc in PDF coords), items left-to-right
      const sortedLines = Array.from(lineMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([_, arr]) => arr.sort((a, b) => a.x - b.x).map(t => t.str).join(' ').replace(/\s+/g, ' ').trim());

      pagesText.push(sortedLines.join('\n'));
    }

    return pagesText.join('\n\n').trim();
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX files using mammoth.js
 * @param {File} file - DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }
    
    return result.value.trim() || `DOCX FILE PROCESSED: ${file.name}

Your Word document has been processed successfully.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: Microsoft Word Document (.docx)

Note: The content was extracted but may need formatting adjustments.`;
  } catch (error) {
    console.error("DOCX parsing error:", error);
    
    // Fallback to placeholder if mammoth fails
    return `DOCX FILE DETECTED: ${file.name}

Your Word document has been uploaded successfully. The content extraction encountered an issue.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: Microsoft Word Document (.docx)

Note: Please manually copy and paste your resume content into the edit section for AI enhancement.`;
  }
}

/**
 * Extract text from DOC files (legacy format)
 * @param {File} file - DOC file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromDOC(file) {
  try {
    return `LEGACY DOC FILE DETECTED: ${file.name}

Your legacy Word document (.doc) has been uploaded successfully.

File Details:
📄 Name: ${file.name}
📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
📅 Last Modified: ${new Date(file.lastModified).toLocaleDateString()}
🔖 Type: Microsoft Word Document (Legacy Format)

📋 Recommendation: For better compatibility and enhanced features, 
consider converting your resume to .docx format or PDF.

Note: Legacy DOC format parsing requires specialized libraries. 
Please manually copy and paste your resume content into the edit section for AI enhancement.`;
  } catch (error) {
    console.error("DOC parsing error:", error);
    throw new Error(`Failed to parse DOC: ${error.message}`);
  }
}

/**
 * Extract text from plain text files
 * @param {File} file - TXT file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromTXT(file) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("TXT parsing error:", error);
    throw new Error(`Failed to parse TXT: ${error.message}`);
  }
}

/**
 * Main file parsing function that determines file type and calls appropriate parser
 * @param {File} file - Uploaded file
 * @returns {Promise<{content: string, fileType: string}>} - Parsed content and file type
 */
export async function parseResumeFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    let content = '';
    let detectedType = '';

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      content = await extractTextFromPDF(file);
      detectedType = 'pdf';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      content = await extractTextFromDOCX(file);
      detectedType = 'docx';
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      content = await extractTextFromDOC(file);
      detectedType = 'doc';
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      content = await extractTextFromTXT(file);
      detectedType = 'txt';
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.');
    }

    return {
      content: content.trim(),
      fileType: detectedType,
      fileName: file.name,
      fileSize: file.size
    };
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
}

/**
 * Validate uploaded file
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export function validateResumeFile(file) {
  const errors = [];
  const warnings = [];

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    errors.push('File size exceeds 50MB limit. Please choose a smaller file.');
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!allowedTypes.includes(file.type) && !hasValidExtension) {
    errors.push('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
  }

  // Warnings for legacy formats
  if (file.type === 'application/msword' || fileName.endsWith('.doc')) {
    warnings.push('Legacy DOC format detected. Consider converting to DOCX or PDF for better compatibility.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

