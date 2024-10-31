import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NextResponse } from 'next/server';

interface BookingDetails {
    name: string;
    date: string;
    time: string;
}

interface TelegramResponse {
    ok: boolean;
    result: any;
    description?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    const { bookingDetails }: { bookingDetails: BookingDetails } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Bot token ou chat ID não estão definidos");
        return NextResponse.json({ error: 'Bot token or chat ID not set' }, { status: 500 });
    }

    try {
        const message = `💇🏼 Novo agendamento! 😀\n\nNome: ${bookingDetails.name}\nData: ${format(bookingDetails.date, "dd/MM/yyy", { locale: ptBR })}\nHora: ${format(bookingDetails.time, "HH:mm", { locale: ptBR })}`;

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        const responseData: TelegramResponse = await response.json();
        console.log("Resposta do Telegram:", responseData);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Erro ao enviar mensagem no Telegram:", error);
        return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
    }
}
