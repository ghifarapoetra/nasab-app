import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { userId, userEmail, paymentId } = await req.json()
    if (!userId || !paymentId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Ambil payment & cek status
    const { data: payment } = await supabase
      .from('trakteer_payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (!payment) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 })
    if (payment.status === 'activated') return NextResponse.json({ error: 'Transaksi ini sudah digunakan' }, { status: 400 })
    if (payment.amount < 29000) return NextResponse.json({ error: 'Jumlah pembayaran belum cukup untuk Premium' }, { status: 400 })

    // Aktifkan premium
    const { error: updErr } = await supabase.from('profiles').update({
      is_premium: true,
      premium_since: new Date().toISOString(),
      premium_order_id: `TRAKTEER-${payment.transaction_id}-CLAIM`,
    }).eq('id', userId)

    if (updErr) return NextResponse.json({ error: 'Gagal update profile', detail: updErr.message }, { status: 500 })

    // Mark payment as activated
    await supabase.from('trakteer_payments').update({
      matched_user_id: userId,
      matched_email: userEmail,
      status: 'activated',
    }).eq('id', paymentId)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: err.message }, { status: 500 })
  }
}
