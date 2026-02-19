const fs = require('fs');
const path = require('path');

// Test data - similar to what would come from the frontend
const testActivityContent = JSON.stringify({
  "multiple_choice_sentences": [
    {
      "sentence": "The cat ___ on the mat.",
      "options": ["sits", "sat", "sitting", "sit"],
      "correct_option": 0
    },
    {
      "sentence": "She ___ to school every day.",
      "options": ["go", "goes", "going", "gone"],
      "correct_option": 1
    }
  ],
  "open_question": "Describe your favorite animal and explain why you like it."
});

const testData = {
  activityContent: testActivityContent,
  activityId: "test_full_" + Date.now()
};

console.log('Testing PDF generation with data:');
console.log('Activity ID:', testData.activityId);
console.log('Content length:', testData.activityContent.length);
console.log('\nSending request to generate PDF...\n');

fetch('http://localhost:3000/api/generate-pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(async response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
})
.then(data => {
  console.log('\n✓ PDF Generation Response:', data);
  
  if (data.success && data.pdfId) {
    console.log('\n🔗 PDF ID:', data.pdfId);
    console.log('📥 Download URL: http://localhost:3000/api/download-pdf/' + data.pdfId);
    
    // Now test downloading the PDF
    console.log('\nAttempting to download PDF...\n');
    
    return fetch('http://localhost:3000/api/download-pdf/' + data.pdfId)
      .then(async downloadResponse => {
        console.log('Download response status:', downloadResponse.status);
        console.log('Download response headers:', Object.fromEntries(downloadResponse.headers.entries()));
        
        if (!downloadResponse.ok) {
          throw new Error('Failed to download PDF');
        }
        
        // Get the PDF as an array buffer
        const arrayBuffer = await downloadResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log('✓ PDF downloaded successfully!');
        console.log('📦 PDF size:', buffer.length, 'bytes');
        
        // Check if it's a valid PDF (should start with %PDF)
        const header = buffer.toString('utf8', 0, 5);
        console.log('📄 PDF header:', header);
        
        if (header.startsWith('%PDF')) {
          console.log('✅ PDF header is valid!');
          
          // Save to file for manual inspection
          const testFile = path.join(__dirname, 'test-output.pdf');
          fs.writeFileSync(testFile, buffer);
          console.log('💾 PDF saved to:', testFile);
          console.log('\n🎉 All tests passed! You can open test-output.pdf to verify.');
        } else {
          console.error('❌ Invalid PDF header! File may be corrupted.');
          console.log('First 100 bytes:', buffer.toString('utf8', 0, 100));
        }
      });
  } else {
    console.error('❌ PDF generation failed');
  }
})
.catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error('Error:', error);
  process.exit(1);
});
