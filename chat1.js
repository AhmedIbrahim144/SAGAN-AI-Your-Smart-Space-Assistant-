const chatBox = document.getElementById('chat-box');
const input = document.getElementById('userInput');

async function sendMessage() {
  const question = input.value.trim();
  if (!question) return;

  chatBox.innerHTML += `<div class="message user">👤 You: ${question}</div>`;
  input.value = '';

  const isImageRequest = /صورة|ارسم|صمم|picture|draw|generate.*image/i.test(question);

  if (isImageRequest) {
    try {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          prompt: question,
          n: 1,
          size: "512x512"
        })
      });

      const imageData = await imageResponse.json();
      const imageUrl = imageData.data[0].url;
      chatBox.innerHTML += `<div class="message bot">🖼️ SAGAN AI:<br><img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 10px; margin-top: 10px;"/></div>`;
    } catch (error) {
      chatBox.innerHTML += `<div class="message bot">⚠️ خطأ في توليد الصورة: ${error.message}</div>`;
    }
  } else {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد ذكي اسمه SAGAN AI. رد على المستخدم بنفس اللغة التي كتب بها سؤاله. اجعل الرد منظمًا قدر الإمكان، وإذا أمكن، استخدم التنقيط والترتيب.'
            },
            { role: 'user', content: question }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        const formattedReply = reply
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(line => `<div>• ${line}</div>`)
          .join('');

        chatBox.innerHTML += `<div class="message bot"> SAGAN AI:<br>${formattedReply}</div>`;
      } else {
        chatBox.innerHTML += `<div class="message bot">❌ لم يتم العثور على رد من النموذج.</div>`;
      }
    } catch (error) {
      chatBox.innerHTML += `<div class="message bot">⚠️ خطأ: ${error.message}</div>`;
    }
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Enter = إرسال
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// 🗑️ مسح المحادثة
function clearChat() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox) {
    chatBox.innerHTML = '';
  }
}
