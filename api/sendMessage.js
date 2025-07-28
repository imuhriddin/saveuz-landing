// /api/sendMessage.js

export default async function handler(request, response) {
  // Faqat POST so'rovlarini qabul qilamiz
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = request.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Telegram uchun xabar matnini formatlash
  const text = `
    📬 **Yangi xabar (Save.uz saytidan)** 📬

    👤 **Ism:** ${name}
    ✉️ **Email:** ${email}
    📄 **Mavzu:** ${subject}

    📝 **Xabar:**
    ${message}
  `;

  // Telegram API ga so'rov yuborish
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown', // Xabarni chiroyli formatlash uchun
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (telegramResult.ok) {
      // Muvaffaqiyatli jo'natildi
      return response.status(200).json({ message: 'Message sent successfully!' });
    } else {
      // Telegramdan xatolik keldi
      return response.status(500).json({ message: 'Failed to send message.' });
    }
  } catch (error) {
    // Tizimda xatolik
    return response.status(500).json({ message: 'An error occurred.' });
  }
}